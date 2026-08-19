# Supabase implementation (future seam)

This directory intentionally has no implementation yet. When real backend
credentials are available, implement each interface from `../interfaces/*`
here (e.g. `SupabaseAuthService.ts`, `SupabasePartyService.ts`, ...) backed by
a Supabase client (Postgres + Auth + Storage).

Then flip the factory in `../index.ts` to export these instead of the mock
implementations — no screen code should need to change, since screens only
ever import the `services` object from `../index.ts`.

See `/docs/supabase-migration.md` for the proposed schema mapping and RLS notes.
