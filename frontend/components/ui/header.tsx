import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "./box";
import { Button } from "./button";
import { Text } from "./text";

type HeaderAction = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress: () => void;
};

export type HeaderProps = {
  title: string;
  titleAlign?: "left" | "center" | "right";
  left?: HeaderAction;
  right?: HeaderAction;
  safeArea?: boolean;
};

export const Header = ({
  title,
  titleAlign = "center",
  left,
  right,
  safeArea = true,
}: HeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Box
      style={[
        styles.container,
        {
          paddingTop: safeArea ? insets.top + 8 : 16,
          gap: titleAlign === "center" ? 0 : 12,
        },
      ]}
    >
      <Box style={styles.side}>
        {left ? (
          <Button variant="icon" icon={left.icon} onPress={left.onPress} />
        ) : null}
      </Box>
      <Box style={[styles.titleWrapper]}>
        <Text type="title" textAlign={titleAlign} numberOfLines={1}>
          {title}
        </Text>
      </Box>
      <Box style={styles.side}>
        {right ? (
          <Button variant="icon" icon={right.icon} onPress={right.onPress} />
        ) : null}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  titleWrapper: {
    flex: 1,
  },
  side: {
    width: 30,
    alignItems: "center",
  },
});
