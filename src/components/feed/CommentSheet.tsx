import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
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
  const { session } = useAuth();
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrapper}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
          ]}
        >
          <Text style={[typography.h3, { color: colors.textPrimary, padding: spacing.md }]}>Comentarios</Text>
          <FlatList
            data={comments}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
            renderItem={({ item }) => {
              const author = usersById[item.userId];
              return (
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <Avatar uri={author?.avatarUrl} name={author?.name ?? '?'} size={28} />
                  <View style={{ flex: 1 }}>
                    <Text style={[typography.caption, { color: colors.textPrimary }]}>
                      <Text style={typography.bodyBold}>{author?.name ?? 'Alguien'}</Text> {item.text}
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
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Escribe un comentario..."
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                { borderColor: colors.border, borderRadius: radius.md, color: colors.textPrimary },
              ]}
            />
            <Pressable onPress={handleSend} disabled={sending || !text.trim()}>
              <MaterialCommunityIcons
                name="send"
                size={22}
                color={text.trim() ? colors.accentPrimary : colors.textSecondary}
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
  sheetWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheet: { maxHeight: '70%' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12, paddingVertical: 8 },
});
