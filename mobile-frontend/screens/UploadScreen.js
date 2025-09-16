// mobile-frontend/screens/UploadScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AnimatedButton from "../components/AnimatedButton";
import colors from "../theme/colors";

export default function UploadScreen({ navigation }) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (image) {
      navigation.navigate("ActionSelection", { image });
    } else {
      alert("Please select an image first!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload an Animal Image 🐾</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>Tap to select an image</Text>
        )}
      </TouchableOpacity>

      <AnimatedButton title="Next ➡️" onPress={handleNext} style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: colors.text,
  },
  imagePicker: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  placeholder: {
    color: "#888",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
