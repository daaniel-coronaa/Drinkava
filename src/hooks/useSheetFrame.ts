import { useWindowDimensions } from 'react-native';

import { ContentMaxWidth } from '@/theme';

// Bottom sheets live in a Modal (full window), so on wide screens they would stretch edge
// to edge. This keeps them on the same centered column as the rest of the app.
export function useSheetFrame() {
  const { width } = useWindowDimensions();
  const panel = Math.min(width, ContentMaxWidth);
  return { position: 'absolute' as const, bottom: 0, left: (width - panel) / 2, width: panel };
}
