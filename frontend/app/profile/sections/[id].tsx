import { BioModal } from "@/components/modals/bio-modal/bio-modal";
import { BrandingModal } from "@/components/modals/branding-modal/branding-modal";
import { BrokerageModal } from "@/components/modals/brokerage-modal/brokerage-modal";
import { ContactModal } from "@/components/modals/contact-modal/contact-modal";
import { PhotoModal } from "@/components/modals/photo-modal/photo-modal";
import { SocialsModal } from "@/components/modals/socials-modal/socials-modal";
import { Box, Header } from "@/components/ui";
import { toastConfig } from "@/components/ui/toast-config";
import { useTheme } from "@/hooks/use-theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

const SECTION_MAP: Record<
  string,
  { title: string; Component: React.ComponentType }
> = {
  photo: { title: "Profile Photo", Component: PhotoModal },
  contact: { title: "Contact Details", Component: ContactModal },
  socials: { title: "Social Media", Component: SocialsModal },
  brokerage: { title: "Brokerage Info", Component: BrokerageModal },
  branding: { title: "Branding", Component: BrandingModal },
  bio: { title: "About Me", Component: BioModal },
};

const SectionDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useTheme();

  const section = SECTION_MAP[id as string];
  if (!section) return null;

  const { title, Component } = section;

  return (
    <Box
      style={[styles.container, { backgroundColor: colors.primaryBackground }]}
    >
      <Box style={styles.handleWrapper}>
        <Box
          style={[styles.handle, { backgroundColor: colors.surfaceMuted }]}
        />
      </Box>
      <Header
        title={title}
        right={{ icon: "close", onPress: () => router.back() }}
        safeArea={false}
      />
      <Component />
      <Toast config={toastConfig} position="bottom" bottomOffset={50} />
    </Box>
  );
};

export default SectionDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handleWrapper: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
  },
});
