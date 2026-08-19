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
      <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>Registro de consumo y exención de responsabilidad</Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Drinkava no limita la cantidad de bebidas que puedes registrar: el registro es un reporte personal hecho por
        ti, bajo tu propia responsabilidad, y no representa una recomendación, límite sugerido ni aprobación de
        Drinkava sobre cuánto es seguro consumir. Tú eres el único responsable de decidir cuánto y qué consumes, de
        conocer tus propios límites y de cumplir las leyes de tu localidad (incluyendo no conducir bajo los efectos
        del alcohol).
      </Text>
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        En la máxima medida permitida por la ley, Drinkava, sus creadores y colaboradores no se hacen responsables
        por lesiones, daños, pérdidas o consecuencias legales derivadas del consumo de alcohol por parte de los
        usuarios, ya sea que dicho consumo haya sido registrado en la app o no. El uso de Drinkava es bajo tu propio
        riesgo.
      </Text>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>
        Este es un texto de marcador de posición para el MVP — reemplazar con términos legales revisados por un
        abogado antes del lanzamiento.
      </Text>
    </ScrollView>
  );
}
