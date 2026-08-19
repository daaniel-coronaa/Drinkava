import { ScrollView, Text } from 'react-native';

import { useTheme } from '@/theme';

export default function PrivacyScreen() {
  const { colors, spacing, typography } = useTheme();
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <Text style={[typography.h2, { color: colors.textPrimary }]}>Política de Privacidad</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Drinkava guarda la información que compartes dentro de tus fiestas (registros de bebidas, fotos, kudos y
        comentarios) para mostrarla a los miembros de esa fiesta y calcular el ranking. Tu fecha de nacimiento se usa
        únicamente para verificar que eres mayor de edad.
      </Text>
      <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>Datos que almacenamos</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Nombre, correo, foto de perfil, fecha de nacimiento, fiestas a las que te unes, bebidas que registras y las
        fotos que subes.
      </Text>
      <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>Con quién se comparte</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Tu actividad solo es visible para los miembros de las fiestas a las que perteneces, nunca públicamente.
      </Text>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>
        Este es un texto de marcador de posición para el MVP — reemplazar con una política de privacidad revisada
        antes del lanzamiento.
      </Text>
    </ScrollView>
  );
}
