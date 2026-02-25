import { Box, ModalContent, Text } from "@/components/ui";
import { useProfile, useUpdateSection } from "@/hooks/use-profile";
import { useSafeSubmit } from "@/hooks/use-safe-submit";
import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Button, Input } from "@/components/ui";

const COLOR_OPTIONS = ["#2E8B57", "#1E3A5F", "#8B3A3A", "#4A4A4A"];

type BrandingForm = {
  teamName: string;
  primaryColor: string;
};

export const BrandingModal = () => {
  const colors = useTheme();
  const { sections } = useProfile();
  const { updateSection, loading } = useUpdateSection();
  const safeSubmit = useSafeSubmit();
  const section = sections.find((s: any) => s.id === "branding");

  const { control, handleSubmit, watch, setValue } = useForm<BrandingForm>({
    defaultValues: {
      teamName: (section?.data as any)?.teamName ?? "",
      primaryColor: (section?.data as any)?.primaryColor ?? COLOR_OPTIONS[0],
    },
  });

  const teamName = watch("teamName");
  const primaryColor = watch("primaryColor");

  const onSubmit = (data: BrandingForm) =>
    safeSubmit(() => updateSection("branding", "complete", {
      teamName: data.teamName.trim(),
      primaryColor: data.primaryColor,
    }));

  return (
    <ModalContent
      submitLabel="Save Branding"
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
    >
      <Box style={styles.field}>
        <Text type="label" color={colors.textPrimary}>
          Team Name
        </Text>
        <Controller
          control={control}
          name="teamName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="The Dream Team Realtors"
            />
          )}
        />
      </Box>

      <Box style={styles.field}>
        <Text type="label" color={colors.textPrimary}>
          Primary Brand Color
        </Text>
        <Box style={styles.colorRow}>
          {COLOR_OPTIONS.map((color) => (
            <Button
              key={color}
              style={[
                styles.colorSwatch,
                { backgroundColor: color },
                primaryColor === color && styles.colorSelected,
              ]}
              onPress={() => setValue("primaryColor", color)}
              accessibilityLabel={`Select color ${color}`}
            />
          ))}
        </Box>
        <Controller
          control={control}
          name="primaryColor"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="#2E8B57"
              autoCapitalize="none"
            />
          )}
        />
      </Box>

      <Box style={styles.previewContainer}>
        <Text type="label" color={colors.textPrimary}>
          Preview
        </Text>
        <Box style={[styles.previewCard, { borderColor: primaryColor }]}>
          <Box
            style={[styles.previewHeader, { backgroundColor: primaryColor }]}
          >
            <Text type="title" color="#FFFFFF">
              {teamName || "Your Team Name"}
            </Text>
          </Box>
        </Box>
      </Box>
    </ModalContent>
  );
};

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  colorRow: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 8,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  previewContainer: {
    gap: 8,
  },
  previewCard: {
    borderWidth: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  previewHeader: {
    padding: 16,
    alignItems: "center",
  },
});
