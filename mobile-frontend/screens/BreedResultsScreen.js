// mobile-frontend/screens/BreedResultsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import colors from "../theme/colors";

export default function BreedResultsScreen({ route }) {
  const { image } = route.params;
  const [loading, setLoading] = useState(true);
  const [breed, setBreed] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeBreed = async () => {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("file", {
          uri: image.uri,
          name: "upload.jpg",
          type: "image/jpeg",
        });

        // ⚡ Replace with your system's API URL
        const response = await fetch("http://192.168.29.215:8000/predict", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }

        const data = await response.json();
        setBreed(data.predicted_breed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    analyzeBreed();
  }, [image]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 Breed Detection Results</Text>

      <Image source={{ uri: image.uri }} style={styles.preview} />

      {loading && <ActivityIndicator size="large" color={colors.primary} />}

      {error && <Text style={styles.error}>❌ {error}</Text>}

      {!loading && !error && breed && (
        <View style={styles.card}>
          <Text style={styles.resultText}>{breed}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginVertical: 10,
  },
  preview: {
    width: 250,
    height: 250,
    borderRadius: 20,
    marginVertical: 20,
  },
  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 20,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginTop: 20,
  },
});
