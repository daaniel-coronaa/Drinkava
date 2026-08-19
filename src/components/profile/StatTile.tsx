import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme';

type Props = {
  label: string;
  value: string | number;
};

export function StatTile({ label, value }: Props) {
  const { colors, typography } = useTheme();
  return (
    <Card style={{ flex: 1, alignItems: 'center' }}>
      <Text style={[typography.h1, { color: colors.textPrimary }]}>{value}</Text>
      <View style={{ height: 4 }} />
      <Text style={[typography.tiny, { color: colors.textSecondary, textAlign: 'center' }]}>{label}</Text>
    </Card>
  );
}
