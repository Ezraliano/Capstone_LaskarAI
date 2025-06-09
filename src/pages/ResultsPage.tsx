import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AnalysisResults, { MultiClassApiResponse } from '../components/AnalysisResults';

interface ResultsLocationState {
  prediction?: MultiClassApiResponse;
  originalImage?: string;
  isLoading: boolean;
  error?: string | null;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as ResultsLocationState | null;

  const predictionData = state?.prediction;
  const originalImageUrl = state?.originalImage;
  const isLoadingInitial = state?.isLoading ?? false;
  const errorMsg = state?.error;

  if (!state) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Tidak Ada Hasil</h1>
        <p className="text-gray-600 mb-6">
          Silakan unggah gambar terlebih dahulu untuk melihat hasil analisis.
        </p>
        <Link 
          to="/upload" 
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Kembali ke Upload
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to="/upload" 
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft size={18} />
          Upload Gambar Baru
        </Link>
      </div>
      
      <AnalysisResults
        prediction={predictionData}
        originalImageUrl={originalImageUrl}
        isLoading={isLoadingInitial}
        error={errorMsg}
      />
    </div>
  );
};

export default ResultsPage;