import { TextInput, type TextInputProps, StyleSheet, View } from 'react-native';
import { Controller, type Control, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form';
import { useTheme } from '@/hooks/use-theme';
import { Text } from './text';

type InputType = 'text' | 'email' | 'phone';

type FormProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;
  label?: string;
  labelColor?: string;
};

export type InputProps<T extends FieldValues = FieldValues> = TextInputProps & {
  error?: boolean;
  type?: InputType;
} & Partial<FormProps<T>>;

const formatPhone = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const TYPE_PROPS: Record<InputType, Partial<TextInputProps>> = {
  text: {},
  email: {
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoCorrect: false,
  },
  phone: {
    keyboardType: 'phone-pad',
  },
};

const BaseInput = ({
  error,
  type = 'text',
  style,
  onChangeText,
  ...props
}: Omit<InputProps, 'control' | 'name' | 'rules' | 'label' | 'labelColor'>) => {
  const colors = useTheme();

  const handleChangeText = (text: string) => {
    if (type === 'phone') {
      onChangeText?.(formatPhone(text));
      return;
    }
    onChangeText?.(text);
  };

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.inputBackground,
          borderColor: error ? colors.errorText : colors.surfaceMuted,
          color: colors.textPrimary,
        },
        style,
      ]}
      placeholderTextColor={colors.textSecondary}
      onChangeText={handleChangeText}
      {...TYPE_PROPS[type]}
      {...props}
    />
  );
};

export const Input = <T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  label,
  labelColor,
  ...rest
}: InputProps<T>) => {
  const colors = useTheme();

  if (!control || !name) {
    return <BaseInput {...rest} />;
  }

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.field}>
          {label && (
            <Text type="label" color={labelColor ?? colors.textPrimary}>
              {label}
            </Text>
          )}
          <BaseInput
            {...rest}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!error}
          />
          {error?.message && (
            <Text type="error">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  field: {
    gap: 6,
  },
});
