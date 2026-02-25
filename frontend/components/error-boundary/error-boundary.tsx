import { Box, Button, Text } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { StyleSheet } from "react-native";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback error={this.state.error} onReset={this.handleReset} />
      );
    }
    return this.props.children;
  }
}

const ErrorFallback = ({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) => {
  const colors = useTheme();

  return (
    <Box
      style={[styles.container, { backgroundColor: colors.primaryBackground }]}
    >
      <Box style={{ marginBottom: 8 }}>
        <Text type="heading" color={colors.textPrimary}>
          Something went wrong
        </Text>
      </Box>
      <Box style={{ marginBottom: 24 }}>
        <Text type="caption" textAlign="center" color={colors.textSecondary}>
          {error?.message ?? "An unexpected error occurred"}
        </Text>
      </Box>
      <Button label="Try Again" onPress={onReset} />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
