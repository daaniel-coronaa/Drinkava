import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Platform, Share, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChallengeCard } from '@/components/challenge/ChallengeCard';
import { ChallengeSettingsSheet } from '@/components/challenge/ChallengeSettingsSheet';
import { DisclaimerBanner } from '@/components/compliance/DisclaimerBanner';
import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow';
import { ScoreBreakdownSheet } from '@/components/leaderboard/ScoreBreakdownSheet';
import { DrinkLogCard } from '@/components/feed/DrinkLogCard';
import { ParticipantRow } from '@/components/party/ParticipantRow';
import { PartyStatusBadge } from '@/components/party/PartyStatusBadge';
import { ActionSheet, type SheetAction } from '@/components/ui/ActionSheet';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { PressableScale } from '@/components/ui/PressableScale';
import { Segmented } from '@/components/ui/Segmented';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useParty } from '@/hooks/useParty';
import { useUsersMap } from '@/hooks/useUsersMap';
import { NotAuthorizedError, services } from '@/services';
import { useTheme } from '@/theme';
import { enter, smoothLayout } from '@/theme/motion';
import type { ChallengeAssignment, DrinkLog, LeaderboardEntry } from '@/types';
import { formatDateTime } from '@/utils/date';

type Section = 'feed' | 'members' | 'leaderboard';
type FeedItem =
  | { type: 'drink'; timestamp: string; log: DrinkLog }
  | { type: 'challenge'; timestamp: string; assignment: ChallengeAssignment };

export default function PartyDetailScreen() {
  const { partyId } = useLocalSearchParams<{ partyId: string }>();
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { session } = useAuth();
  const { party, members, memberUsers, logs, challengeAssignments, loading, refetch } = useParty(partyId);
  const { usersById } = useUsersMap();
  const { entries } = useLeaderboard(partyId ? { partyId } : null);
  const [section, setSection] = useState<Section>('feed');
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
  const [challengeSettingsVisible, setChallengeSettingsVisible] = useState(false);
  const [finishConfirmVisible, setFinishConfirmVisible] = useState(false);
  const [leaveConfirmVisible, setLeaveConfirmVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);

  if (!party) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {!loading && <EmptyState icon="alert-circle-outline" title={t('partyDetail.notFound')} />}
      </SafeAreaView>
    );
  }

  const myRole = members.find((m) => m.userId === session?.user.id)?.role;
  const isAdmin = myRole === 'admin';
  const isHost = session?.user.id === party.hostId;

  // Secondary actions live behind the "···" header button so the screen keeps one obvious
  // primary action (log a drink).
  const actions: SheetAction[] = [];
  if (isHost && party.status === 'active') {
    actions.push({ key: 'configure', label: t('partyDetail.configureButton'), icon: 'sword-cross', onPress: () => setChallengeSettingsVisible(true) });
  }
  if (isAdmin && party.status === 'active') {
    actions.push({ key: 'finish', label: t('partyDetail.finishButton'), icon: 'flag-checkered', onPress: () => setFinishConfirmVisible(true), destructive: true });
  }
  if (!isAdmin && myRole) {
    actions.push({ key: 'leave', label: t('partyDetail.leaveButton'), icon: 'exit-run', onPress: () => setLeaveConfirmVisible(true), destructive: true });
  }

  const feedItems: FeedItem[] = [
    ...logs.map((log): FeedItem => ({ type: 'drink', timestamp: log.timestamp, log })),
    ...challengeAssignments.map((assignment): FeedItem => ({ type: 'challenge', timestamp: assignment.sentAt, assignment })),
  ].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  const handleChallengeChanged = async (countsAsTurn: boolean) => {
    if (countsAsTurn) await services.challenges.maybeTriggerNextChallenge(party.id);
    await refetch();
  };

  const handleShare = async () => {
    const link = `drinkava://party/join?code=${party.inviteCode}`;
    const message = `${t('partyDetail.inviteRow', { code: party.inviteCode })} · ${link}`;

    if (Platform.OS === 'web') {
      // react-native-web's Share.share only works over navigator.share, which most
      // desktop browsers don't implement — it silently rejects there. Fall back to
      // copying the invite to the clipboard so "compartir" always does something.
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({ title: 'Drinkava', text: message, url: link });
        } catch {
          // user dismissed the native share sheet — nothing to do
        }
        return;
      }
      try {
        await navigator.clipboard.writeText(message);
        window.alert(t('partyDetail.shareCopied'));
      } catch {
        window.alert(t('partyDetail.shareCodeFallback', { code: party.inviteCode }));
      }
      return;
    }

    try {
      await Share.share({ message });
    } catch {
      Alert.alert(t('partyDetail.shareErrorTitle'), t('partyDetail.shareCodeFallback', { code: party.inviteCode }));
    }
  };

  const notifyError = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  const finishParty = async () => {
    if (!session) return;
    try {
      await services.parties.updateStatus(party.id, 'finished', session.user.id);
      await refetch();
    } catch (e) {
      notifyError(
        t('partyDetail.finishErrorTitle'),
        e instanceof NotAuthorizedError ? t('partyDetail.finishErrorNotAuthorized') : t('common.genericError'),
      );
    }
  };

  const confirmFinishParty = () => {
    setFinishConfirmVisible(false);
    finishParty();
  };

  const leaveParty = async () => {
    if (!session) return;
    try {
      await services.parties.leave(party.id, session.user.id);
      router.replace('/(tabs)/parties');
    } catch (e) {
      notifyError(
        t('partyDetail.leaveErrorTitle'),
        e instanceof NotAuthorizedError ? t('partyDetail.leaveErrorNotAuthorized') : t('common.genericError'),
      );
    }
  };

  const confirmLeaveParty = () => {
    setLeaveConfirmVisible(false);
    leaveParty();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerRight: () =>
            actions.length > 0 ? (
              <PressableScale
                onPress={() => setActionsVisible(true)}
                accessibilityLabel={t('partyDetail.moreActions')}
                style={styles.moreButton}
              >
                <MaterialCommunityIcons name="dots-horizontal" size={26} color={colors.textPrimary} />
              </PressableScale>
            ) : null,
        }}
      />

      <Animated.View entering={enter(0)} style={{ paddingHorizontal: spacing.inset, paddingTop: spacing.sm, paddingBottom: spacing.md, gap: spacing.xs }}>
        <View style={styles.row}>
          <Text style={[typography.h1, { color: colors.textPrimary, flex: 1 }]}>{party.name}</Text>
          <PartyStatusBadge status={party.status} />
        </View>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          {[formatDateTime(party.date), party.location].filter(Boolean).join(' · ')}
        </Text>

        <PressableScale onPress={handleShare} hitSlop={{ top: 12, bottom: 12 }} style={[styles.row, { marginTop: spacing.xs, alignSelf: 'flex-start' }]}>
          <MaterialCommunityIcons name="share-variant-outline" size={16} color={colors.accentText} />
          <Text style={[typography.caption, { color: colors.accentText, marginLeft: 6 }]}>
            {t('partyDetail.inviteRow', { code: party.inviteCode })}
          </Text>
        </PressableScale>

        {party.status === 'active' ? (
          <Button
            label={t('partyDetail.registerButton')}
            onPress={() => router.push({ pathname: '/drink-log/new', params: { partyId: party.id } })}
            style={{ marginTop: spacing.sm }}
          />
        ) : (
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.sm }]}>
            {t('partyDetail.partyEndedNote')}
          </Text>
        )}
      </Animated.View>

      <View style={{ marginHorizontal: spacing.inset, marginBottom: spacing.sm }}>
        <Segmented<Section>
          options={[
            { key: 'feed', label: t('partyDetail.tabFeed') },
            { key: 'members', label: t('partyDetail.tabMembers') },
            { key: 'leaderboard', label: t('partyDetail.tabRanking') },
          ]}
          value={section}
          onChange={setSection}
        />
      </View>

      {section === 'feed' && (
        <FlatList
          data={feedItems}
          keyExtractor={(item) => (item.type === 'drink' ? item.log.id : item.assignment.id)}
          ListHeaderComponent={<DisclaimerBanner />}
          ListEmptyComponent={<EmptyState icon="glass-cocktail" title={t('partyDetail.emptyFeed')} />}
          renderItem={({ item, index }) => (
            <Animated.View entering={enter(index)} layout={smoothLayout}>
              {item.type === 'drink' ? (
                <DrinkLogCard drinkLog={item.log} usersById={usersById} />
              ) : (
                <ChallengeCard
                  assignment={item.assignment}
                  usersById={usersById}
                  currentUserId={session?.user.id ?? ''}
                  isHost={isHost}
                  onChanged={handleChallengeChanged}
                />
              )}
            </Animated.View>
          )}
        />
      )}

      {section === 'members' && (
        <FlatList
          data={members}
          keyExtractor={(m) => m.userId}
          renderItem={({ item, index }) => {
            const user = memberUsers.find((u) => u.id === item.userId);
            if (!user) return null;
            return (
              <Animated.View entering={enter(index)}>
                <ParticipantRow user={user} joinedAt={item.joinedAt} role={item.role} />
              </Animated.View>
            );
          }}
        />
      )}

      {section === 'leaderboard' && (
        <FlatList
          data={entries}
          keyExtractor={(e) => e.userId}
          ListEmptyComponent={<EmptyState icon="trophy-outline" title={t('partyDetail.emptyRanking')} />}
          renderItem={({ item, index }) => (
            <Animated.View entering={enter(index)}>
              <LeaderboardRow entry={item} user={usersById[item.userId]} onPress={() => setSelectedEntry(item)} />
            </Animated.View>
          )}
        />
      )}

      <ActionSheet
        visible={actionsVisible}
        onClose={() => setActionsVisible(false)}
        title={t('partyDetail.actionsTitle')}
        actions={actions}
      />

      <ScoreBreakdownSheet
        visible={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        entry={selectedEntry}
        userName={selectedEntry ? usersById[selectedEntry.userId]?.name : undefined}
      />

      <ChallengeSettingsSheet
        visible={challengeSettingsVisible}
        onClose={() => setChallengeSettingsVisible(false)}
        partyId={party.id}
        onSaved={refetch}
      />

      <ConfirmDialog
        visible={finishConfirmVisible}
        title={t('partyDetail.finishConfirmTitle')}
        message={t('partyDetail.finishConfirmMessage', { name: party.name })}
        confirmLabel={t('partyDetail.finishConfirmConfirm')}
        destructive
        onConfirm={confirmFinishParty}
        onCancel={() => setFinishConfirmVisible(false)}
      />

      <ConfirmDialog
        visible={leaveConfirmVisible}
        title={t('partyDetail.leaveConfirmTitle')}
        message={t('partyDetail.leaveConfirmMessage', { name: party.name })}
        confirmLabel={t('partyDetail.leaveConfirmConfirm')}
        destructive
        onConfirm={confirmLeaveParty}
        onCancel={() => setLeaveConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  moreButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
