import React, { useState, useEffect } from 'react';

import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';

import { ArrowLeft, Search, Target, Award, Info, CheckCircle } from 'lucide-react-native';

import axios from 'axios';



const BreedResults = ({ uploadedImage, animalType, onBack }) => {

 const [analysis, setAnalysis] = useState(null);



 // Function to fetch breed analysis from FastAPI

 const fetchBreedAnalysis = async () => {

  try {

   const formData = new FormData();

   formData.append('file', {

    uri: uploadedImage,

    type: 'image/jpeg',

    name: 'upload.jpg',

   });



   const response = await axios.post('http://http://192.168.29.215:8000/predict', formData, {

    headers: { 'Content-Type': 'multipart/form-data' },

   });



   setAnalysis(response.data);

  } catch (error) {

   console.error(error);

  }

 };



 useEffect(() => {

  fetchBreedAnalysis();

 }, []);



 const getAccuracyColor = (accuracy) => {

  if (accuracy >= 90) return 'text-green-600';

  if (accuracy >= 80) return 'text-yellow-600';

  return 'text-red-600';

 };



 const getAccuracyBgColor = (accuracy) => {

  if (accuracy >= 90) return 'bg-green-100';

  if (accuracy >= 80) return 'bg-yellow-100';

  return 'bg-red-100';

 };



 if (!analysis) {

  return (

   <View className="flex-1 justify-center items-center bg-white">

    <Text className="text-gray-800 text-lg">Analyzing...</Text>

   </View>

  );

 }



 return (

  <ScrollView className="flex-1 bg-white p-4">

   {/* Back Button */}

   <TouchableOpacity onPress={onBack} className="flex-row items-center mb-4">

    <ArrowLeft stroke="gray" width={24} height={24} />

    <Text className="ml-2 text-gray-800 text-lg">Back to Analysis Options</Text>

   </TouchableOpacity>



   {/* Header */}

   <View className="mb-6">

    <Text className="text-3xl font-bold text-gray-800">

     {animalType === 'cow' ? 'Cow' : 'Buffalo'} Breed Identification Results

    </Text>

    <Text className="text-gray-600 mt-2">

     Based on advanced AI image analysis, here's what we identified about your {animalType}.

    </Text>

   </View>



   {/* Image and Primary Result */}

   <View className="mb-6 bg-white rounded-xl shadow p-4">

    <Image

     source={{ uri: uploadedImage }}

     className="w-full h-64 rounded-xl"

     resizeMode="cover"

    />

    <View className="mt-4 flex-row justify-between items-center">

     <Text className="text-xl font-semibold text-gray-800">Identified Breed</Text>

     <Search stroke="blue" width={24} height={24} />

    </View>

    <View className="mt-3">

     <Text className="text-2xl font-bold text-gray-800">{analysis.primaryBreed.name}</Text>

     <Text className="text-gray-600">{analysis.primaryBreed.type}</Text>

    </View>

   </View>



   {/* Accuracy */}

   <View className="mb-6 bg-white rounded-xl shadow p-4 items-center">

    <View className="flex-row items-center mb-4">

     <Target stroke="purple" width={24} height={24} />

     <Text className="text-xl font-semibold ml-2 text-gray-800">Accuracy Score</Text>

    </View>

    <View

     className={`w-24 h-24 rounded-full justify-center items-center ${getAccuracyBgColor(

      analysis.confidence

     )}`}

    >

     <Text className={`text-3xl font-bold ${getAccuracyColor(analysis.confidence)}`}>

      {analysis.confidence}%

     </Text>

    </View>

    <Text className="text-gray-600 mt-2">

     Confidence Level:{' '}

     {analysis.confidence >= 90

      ? 'Very High'

      : analysis.confidence >= 80

      ? 'High'

      : analysis.confidence >= 70

      ? 'Moderate'

      : 'Low'}

    </Text>

   </View>



   {/* Breed Info */}

   <View className="mb-6 bg-white rounded-xl shadow p-4">

    <View className="flex-row items-center mb-4">

     <Award stroke="blue" width={24} height={24} />

     <Text className="text-xl font-semibold ml-2 text-gray-800">Breed Information</Text>

    </View>



    <View className="p-3 bg-blue-50 rounded-lg mb-3">

     <View className="flex-row items-center mb-1">

      <CheckCircle stroke="blue" width={20} height={20} />

      <Text className="ml-1 font-semibold text-blue-800">Primary Match</Text>

     </View>

     <Text className="text-blue-700 font-semibold">{analysis.primaryBreed.name}</Text>

     <Text className="text-blue-600">{analysis.primaryBreed.type}</Text>

     <Text className="text-blue-600 text-sm mt-1">Confidence: {analysis.confidence}%</Text>

    </View>



    <Text className="font-medium text-gray-800 mb-2">Alternative Possibilities</Text>

    {analysis.alternativeBreeds.map((breed, index) => (

     <View key={index} className="flex-row justify-between p-3 bg-gray-50 rounded-lg mb-2">

      <View>

       <Text className="font-medium text-gray-800">{breed.name}</Text>

       <Text className="text-gray-600 text-sm">{breed.type}</Text>

      </View>

      <Text className={`font-medium ${getAccuracyColor(breed.accuracy)}`}>

       {breed.accuracy}%

      </Text>

     </View>

    ))}

   </View>



   {/* Analysis Details */}

   <View className="mb-6 bg-white rounded-xl shadow p-4">

    <View className="flex-row items-center mb-4">

     <Info stroke="green" width={24} height={24} />

     <Text className="text-xl font-semibold ml-2 text-gray-800">Analysis Details</Text>

    </View>



    <Text className="font-medium mb-2">Key Features Identified</Text>

    <View className="mb-3 space-y-1">

     <Text>• Body structure and proportions</Text>

     <Text>• Coat color and pattern</Text>

     <Text>• Facial features and head shape</Text>

     <Text>• Size and build characteristics</Text>

    </View>



    <Text className="font-medium mb-2">Breed Characteristics</Text>

    <View className="flex-row space-x-3">

     <View className="p-3 bg-gray-50 rounded-lg flex-1">

      <Text className="font-medium">Category</Text>

      <Text>{analysis.primaryBreed.type}</Text>

     </View>

     <View className="p-3 bg-gray-50 rounded-lg flex-1">

      <Text className="font-medium">Confidence</Text>

      <Text>{analysis.confidence}%</Text>

     </View>

    </View>

   </View>

  </ScrollView>

 );

};



export default BreedResults;
