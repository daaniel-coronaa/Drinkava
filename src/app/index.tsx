import { Redirect } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { session } = useAuth();

  if (!session) return <Redirect href="/(auth)/welcome" />;
  if (!session.ageVerified) return <Redirect href="/(auth)/age-gate" />;
  if (!session.tosAccepted) return <Redirect href="/(auth)/onboarding-tos" />;
  return <Redirect href="/(tabs)/feed" />;
}
