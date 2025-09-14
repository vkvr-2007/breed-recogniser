import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function ResultsScreen({ route }) {
  const { image, animal } = route.params;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const uploadImage = async () => {
    setLoading(true);
    let filename = image.split("/").pop();
    let formData = new FormData();
    formData.append("file", { uri: image, name: filename, type: "image/jpeg" });
    formData.append("animal", animal);

    try {
      let res = await fetch("http://192.168.29.215:5000/predict/", {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      let data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: image }} style={styles.preview} />
      <Text style={styles.title}>Selected Animal: {animal}</Text>

      <TouchableOpacity style={styles.btn} onPress={uploadImage}>
        <Text style={styles.btnText}>🔍 Analyze Image</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Prediction Result:</Text>
          <Text style={styles.resultText}>
            {result.breed ? `Breed: ${result.breed}` : "Breed not found"}
          </Text>
          {result.confidence && (
            <Text style={styles.resultText}>
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 20, backgroundColor: "#fff" },
  preview: { width: 250, height: 250, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  btn: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, marginTop: 10 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  resultBox: { marginTop: 30, padding: 20, borderRadius: 10, backgroundColor: "#f5f5f5", width: "100%" },
  resultTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  resultText: { fontSize: 16, marginBottom: 5 },
});

