import { TodoBadge } from "@/components/todo-badge/todo-badge";
import { Box, Button, Text } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

interface SectionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  status: string;
  iconName: string;
  photoUri?: string;
}

export const SectionCard = ({
  id,
  title,
  subtitle,
  status,
  iconName,
  photoUri,
}: SectionCardProps) => {
  const router = useRouter();
  const colors = useTheme();
  const isTodo = status === "todo";

  return (
    <Button
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => router.push(`/profile/sections/${id}` as any)}
      accessibilityRole="button"
      accessibilityLabel={`${title}${isTodo ? ", to do" : ", complete"}`}
      accessibilityHint={`Opens ${title} section`}
    >
      <Box style={styles.content}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.iconContainer}
            contentFit="cover"
          />
        ) : (
          <Box
            style={[
              styles.iconContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <MaterialCommunityIcons
              name={iconName as any}
              size={24}
              color={colors.accent}
            />
          </Box>
        )}
        <Box style={styles.textContainer}>
          <Text type="subheading" color={colors.textPrimary}>
            {title}
          </Text>
          {subtitle ? (
            <Text type="caption" color={colors.textSecondary}>
              {subtitle}
            </Text>
          ) : null}
        </Box>
        <MaterialCommunityIcons
          name="arrow-right-circle-outline"
          size={24}
          color={"black"}
        />
      </Box>
      {isTodo ? <TodoBadge /> : null}
    </Button>
  );
};

const SIZE = 52;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: SIZE,
    height: SIZE,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
});
