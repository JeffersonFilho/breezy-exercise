import { Box, Text } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
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
  const progress = useSharedValue(percentage);

  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [percentage, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <Box style={styles.container}>
      <View style={[styles.track, { backgroundColor: colors.progressTrack }]}>
        <Animated.View
          style={[styles.fill, { backgroundColor: colors.accentGreen }, animatedStyle]}
        />
      </View>
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
  },
});
