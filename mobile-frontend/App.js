// mobile-frontend/App.js
import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { Feather, MaterialCommunityIcons, FontAwesome5, Entypo } from "@expo/vector-icons";

import BreedResultsScreen from "./screens/BreedResultsScreen";
import HealthFormScreen from "./screens/HealthFormScreen";
// You can create HealthResultsScreen and CostAnalysisScreen similarly

const Stack = createNativeStackNavigator();

export default function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [animalType, setAnimalType] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setUploadedImage(result.assets[0]);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  function UploadScreen({ navigation }) {
    return (
      <ScrollView style={[styles.container, darkMode && styles.darkBackground]}>
        <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              <MaterialCommunityIcons name="cow" size={24} color="#fff" />
            </View>
            <View>
              <Text style={[styles.headerTitle, darkMode && styles.darkText]}>Breed-Recogniser</Text>
              <Text style={[styles.headerSubtitle, darkMode && styles.darkText]}>
                Smart Animal Health & Breed Detection
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleDarkMode}>
            {darkMode ? <Feather name="sun" size={24} color="#fff" /> : <Feather name="moon" size={24} color="#000" />}
          </TouchableOpacity>
        </View>

        {/* Animal Type Selection */}
        <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>What type of animal is this?</Text>
        <View style={styles.animalTypeContainer}>
          <TouchableOpacity
            style={[
              styles.animalButton,
              animalType === "cow" && styles.animalSelected,
              darkMode && styles.darkAnimalButton,
            ]}
            onPress={() => setAnimalType("cow")}
          >
            <Text style={styles.animalEmoji}>🐄</Text>
            <Text style={[styles.animalText, darkMode && styles.darkText]}>Cow</Text>
            <Text style={[styles.animalSubtext, darkMode && styles.darkText]}>Dairy & Beef Cattle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.animalButton,
              animalType === "buffalo" && styles.animalSelected,
              darkMode && styles.darkAnimalButton,
            ]}
            onPress={() => setAnimalType("buffalo")}
          >
            <Text style={styles.animalEmoji}>🐃</Text>
            <Text style={[styles.animalText, darkMode && styles.darkText]}>Buffalo</Text>
            <Text style={[styles.animalSubtext, darkMode && styles.darkText]}>Water Buffalo</Text>
          </TouchableOpacity>
        </View>

        {/* Image Upload */}
        <View style={[styles.uploadContainer, darkMode && styles.darkUploadContainer]}>
          {uploadedImage ? (
            <Image source={{ uri: uploadedImage.uri }} style={styles.uploadedImage} />
          ) : (
            <FontAwesome5 name="cloud-upload-alt" size={48} color={darkMode ? "#fff" : "#555"} />
          )}
          <TouchableOpacity
            style={[styles.uploadButton, darkMode && styles.darkUploadButton]}
            onPress={pickImage}
            disabled={!animalType}
          >
            <Text style={[styles.uploadButtonText, darkMode && styles.darkText]}>
              {animalType ? "Choose File" : "Select Animal Type First"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next Action */}
        {uploadedImage && animalType && (
          <View style={styles.actionContainer}>
            <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>What would you like to do?</Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("BreedResults", { image: uploadedImage })}
            >
              <Entypo name="search" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Detect Breed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("HealthForm", { image: uploadedImage })}
            >
              <Feather name="heart" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Health Check</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  }

  return (
    <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={UploadScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BreedResults" component={BreedResultsScreen} options={{ title: "Breed Results" }} />
        <Stack.Screen name="HealthForm" component={HealthFormScreen} options={{ title: "Health Form" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fef3c7" },
  darkBackground: { backgroundColor: "#1f2937" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40, backgroundColor: "#16a34a", borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerSubtitle: { fontSize: 12, color: "#4b5563" },
  darkText: { color: "#fff" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginVertical: 10, textAlign: "center" },
  animalTypeContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  animalButton: { alignItems: "center", padding: 15, borderWidth: 2, borderColor: "#d1d5db", borderRadius: 15, backgroundColor: "#fff" },
  darkAnimalButton: { backgroundColor: "#374151", borderColor: "#6b7280" },
  animalSelected: { borderColor: "#16a34a", backgroundColor: "#bbf7d0", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  animalEmoji: { fontSize: 36, marginBottom: 5 },
  animalText: { fontSize: 16, fontWeight: "600" },
  animalSubtext: { fontSize: 12, color: "#6b7280" },
  uploadContainer: { alignItems: "center", padding: 20, borderWidth: 2, borderStyle: "dashed", borderColor: "#9ca3af", borderRadius: 20, marginVertical: 20 },
  darkUploadContainer: { borderColor: "#6b7280" },
  uploadedImage: { width: 250, height: 250, borderRadius: 15, marginBottom: 10 },
  uploadButton: { marginTop: 10, padding: 12, backgroundColor: "#16a34a", borderRadius: 10 },
  darkUploadButton: { backgroundColor: "#22c55e" },
  uploadButtonText: { color: "#fff", fontWeight: "600" },
  actionContainer: { marginTop: 20 },
  actionButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#16a34a", padding: 15, borderRadius: 15, marginVertical: 10 },
  actionButtonText: { color: "#fff", fontWeight: "700", marginLeft: 10 },
});
