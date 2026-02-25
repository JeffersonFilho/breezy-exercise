import { View, type ViewProps } from 'react-native';

export type BoxProps = ViewProps;

export const Box = (props: BoxProps) => {
  return <View {...props} />;
};
