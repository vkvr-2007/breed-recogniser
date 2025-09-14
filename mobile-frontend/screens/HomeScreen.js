import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";


export default function HomeScreen({ navigation }) {
  const scheme = useColorScheme();
  const [animal, setAnimal] = useState("cow");

  const pickImage = async (fromCamera = false) => {
    let permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required!");
      return;
    }

    let pickerResult = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 1 });

    if (!pickerResult.canceled) {
      navigation.navigate("Results", { image: pickerResult.assets[0].uri, animal: animal });
    }
  };

  return (
    <View style={[styles.container, scheme === "dark" ? styles.darkBg : styles.lightBg]}>
      <Text style={styles.title}>🐄 Breed Recognizer</Text>
      <Text style={styles.subtitle}>Upload or snap a photo to get breed info</Text>

      {/* Animal Picker */}
      <Picker
        selectedValue={animal}
        onValueChange={(itemValue) => setAnimal(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Cow 🐄" value="cow" />
        <Picker.Item label="Buffalo 🐃" value="buffalo" />
      </Picker>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={() => pickImage(false)}>
          <Text style={styles.btnText}>📂 Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => pickImage(true)}>
          <Text style={styles.btnText}>📷 Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  lightBg: { backgroundColor: "#fff" },
  darkBg: { backgroundColor: "#121212" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: "center", color: "#666" },
  picker: { width: 200, marginBottom: 20 },
  btnRow: { flexDirection: "row", marginTop: 20 },
  btn: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, marginHorizontal: 10 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
