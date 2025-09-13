import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick image from gallery
  const pickImage = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
      setResult(null); // reset previous results
    }
  };

  // Upload + Predict
  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    let localUri = image;
    let filename = localUri.split("/").pop();
    let formData = new FormData();
    formData.append("file", {
      uri: localUri,
      name: filename,
      type: "image/jpeg",
    });
    formData.append("animal", "cow"); // default (can add toggle later)

    try {
      let res = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      <Text style={styles.title}>🐄 Breed Recognizer</Text>

      <Button title="Pick an Image" onPress={pickImage} />

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        image && <Button title="Upload & Predict" onPress={uploadImage} />
      )}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Animal: {result.animal}</Text>
          <Text style={styles.resultText}>Breed: {result.breed}</Text>
          <Text style={styles.resultText}>Confidence: {result.confidence}</Text>
          <Text style={styles.resultText}>Health: {result.health}</Text>
          <Text style={styles.resultText}>Cost Estimate: {result.cost_estimate}</Text>
          <Text style={styles.resultText}>Milk Yield: {result.milk_yield}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 20,
    borderRadius: 10,
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    width: "100%",
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
});