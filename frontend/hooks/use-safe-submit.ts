import { useRouter } from "expo-router";
import { useCallback } from "react";
import Toast from "react-native-toast-message";
import { useIsMounted } from "./use-is-mounted";

export const useSafeSubmit = (errorMessage = "Could not save. Please try again.") => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const safeSubmit = useCallback(
    async (action: () => Promise<unknown>) => {
      try {
        const res = await action();
        if (!isMounted.current) return;
        if (!res) return;
        router.back();
      } catch {
        if (!isMounted.current) return;
        Toast.show({ type: "error", text1: errorMessage });
      }
    },
    [isMounted, router, errorMessage],
  );

  return safeSubmit;
};
