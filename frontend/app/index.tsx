import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Index = () => {
  const router = useRouter();

  return (
    <Pressable style={styles.container} onPress={() => router.push("/profile")}>
      <Image
        source={require("@/assets/images/splash-backround.png")}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={styles.bottomContainer}>
        <Image
          source={require("@/assets/images/logo.svg")}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.tapHint}>Tap anywhere to continue</Text>
      </View>
    </Pressable>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 50,
    left: 28,
    gap: 12,
  },
  logo: {
    width: 160,
    height: 42,
  },
  tapHint: {
    color: "rgba(249, 249, 249, 0.6)",
    fontSize: 13,
    fontWeight: "400",
  },
});
