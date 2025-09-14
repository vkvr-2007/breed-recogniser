import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

export default function ResultsScreen({ route }) {
  const { image, animal } = route.params; // get animal dynamically
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const uploadImage = async () => {
    setLoading(true);
    let filename = image.split("/").pop();
    let formData = new FormData();
    formData.append("file", { uri: image, name: filename, type: "image/jpeg" });
    formData.append("animal", animal);

    try {
      let res = await fetch("https://breed-recogniser-1.onrender.com/predict/", { // use your cloud URL
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
    <View style={styles.container}>
      <Text style={styles.title}>📊 Results</Text>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.btn} onPress={uploadImage}>
          <Text style={styles.btnText}>🔍 Analyze</Text>
        </TouchableOpacity>
      )}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Animal: {result.animal}</Text>
          <Text style={styles.resultText}>Breed: {result.breed}</Text>
          <Text style={styles.resultText}>Confidence: {result.confidence}</Text>
          <Text style={styles.resultText}>Health: {result.health}</Text>
          <Text style={styles.resultText}>Cost: {result.cost_estimate}</Text>
          <Text style={styles.resultText}>Milk Yield: {result.milk_yield}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  image: { width: 250, height: 250, borderRadius: 15, marginVertical: 20 },
  btn: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, marginTop: 10 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  resultBox: { marginTop: 20, backgroundColor: "#f5f5f5", padding: 15, borderRadius: 10, width: "100%" },
  resultText: { fontSize: 16, marginBottom: 5 },
});
