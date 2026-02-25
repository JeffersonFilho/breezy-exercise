import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Box, Text, Button } from '@/components/ui';

interface ErrorBannerProps {
  title?: string;
  message?: string;
  loading?: boolean;
  onRetry?: () => void;
}

export const ErrorBanner = ({
  title = 'Something went wrong',
  message = 'Please try again.',
  loading = false,
  onRetry,
}: ErrorBannerProps) => {
  const colors = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(350).springify().damping(18)}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <Box style={[styles.iconCircle, { backgroundColor: colors.errorBackground }]}>
        <MaterialCommunityIcons name="wifi-alert" size={18} color={colors.errorText} />
      </Box>
      <Text type="label" color={colors.textPrimary}>{title}</Text>
      <Text type="caption" color={colors.textSecondary}>{message}</Text>
      {onRetry ? (
        <Button
          label="Retry"
          onPress={onRetry}
          loading={loading}
          style={styles.retryButton}
        />
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  retryButton: {
    marginTop: 4,
    paddingHorizontal: 24,
  },
});
