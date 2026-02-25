import { Text as RNText, type TextProps as RNTextProps, type ColorValue, StyleSheet } from 'react-native';

type Type = 'heading' | 'title' | 'subheading' | 'body' | 'label' | 'caption' | 'badge' | 'error';

export type TextProps = RNTextProps & {
  type?: Type;
  color?: ColorValue;
  textAlign?: 'left' | 'center' | 'right';
};

export const Text = ({ type = 'body', color, textAlign, style, ...props }: TextProps) => {
  return (
    <RNText
      style={[styles[type], color ? { color } : undefined, textAlign ? { textAlign } : undefined, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: '700',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  caption: {
    fontSize: 13,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
  },
  error: {
    fontSize: 12,
    color: '#D32F2F',
  },
});
