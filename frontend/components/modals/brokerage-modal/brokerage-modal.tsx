import React from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { useUpdateSection, useProfile } from '@/hooks/use-profile';
import { useSafeSubmit } from '@/hooks/use-safe-submit';
import { Input, ModalContent } from '@/components/ui';

type BrokerageForm = {
  brokerageName: string;
  licenseNumber: string;
  officeAddress: string;
};

export const BrokerageModal = () => {
  const colors = useTheme();
  const { sections } = useProfile();
  const { updateSection, loading } = useUpdateSection();
  const safeSubmit = useSafeSubmit();
  const section = sections.find((s: any) => s.id === 'brokerage');

  const { control, handleSubmit } = useForm<BrokerageForm>({
    defaultValues: {
      brokerageName: (section?.data as any)?.brokerageName ?? '',
      licenseNumber: (section?.data as any)?.licenseNumber ?? '',
      officeAddress: (section?.data as any)?.officeAddress ?? '',
    },
  });

  const onSubmit = (data: BrokerageForm) =>
    safeSubmit(() => updateSection('brokerage', 'complete', {
      brokerageName: data.brokerageName.trim(),
      licenseNumber: data.licenseNumber.trim(),
      officeAddress: data.officeAddress.trim(),
    }));

  return (
    <ModalContent
      submitLabel="Save Brokerage Info"
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
    >
      <Input
        control={control}
        name="brokerageName"
        label="Brokerage Name"
        labelColor={colors.textPrimary}
        placeholder="Keller Williams Realty"
        rules={{ required: 'Brokerage name is required' }}
      />

      <Input
        control={control}
        name="licenseNumber"
        label="License Number"
        labelColor={colors.textPrimary}
        placeholder="DRE# 01234567"
        rules={{ required: 'License number is required' }}
      />

      <Input
        control={control}
        name="officeAddress"
        label="Office Address"
        labelColor={colors.textPrimary}
        placeholder="123 Main St, Suite 100"
      />
    </ModalContent>
  );
};
