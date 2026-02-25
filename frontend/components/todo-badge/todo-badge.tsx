import { Box, Text } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { StyleSheet } from "react-native";

export const TodoBadge = () => {
  const colors = useTheme();

  return (
    <Box style={[styles.badge, { backgroundColor: colors.badge }]}>
      <Text type="badge" color={colors.white}>To Do</Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 10,
    left: -6,
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 8,
  },
});
