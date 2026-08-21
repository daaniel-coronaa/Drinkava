// Public OAuth client ID — safe to expose client-side (Expo inlines EXPO_PUBLIC_*
// vars into the bundle). Create one at https://console.cloud.google.com/apis/credentials
// (OAuth client ID → "Web application") and set it in a local .env file, see .env.example.
export const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';
export const isGoogleAuthConfigured = GOOGLE_CLIENT_ID.length > 0;
