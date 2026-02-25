import { ErrorBanner } from "@/components/error-banner/error-banner";
import { OfflineBanner } from "@/components/offline-banner/offline-banner";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { SectionCard } from "@/components/section-card/section-card";
import { SkeletonLoader } from "@/components/skeleton-loader/skeleton-loader";
import { Box, Header } from "@/components/ui";
import { useNetwork } from "@/hooks/use-network";
import { useProfile, useProgressPolling } from "@/hooks/use-profile";
import { useTheme } from "@/hooks/use-theme";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const ProfileScreen = () => {
  const router = useRouter();
  const colors = useTheme();
  const { sections, completionPercentage, loading, fetching, error, refetch } =
    useProfile();
  const { isConnected } = useNetwork();
  useProgressPolling();

  const onRefresh = () => {
    refetch();
  };

  if (loading && sections.length === 0) {
    return (
      <Box
        style={[
          styles.container,
          { backgroundColor: colors.primaryBackground },
        ]}
      >
        <Header
          title="Your Profile"
          titleAlign="left"
          left={{ icon: "arrow-left", onPress: () => router.back() }}
        />
        <SkeletonLoader />
      </Box>
    );
  }

  return (
    <Box
      style={[styles.container, { backgroundColor: colors.primaryBackground }]}
    >
      <Header
        title="Your Profile"
        titleAlign="left"
        left={{ icon: "arrow-left", onPress: () => router.back() }}
      />
      {!isConnected ? <OfflineBanner /> : null}
      <FlashList
        data={sections}
        renderItem={({ item }: { item: any }) => (
          <SectionCard
            key={item.id}
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            status={item.status}
            iconName={item.iconName}
            photoUri={item.photoUri}
          />
        )}
        keyExtractor={(item: any) => item.id}
        ListHeaderComponent={
          <>
            {error ? (
              <ErrorBanner
                title="Failed to load profile"
                message="Check your connection and try again."
                loading={fetching}
                onRetry={onRefresh}
              />
            ) : null}
            {sections.length > 0 ? (
              <ProgressBar percentage={completionPercentage} />
            ) : null}
          </>
        }
        refreshing={loading}
        onRefresh={onRefresh}
        contentContainerStyle={styles.contentContainer}
      />
    </Box>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
});
