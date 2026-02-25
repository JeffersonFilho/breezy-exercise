import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ToastConfig } from 'react-native-toast-message';
import { Box, Text } from '@/components/ui';

const ICONS: Record<string, { name: string; color: string }> = {
  success: { name: 'check-circle', color: '#4CAF50' },
  error: { name: 'alert-circle', color: '#FF5252' },
  info: { name: 'information', color: '#2196F3' },
};

const ToastBody = ({ type, text1 }: { type: string; text1?: string }) => {
  const icon = ICONS[type] ?? ICONS.info;

  return (
    <Box style={styles.container}>
      <MaterialCommunityIcons name={icon.name as any} size={20} color={icon.color} />
      <Text style={styles.text}>{text1}</Text>
    </Box>
  );
};

export const toastConfig: ToastConfig = {
  success: ({ text1 }) => <ToastBody type="success" text1={text1} />,
  error: ({ text1 }) => <ToastBody type="error" text1={text1} />,
  info: ({ text1 }) => <ToastBody type="info" text1={text1} />,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginHorizontal: 24,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
  },
});
