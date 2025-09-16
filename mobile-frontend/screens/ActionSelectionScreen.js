// mobile-frontend/screens/ActionSelectionScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AnimatedButton from "../components/AnimatedButton";
import colors from "../theme/colors";

export default function ActionSelectionScreen({ route, navigation }) {
  const { image } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What do you want to do? 🤔</Text>

      <AnimatedButton
        title="🔎 Detect Breed"
        onPress={() => navigation.navigate("BreedResults", { image })}
        style={{ marginTop: 20 }}
      />

      <AnimatedButton
        title="❤️ Health Check"
        onPress={() => navigation.navigate("HealthForm", { image })}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 30,
  },
});
