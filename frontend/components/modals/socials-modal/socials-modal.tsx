import React from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { useUpdateSection, useProfile } from '@/hooks/use-profile';
import { useSafeSubmit } from '@/hooks/use-safe-submit';
import { Box, Text, Input, Button } from '@/components/ui';

const SOCIAL_FIELDS = [
  { key: 'website', label: 'Personal Website', icon: 'web', placeholder: 'https://yoursite.com' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin', placeholder: 'https://linkedin.com/in/...' },
  { key: 'instagram', label: 'Instagram', icon: 'instagram', placeholder: 'https://instagram.com/...' },
  { key: 'twitter', label: 'Twitter / X', icon: 'twitter', placeholder: 'https://x.com/...' },
] as const;

type SocialsForm = {
  website: string;
  linkedin: string;
  instagram: string;
  twitter: string;
};

export const SocialsModal = () => {
  const colors = useTheme();
  const { sections } = useProfile();
  const { updateSection, loading } = useUpdateSection();
  const safeSubmit = useSafeSubmit();
  const section = sections.find((s: any) => s.id === 'socials');

  const data = section?.data as Record<string, string> | undefined;

  const { control, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<SocialsForm>({
    defaultValues: {
      website: data?.website ?? '',
      linkedin: data?.linkedin ?? '',
      instagram: data?.instagram ?? '',
      twitter: data?.twitter ?? '',
    },
  });

  const onSubmit = (formData: SocialsForm) => {
    const filledValues = Object.fromEntries(
      Object.entries(formData).filter(([, v]) => v.trim())
    );
    if (Object.keys(filledValues).length === 0) {
      setError('root', { message: 'Please fill in at least one social link.' });
      return;
    }
    clearErrors('root');
    safeSubmit(() => updateSection('socials', 'complete', filledValues));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        {SOCIAL_FIELDS.map((field) => (
          <Box key={field.key} style={styles.field}>
            <Box style={styles.labelRow}>
              <MaterialCommunityIcons
                name={field.icon as any}
                size={18}
                color={colors.accent}
              />
              <Text type="label" color={colors.textPrimary}>
                {field.label}
              </Text>
            </Box>
            <Controller
              control={control}
              name={field.key}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={field.placeholder}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              )}
            />
          </Box>
        ))}

        {errors.root?.message ? (
          <Text type="error">{errors.root.message}</Text>
        ) : null}

        <Button
          label="Save Social Links"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 24,
    gap: 20,
  },
  field: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveButton: {
    marginTop: 8,
  },
});
