import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/SettingsContext';
import { useSheetFrame } from '@/hooks/useSheetFrame';
import { services } from '@/services';
import { useTheme } from '@/theme';
import type { Comment, User } from '@/types';
import { timeAgo } from '@/utils/date';

type Props = {
  visible: boolean;
  onClose: () => void;
  drinkLogId: string;
  usersById: Record<string, User>;
};

export function CommentSheet({ visible, onClose, drinkLogId, usersById }: Props) {
  const { colors, spacing, radius, typography } = useTheme();
  const { t } = useTranslation();
  const { session } = useAuth();
  const sheetFrame = useSheetFrame();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (visible) services.drinkLogs.listComments(drinkLogId).then(setComments);
  }, [visible, drinkLogId]);

  const handleSend = async () => {
    if (!session || !text.trim() || sending) return;
    setSending(true);
    const comment = await services.drinkLogs.addComment(drinkLogId, session.user.id, text.trim());
    setComments((prev) => [...prev, comment]);
    setText('');
    setSending(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.sheetWrapper, sheetFrame]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
          ]}
        >
          <Text style={[typography.h3, { color: colors.textPrimary, padding: spacing.md }]}>{t('feed.commentsTitle')}</Text>
          <FlatList
            data={comments}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ paddingHorizontal: spacing.inset, gap: spacing.sm }}
            renderItem={({ item }) => {
              const author = usersById[item.userId];
              return (
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <Avatar uri={author?.avatarUrl} name={author?.name ?? '?'} size={28} />
                  <View style={{ flex: 1 }}>
                    <Text style={[typography.caption, { color: colors.textPrimary }]}>
                      <Text style={typography.bodyBold}>{author?.name ?? t('feed.someone')}</Text> {item.text}
                    </Text>
                    <Text style={[typography.tiny, { color: colors.textSecondary }]}>{timeAgo(item.createdAt)}</Text>
                  </View>
                </View>
              );
            }}
            style={{ maxHeight: 280 }}
          />
          <View
            style={[
              styles.inputRow,
              { padding: spacing.md, borderTopColor: colors.border, gap: spacing.sm },
            ]}
          >
            <Input
              value={text}
              onChangeText={setText}
              placeholder={t('feed.commentPlaceholder')}
              style={{ flex: 1, paddingVertical: spacing.xs + 4 }}
            />
            <Pressable onPress={handleSend} disabled={sending || !text.trim()}>
              <MaterialCommunityIcons
                name="send"
                size={22}
                color={text.trim() ? colors.accentText : colors.textSecondary}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#00000066' },
  sheetWrapper: {},
  sheet: { maxHeight: '70%' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth },
});
