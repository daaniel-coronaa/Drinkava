# Drinkava

App social estilo Strava para trackear bebidas en fiestas con tu grupo de amigos:
crea fiestas, registra lo que tomas, dale kudos a tus amigos y compite en un ranking
que premia variedad y asistencia, no solo volumen.

Este build corre completamente contra una capa de **datos mock** (en memoria +
`AsyncStorage`) — no requiere backend real todavía. Ver
[`docs/supabase-migration.md`](docs/supabase-migration.md) para el plan de
integración con Supabase.

## Empezar

```bash
npm install
npx expo start
```

Abre el proyecto en Expo Go, un simulador de iOS o un emulador de Android.

## Estructura

- `src/app/` — pantallas (Expo Router, file-based routing).
- `src/components/` — componentes de UI reutilizables.
- `src/services/` — capa de servicios: interfaces (`interfaces/`), implementación
  mock actual (`mock/`), y el punto de swap único (`index.ts`).
- `src/domain/` — lógica de negocio pura (algoritmo de ranking, evaluación de logros).
- `src/theme/` — sistema de diseño (colores, tipografía, espaciado, modo oscuro).
- `src/data/seed/` — datos de ejemplo que alimentan la capa mock.

## Cumplimiento en tiendas de apps (alcohol)

- El ranking (`src/domain/leaderboard/computeBalancedScore.ts`) pondera variedad,
  kudos y asistencia por encima del volumen de bebidas — no es un concurso de "quién
  tomó más". Ver `ScoreBreakdownSheet` para la explicación visible al usuario.
- Disclaimer "Bebe con responsabilidad" visible en Feed y en el flujo de registro
  de bebidas (`src/components/compliance/DisclaimerBanner.tsx`).
- Age-gate obligatorio (18+) antes de acceder a la app (`src/app/(auth)/age-gate.tsx`).
- "Modo Seguro" opcional con recordatorios de agua y accesos directos a pedir un
  viaje (`src/app/safe-mode/index.tsx`).
- **Pendiente antes de publicar**: completar el cuestionario de clasificación de
  edad (17+/18+) en App Store Connect y Google Play Console — esto no se puede
  configurar solo desde `app.json`, requiere respuestas manuales en cada consola
  indicando referencias a alcohol.
