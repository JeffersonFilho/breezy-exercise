import React from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { useUpdateSection, useProfile } from '@/hooks/use-profile';
import { useSafeSubmit } from '@/hooks/use-safe-submit';
import { Input, Button } from '@/components/ui';

type ContactForm = {
  fullName: string;
  email: string;
  phone: string;
};

export const ContactModal = () => {
  const colors = useTheme();
  const { sections } = useProfile();
  const { updateSection, loading } = useUpdateSection();
  const safeSubmit = useSafeSubmit();
  const section = sections.find((s: any) => s.id === 'contact');

  const { control, handleSubmit } = useForm<ContactForm>({
    defaultValues: {
      fullName: (section?.data as any)?.fullName ?? '',
      email: (section?.data as any)?.email ?? '',
      phone: (section?.data as any)?.phone ?? '',
    },
  });

  const onSubmit = (data: ContactForm) =>
    safeSubmit(() => updateSection('contact', 'complete', {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
    }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        <Input
          control={control}
          name="fullName"
          label="Full Name"
          labelColor={colors.textPrimary}
          placeholder="John Doe"
          rules={{ required: 'Name is required' }}
        />

        <Input
          control={control}
          name="email"
          label="Email"
          labelColor={colors.textPrimary}
          type="email"
          placeholder="john@example.com"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
          }}
        />

        <Input
          control={control}
          name="phone"
          label="Phone"
          labelColor={colors.textPrimary}
          type="phone"
          placeholder="(555) 123-4567"
          rules={{
            required: 'Phone is required',
            validate: (value: string) => {
              const digits = value.replace(/\D/g, '');
              if (digits.length < 10) return 'Enter a valid 10-digit phone number';
              return true;
            },
          }}
        />

        <Button
          label="Save Contact Details"
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
  saveButton: {
    marginTop: 8,
  },
});
