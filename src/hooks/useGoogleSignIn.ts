import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useMemo } from 'react';

import { GOOGLE_CLIENT_ID, isGoogleAuthConfigured } from '@/config/googleAuth';

// Required so the auth popup/tab closes itself on web once Google redirects back.
WebBrowser.maybeCompleteAuthSession();

export type GoogleProfile = {
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

export class GoogleNotConfiguredError extends Error {
  constructor() {
    super('GOOGLE_NOT_CONFIGURED');
  }
}

export class GoogleSignInCancelledError extends Error {
  constructor() {
    super('GOOGLE_SIGN_IN_CANCELLED');
  }
}

// SEAM: this performs a REAL Google OAuth (implicit grant, no backend/client secret
// needed) and returns the signed-in Google account's real profile. What happens with
// that profile afterward — creating/finding the matching app user, starting a session —
// still goes through AuthService, same as the rest of the mock data layer.
export function useGoogleSignIn() {
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  const redirectUri = useMemo(() => AuthSession.makeRedirectUri(), []);

  const [request, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
    },
    discovery,
  );

  const signIn = async (): Promise<GoogleProfile> => {
    if (!isGoogleAuthConfigured) throw new GoogleNotConfiguredError();
    const result = await promptAsync();
    if (result.type !== 'success') throw new GoogleSignInCancelledError();

    const accessToken = result.authentication?.accessToken;
    if (!accessToken || !discovery) throw new Error('GOOGLE_SIGN_IN_NO_TOKEN');

    const userInfo = await AuthSession.fetchUserInfoAsync({ accessToken }, discovery);
    const email = typeof userInfo.email === 'string' ? userInfo.email : null;
    if (!email) throw new Error('GOOGLE_SIGN_IN_NO_EMAIL');

    return {
      providerId: String(userInfo.sub ?? email),
      email,
      name: typeof userInfo.name === 'string' && userInfo.name ? userInfo.name : email,
      avatarUrl: typeof userInfo.picture === 'string' ? userInfo.picture : undefined,
    };
  };

  return { ready: !!request, configured: isGoogleAuthConfigured, signIn };
}
