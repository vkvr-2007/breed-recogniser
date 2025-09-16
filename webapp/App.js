import React, { useState, useEffect } from 'react';
import { Upload, Camera, Search, Heart, ArrowRight, CheckCircle, Moon, Sun, DollarSign, Beef, Droplets, ArrowLeft } from 'lucide-react';
import HealthForm from './components/HealthForm';
import HealthResults from './components/HealthResults';
import BreedResults from './components/BreedResults';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [appState, setAppState] = useState('upload');
  const [healthFormData, setHealthFormData] = useState(null);
  const [animalType, setAnimalType] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const resetApp = () => {
    setUploadedImage(null);
    setSelectedAction(null);
    setAppState('upload');
    setHealthFormData(null);
    setAnimalType(null);
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    if (action === 'health') setAppState('health-form');
    else if (action === 'breed') setAppState('breed-analysis');
    else if (action === 'cost') setAppState('cost-analysis');
  };

  const handleCostOptionSelect = (costType) => {
    if (costType === 'animal-cost') setAppState('animal-cost');
    else if (costType === 'milk-cost') setAppState('milk-cost');
  };

  const handleBackToCostAnalysis = () => setAppState('cost-analysis');
  const handleHealthFormSubmit = (data) => {
    setHealthFormData(data);
    setAppState('health-results');
  };
  const handleBackToActionSelection = () => {
    setAppState('action-selection');
    setSelectedAction(null);
  };
  const handleBackToHealthForm = () => setAppState('health-form');

  useEffect(() => {
    if (uploadedImage && animalType && appState === 'upload') {
      setAppState('action-selection');
    }
  }, [uploadedImage, animalType, appState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <Beef className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Breed-Recogniser</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Smart Animal Health & Breed Detection</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {uploadedImage && (
                <button
                  onClick={resetApp}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                >
                  Start Over
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* You can keep the rest of your JSX as-is, just remove TypeScript-specific syntax like `!` */}
        {/* Example: */}
        {appState === 'health-form' && (
          <HealthForm
            uploadedImage={uploadedImage}
            animalType={animalType}
            onSubmit={handleHealthFormSubmit}
            onBack={handleBackToActionSelection}
          />
        )}
        {appState === 'health-results' && (
          <HealthResults
            formData={healthFormData}
            uploadedImage={uploadedImage}
            animalType={animalType}
            onBack={handleBackToHealthForm}
          />
        )}
        {appState === 'breed-analysis' && (
          <BreedResults
            uploadedImage={uploadedImage}
            animalType={animalType}
            onBack={handleBackToActionSelection}
          />
        )}
        {/* Keep the rest of your appState conditions exactly like in TSX */}
      </main>
    </div>
  );
}

export default App;
