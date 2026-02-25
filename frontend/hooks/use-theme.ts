import { useColorScheme } from '@/hooks/use-color-scheme';
import { theme } from '@/constants/theme';

export const useTheme = () => {
  const colorScheme = useColorScheme() ?? 'light';
  return theme[colorScheme];
};
