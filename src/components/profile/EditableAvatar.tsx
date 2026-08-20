import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/theme';

type Props = {
  uri?: string;
  name: string;
  size?: number;
  onChange: (uri: string) => Promise<void>;
};

// SEAM: picked photo stays a local file URI in the mock flow. Real impl uploads to
// Supabase Storage and stores the resulting signed URL, same as party/drink photos.
export function EditableAvatar({ uri, name, size = 80, onChange }: Props) {
  const { colors, radius } = useTheme();
  const [saving, setSaving] = useState(false);

  const pick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled || !result.assets[0]) return;
    setSaving(true);
    try {
      await onChange(result.assets[0].uri);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Pressable onPress={pick} disabled={saving} style={{ width: size, height: size }}>
      <Avatar uri={uri} name={name} size={size} />
      {saving ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#00000088',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator color="#FFFFFF" />
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.34,
            height: size * 0.34,
            borderRadius: radius.pill,
            backgroundColor: colors.accentPrimary,
            borderWidth: 2,
            borderColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialCommunityIcons name="camera" size={size * 0.18} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}
