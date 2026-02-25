import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Button } from "./button";

export type ModalContentProps = {
  children: React.ReactNode;
  submitLabel: string;
  onSubmit: () => void;
  loading?: boolean;
};

export const ModalContent = ({
  children,
  submitLabel,
  onSubmit,
  loading,
}: ModalContentProps) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.flex}
  >
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      {children}
      <Button
        label={submitLabel}
        onPress={onSubmit}
        loading={loading}
        style={styles.saveButton}
      />
    </ScrollView>
  </KeyboardAvoidingView>
);

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
