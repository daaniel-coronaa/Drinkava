import { Redirect } from 'expo-router';

// Tab press is intercepted in (tabs)/_layout.tsx to open /drink-log/new as a modal;
// this fallback only renders if the route is reached directly (e.g. deep link).
export default function LogTabFallback() {
  return <Redirect href="/drink-log/new" />;
}
