import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/use-theme';
import { Box } from '@/components/ui';

const SkeletonCard = () => {
  const colors = useTheme();
  const opacity = useSharedValue(0.4);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: colors.surface },
        animatedStyle,
      ]}
    >
      <Box style={styles.row}>
        <Box style={[styles.circle, { backgroundColor: colors.surfaceMuted }]} />
        <Box style={styles.lines}>
          <Box style={[styles.lineTitle, { backgroundColor: colors.surfaceMuted }]} />
          <Box style={[styles.lineSubtitle, { backgroundColor: colors.surfaceMuted }]} />
        </Box>
      </Box>
    </Animated.View>
  );
};

export const SkeletonLoader = () => {
  const colors = useTheme();

  return (
    <Box style={styles.container}>
      <Box style={styles.progressSkeleton}>
        <Animated.View style={[styles.progressPlaceholder, { backgroundColor: colors.surfaceMuted }]} />
      </Box>
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  progressSkeleton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressPlaceholder: {
    height: 8,
    borderRadius: 4,
    opacity: 0.5,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  lines: {
    flex: 1,
    marginLeft: 12,
  },
  lineTitle: {
    height: 14,
    borderRadius: 4,
    width: '60%',
    marginBottom: 6,
  },
  lineSubtitle: {
    height: 10,
    borderRadius: 4,
    width: '40%',
  },
});
