import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryClient } from '@/lib/query-client';
import { NetworkProvider } from '@/providers/network-provider';
import { ErrorBoundary } from '@/components/error-boundary/error-boundary';
import { toastConfig } from '@/components/ui/toast-config';

const RootLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <ErrorBoundary>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
            <Toast config={toastConfig} position="bottom" bottomOffset={50} />
          </ThemeProvider>
        </ErrorBoundary>
      </NetworkProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
