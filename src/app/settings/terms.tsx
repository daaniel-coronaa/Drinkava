import { ScrollView, Text } from 'react-native';

import { useTheme } from '@/theme';

export default function TermsScreen() {
  const { colors, spacing, typography } = useTheme();
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <Text style={[typography.h2, { color: colors.textPrimary }]}>Términos de Servicio</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Drinkava es una aplicación social para compartir momentos en fiestas con tu grupo de amigos. Al usar
        Drinkava confirmas que eres mayor de edad en tu país de residencia.
      </Text>
      <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>Consumo responsable</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Drinkava no promueve, incentiva ni recompensa el consumo excesivo de alcohol. Nuestro sistema de ranking está
        diseñado deliberadamente para premiar la variedad de bebidas probadas, la asistencia a fiestas y el
        reconocimiento social (kudos) por encima del volumen de consumo. Si tú o alguien que conoces tiene problemas
        con el alcohol, busca ayuda profesional.
      </Text>
      <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>Uso del servicio</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Debes usar Drinkava de forma responsable y respetuosa con los demás miembros de tus fiestas. Nos reservamos
        el derecho de suspender cuentas que infrinjan estos términos.
      </Text>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>
        Este es un texto de marcador de posición para el MVP — reemplazar con términos legales revisados antes del
        lanzamiento.
      </Text>
    </ScrollView>
  );
}
