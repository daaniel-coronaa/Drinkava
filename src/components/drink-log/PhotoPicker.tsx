import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  uri?: string;
  onChange: (uri: string | undefined) => void;
  label: string;
};

export function PhotoPicker({ uri, onChange, label }: Props) {
  const { colors, spacing, radius, typography } = useTheme();

  const pick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) onChange(result.assets[0].uri);
  };

  if (uri) {
    return (
      <Pressable onPress={pick} style={{ marginTop: spacing.sm }}>
        <Image source={{ uri }} style={{ width: '100%', height: 160, borderRadius: radius.md }} contentFit="cover" />
        <Pressable
          onPress={() => onChange(undefined)}
          style={[styles.removeBadge, { backgroundColor: colors.surface, borderRadius: radius.pill }]}
        >
          <MaterialCommunityIcons name="close" size={16} color={colors.textPrimary} />
        </Pressable>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={pick}
      style={[
        styles.placeholder,
        { borderColor: colors.border, borderRadius: radius.md, marginTop: spacing.sm, paddingVertical: spacing.lg },
      ]}
    >
      <MaterialCommunityIcons name="camera-plus-outline" size={28} color={colors.textSecondary} />
      <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.xs }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placeholder: { alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderStyle: 'dashed' },
  removeBadge: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
});
