import { Box, Button, Text } from "@/components/ui";
import { useProfile, useUploadPhoto } from "@/hooks/use-profile";
import { useSafeSubmit } from "@/hooks/use-safe-submit";
import { useTheme } from "@/hooks/use-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export const PhotoModal = () => {
  const colors = useTheme();
  const { sections } = useProfile();
  const { uploadPhoto, cancelUpload, loading } = useUploadPhoto();
  const safeSubmit = useSafeSubmit("Could not upload photo. Please try again.");
  const photoSection = sections.find((s: any) => s.id === "photo");
  const photoUri = photoSection?.photoUri;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      safeSubmit(() => uploadPhoto(result.assets[0].uri));
    }
  };

  return (
    <Box style={styles.container}>
      <Box style={styles.photoContainer}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.photo}
            contentFit="cover"
          />
        ) : (
          <Box
            style={[
              styles.placeholder,
              { backgroundColor: colors.surfaceMuted },
            ]}
          >
            <MaterialCommunityIcons
              name="camera"
              size={48}
              color={colors.textTertiary}
            />
          </Box>
        )}
      </Box>

      {loading ? (
        <Box style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text type="caption" color={colors.textSecondary}>
            Uploading photo...
          </Text>
          <Button
            variant="outline"
            label="Cancel"
            color={colors.errorText}
            onPress={cancelUpload}
            style={{ borderColor: colors.errorText }}
          />
        </Box>
      ) : (
        <Button
          label={photoUri ? "Change Photo" : "Upload Photo"}
          onPress={pickImage}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
  },
  photoContainer: {
    marginBottom: 24,
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  placeholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    gap: 12,
  },
});
