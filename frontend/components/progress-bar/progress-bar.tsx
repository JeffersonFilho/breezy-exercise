import { Box, Text } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar = ({ percentage }: ProgressBarProps) => {
  const colors = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%` as any,
  }));

  return (
    <Box style={styles.container}>
      <Box style={[styles.track, { backgroundColor: colors.progressTrack }]}>
        <Animated.View style={[styles.fill, animatedStyle]}>
          <LinearGradient
            colors={[colors.progressStart, colors.progressEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Box>
      <Box style={{ marginTop: 16 }}>
        <Text type="label" textAlign="right" color={colors.textPrimary}>
          {percentage}% Completion
        </Text>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  track: {
    height: 10,
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
});
