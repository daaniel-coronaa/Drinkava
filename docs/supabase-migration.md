# Migrando de datos mock a Supabase

Este documento describe cómo reemplazar la capa mock (`src/services/mock/*`) por
implementaciones reales respaldadas por Supabase, sin tocar ninguna pantalla.

## El punto de swap

Todas las pantallas importan `services` desde [`src/services/index.ts`](../src/services/index.ts),
nunca desde `mock/` directamente:

```ts
export const services = {
  auth: MockAuthService,
  parties: MockPartyService,
  drinkLogs: MockDrinkLogService,
  leaderboard: MockLeaderboardService,
  achievements: MockAchievementService,
  users: MockUserService,
};
```

Para migrar: implementar cada interfaz de `src/services/interfaces/*` en
`src/services/supabase/*` (ver el `README.md` de esa carpeta) y reemplazar las
asignaciones de arriba. Ningún componente de `src/app` o `src/components` necesita
cambiar.

## Mapeo de tipos a tablas Postgres

| Tipo TS (`src/types/*`) | Tabla Postgres (schema original) | Notas |
|---|---|---|
| `User` | `users(id, nombre, foto, email, auth_provider, fecha_nacimiento)` | `id` = `auth.users.id` de Supabase Auth. `fecha_nacimiento` solo se usa para el age-gate; considerar no exponerla a otros usuarios vía RLS. |
| `Party` | `parties(id, nombre, fecha, host_id, ubicación, estado)` | Agregar `invite_code` (único) y `cover_image_url` (Storage). |
| `PartyMember` | `party_members(party_id, user_id)` | Agregar `joined_at`. PK compuesta `(party_id, user_id)`. |
| `DrinkLog` | `drink_logs(id, user_id, party_id, tipo_bebida, cantidad, foto_url, timestamp)` | Agregar `custom_label` (nullable, solo para `tipo_bebida = 'other'`). |
| `Kudos` | `kudos(id, drink_log_id, user_id)` | Agregar `created_at`. Único `(drink_log_id, user_id)` para evitar duplicados. |
| `Comment` | *(no estaba en el schema original — agregar tabla nueva)* | `comments(id, drink_log_id, user_id, text, created_at)`. |
| `Achievement` | `achievements(id, user_id, tipo, fecha_obtenido)` | `tipo` = `achievement_key`. Los catálogos (`AchievementDefinition`) pueden vivir como constantes en el cliente o en una tabla `achievement_definitions`. |

## Storage

- `drink_logs.foto_url` y `parties.cover_image_url` deben apuntar a objetos en un
  bucket de Supabase Storage (ej. `drink-photos`, `party-covers`), no a URIs locales.
- El `PhotoPicker` actual (`src/components/drink-log/PhotoPicker.tsx`) ya devuelve un
  URI local; el único cambio necesario es, en el `SEAM` marcado en
  `src/app/drink-log/new.tsx`, subir ese archivo a Storage antes de llamar a
  `drinkLogs.create()` y pasar la URL firmada resultante.

## RLS (Row Level Security) — sketch

- `parties`: visible/editable solo por `host_id` o miembros en `party_members`.
- `party_members`: insertable por el propio usuario autenticado (join por código),
  legible por otros miembros de la misma fiesta.
- `drink_logs`, `kudos`, `comments`: legibles/insertables solo por miembros de la
  fiesta correspondiente (`party_id` en `party_members` del usuario autenticado).
- `achievements`: legible por el propio usuario y por miembros de fiestas compartidas
  (para mostrar insignias en el perfil de otros); insertable solo por una función de
  servidor (ver más abajo), no directamente por el cliente.

## Lógica que debe moverse al servidor

- **Ranking balanceado** (`src/domain/leaderboard/computeBalancedScore.ts`): puede
  seguir siendo una función pura reutilizada en un Postgres function / Edge Function
  para evitar recalcular en cada cliente y para que sea la única fuente de verdad.
- **Evaluación de logros** (`src/domain/achievements/evaluateAchievements.ts`): el
  mock la corre en el cliente por conveniencia. En producción debería moverse a un
  trigger de Postgres o Edge Function para evitar que un cliente modificado se
  auto-otorgue logros (ver comentario `SEAM` en
  `src/services/interfaces/AchievementService.ts`).

## Auth

- Reemplazar `MockAuthService` por un servicio que use Supabase Auth con los
  providers de Google (`expo-auth-session`) y Apple (`expo-apple-authentication`).
  El age-gate y la aceptación de ToS pueden seguir viviendo como columnas en
  `users` (o una tabla `user_onboarding`) actualizadas después del login real.

## Todo lo demás marcado `// SEAM:` en el código

Buscar `SEAM:` en el repo para ver cada punto de integración pendiente:

```
grep -rn "SEAM:" src/
```
