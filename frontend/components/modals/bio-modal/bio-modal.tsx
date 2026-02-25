import { Box, ModalContent, Text } from "@/components/ui";
import { useProfile, useUpdateSection } from "@/hooks/use-profile";
import { useSafeSubmit } from "@/hooks/use-safe-submit";
import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui";

const MAX_CHARS = 500;

type BioForm = {
  bio: string;
};

export const BioModal = () => {
  const colors = useTheme();
  const { sections } = useProfile();
  const { updateSection, loading } = useUpdateSection();
  const safeSubmit = useSafeSubmit();
  const section = sections.find((s: any) => s.id === "bio");

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BioForm>({
    defaultValues: {
      bio: (section?.data as any)?.bio ?? "",
    },
  });

  const bioValue = watch("bio");

  const onSubmit = (data: BioForm) =>
    safeSubmit(() =>
      updateSection("bio", "complete", { bio: data.bio.trim() }),
    );

  return (
    <ModalContent
      submitLabel="Save Bio"
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
    >
      <Box style={{ gap: 6 }}>
        <Text type="label" color={colors.textPrimary}>
          About Me
        </Text>
        <Box style={{ marginBottom: 4 }}>
          <Text type="caption" color={colors.textSecondary}>
            Tell potential clients about yourself, your experience, and what
            sets you apart.
          </Text>
        </Box>
        <Controller
          control={control}
          name="bio"
          rules={{
            validate: (v) =>
              v.trim().length > 0 || "Please write a bio before saving.",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={(text) => {
                if (text.length <= MAX_CHARS) onChange(text);
              }}
              onBlur={onBlur}
              placeholder="I'm a dedicated real estate agent with 10+ years of experience..."
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              style={{ minHeight: 160 }}
              error={!!errors.bio}
            />
          )}
        />
        {errors.bio?.message ? (
          <Text type="error">{errors.bio.message}</Text>
        ) : null}
        <Box style={{ marginTop: 4 }}>
          <Text
            type="caption"
            textAlign="right"
            color={
              bioValue.length > MAX_CHARS * 0.9
                ? colors.errorText
                : colors.textSecondary
            }
          >
            {bioValue.length}/{MAX_CHARS}
          </Text>
        </Box>
      </Box>
    </ModalContent>
  );
};
