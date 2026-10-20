import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/theme';
import type { User } from '@/types';

// Overlapping avatars, each ringed in the card color so they read as a stack.
export function FriendAvatarStack({ users, size = 32, max = 4 }: { users: User[]; size?: number; max?: number }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row' }}>
      {users.slice(0, max).map((u, i) => (
        <View
          key={u.id}
          style={{
            marginLeft: i === 0 ? 0 : -size * 0.3,
            borderWidth: 2,
            borderColor: colors.surface,
            borderRadius: size,
          }}
        >
          <Avatar uri={u.avatarUrl} name={u.name} size={size} />
        </View>
      ))}
    </View>
  );
}
