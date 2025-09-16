import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import { ArrowLeft, ArrowRight, Weight, Calendar, Heart, Droplets, Utensils, Milk, CheckCircle } from 'lucide-react-native';

export interface HealthFormData {
  weight: string;
  age: string;
  birthingDetails: string;
  heredity: string;
  hasSkinIssues: boolean;
  skinIssueArea: string;
  foodIntake: string;
  milkProduction: string;
}

interface HealthFormProps {
  uploadedImage: string;
  animalType: 'cow' | 'buffalo';
  onSubmit: (data: HealthFormData) => void;
  onBack: () => void;
}

const bodyParts = [
  { id: 'head', label: 'Head/Face', top: '15%', left: '45%' },
  { id: 'ears', label: 'Ears', top: '10%', left: '35%' },
  { id: 'neck', label: 'Neck', top: '25%', left: '45%' },
  { id: 'chest', label: 'Chest', top: '35%', left: '45%' },
  { id: 'front-legs', label: 'Front Legs', top: '45%', left: '35%' },
  { id: 'back', label: 'Back', top: '30%', left: '55%' },
  { id: 'belly', label: 'Belly', top: '45%', left: '45%' },
  { id: 'hind-legs', label: 'Hind Legs', top: '55%', left: '55%' },
  { id: 'tail', label: 'Tail', top: '40%', left: '75%' },
  { id: 'paws', label: 'Paws', top: '65%', left: '45%' },
];

const HealthForm: React.FC<HealthFormProps> = ({ uploadedImage, animalType, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<HealthFormData>({
    weight: '',
    age: '',
    birthingDetails: '',
    heredity: '',
    hasSkinIssues: false,
    skinIssueArea: '',
    foodIntake: '',
    milkProduction: '',
  });

  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');

  const handleInputChange = (field: keyof HealthFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={20} />
        <Text style={styles.backText}>Back to Analysis Options</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{animalType === 'cow' ? 'Cow' : 'Buffalo'} Health Analysis Form</Text>
      <Text style={styles.subtitle}>Please provide detailed information about your {animalType} for accurate health assessment.</Text>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Weight */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Weight size={20} color="#2563EB" />
            <Text style={styles.cardTitle}>Weight</Text>
          </View>
          <TextInput
            value={formData.weight}
            onChangeText={(text) => handleInputChange('weight', text)}
            placeholder="Enter weight"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Age */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Calendar size={20} color="#7C3AED" />
            <Text style={styles.cardTitle}>Age</Text>
          </View>
          <TextInput
            value={formData.age}
            onChangeText={(text) => handleInputChange('age', text)}
            placeholder="Enter age"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Birthing Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Heart size={20} color="#DB2777" />
            <Text style={styles.cardTitle}>Birthing Details</Text>
          </View>
          <TextInput
            value={formData.birthingDetails}
            onChangeText={(text) => handleInputChange('birthingDetails', text)}
            placeholder="Any complications during birth, litter size, etc."
            style={[styles.input, { height: 80 }]}
            multiline
          />
        </View>

        {/* Heredity */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Droplets size={20} color="#DC2626" />
            <Text style={styles.cardTitle}>Heredity & Family History</Text>
          </View>
          <TextInput
            value={formData.heredity}
            onChangeText={(text) => handleInputChange('heredity', text)}
            placeholder="Known genetic conditions, family health history, etc."
            style={[styles.input, { height: 80 }]}
            multiline
          />
        </View>

        {/* Food Intake */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Utensils size={20} color="#F97316" />
            <Text style={styles.cardTitle}>Daily Food Intake</Text>
          </View>
          <TextInput
            value={formData.foodIntake}
            onChangeText={(text) => handleInputChange('foodIntake', text)}
            placeholder="e.g., 2 cups dry food, 1 can wet food"
            style={styles.input}
          />
        </View>

        {/* Milk Production */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Milk size={20} color="#2563EB" />
            <Text style={styles.cardTitle}>Milk Production</Text>
          </View>
          <TextInput
            value={formData.milkProduction}
            onChangeText={(text) => handleInputChange('milkProduction', text)}
            placeholder="e.g., 5 liters per day (if applicable)"
            style={styles.input}
          />
        </View>

        {/* Image Preview */}
        <View style={[styles.card, { padding: 0 }]}>
          <Image source={{ uri: uploadedImage }} style={{ width: '100%', height: 200 }} resizeMode="cover" />
        </View>

        {/* Skin Issues */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Skin Issues & Conditions</Text>
          </View>

          <View style={styles.switchContainer}>
            <Switch
              value={formData.hasSkinIssues}
              onValueChange={(val) => handleInputChange('hasSkinIssues', val)}
            />
            <Text style={styles.switchText}>My {animalType} has visible skin issues</Text>
          </View>

          {formData.hasSkinIssues && (
            <View style={styles.bodyDiagram}>
              {bodyParts.map((part) => (
                <TouchableOpacity
                  key={part.id}
                  style={{
                    position: 'absolute',
                    top: part.top,
                    left: part.left,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: selectedBodyPart === part.id ? 'red' : 'blue',
                  }}
                  onPress={() => {
                    setSelectedBodyPart(part.id);
                    handleInputChange('skinIssueArea', part.label);
                  }}
                />
              ))}
            </View>
          )}

          {formData.skinIssueArea ? (
            <View style={styles.selectedArea}>
              <CheckCircle size={20} color="#16A34A" />
              <Text>Selected affected area: {formData.skinIssueArea}</Text>
            </View>
          ) : null}
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Analyze Health</Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HealthForm;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F3F4F6' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backText: { marginLeft: 6, color: '#374151', fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  formContainer: { flex: 1 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginLeft: 6 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, backgroundColor: 'white' },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  switchText: { marginLeft: 8, color: '#374151' },
  bodyDiagram: { height: 250, backgroundColor: '#E0F2FE', marginVertical: 8, borderRadius: 12 },
  selectedArea: { flexDirection: 'row', alignItems: 'center', marginTop: 8, padding: 6, backgroundColor: '#D1FAE5', borderRadius: 8 },
  submitButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#16A34A', padding: 14, borderRadius: 12, marginVertical: 12 },
  submitText: { color: 'white', fontSize: 16, fontWeight: '600', marginRight: 6 },
});
