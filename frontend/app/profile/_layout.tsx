import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import React from "react";

const ProfileLayout = () => {
  const colors = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primaryBackground },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: "700" },
        headerTransparent: false,
        headerBlurEffect: undefined,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.primaryBackground },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sections/[id]"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
