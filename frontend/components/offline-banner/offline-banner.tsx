import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Box, Text } from '@/components/ui';

export const OfflineBanner = () => {
  const colors = useTheme();

  return (
    <Box style={[styles.container, { backgroundColor: colors.warningBackground }]}>
      <MaterialCommunityIcons name="wifi-off" size={18} color={colors.warningText} />
      <Text type="label" color={colors.warningText}>
        No internet connection
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
});
