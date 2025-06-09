import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadArea from '../components/UploadArea';
import { Bluetooth as Tooth } from 'lucide-react';
import { uploadImage, MultiClassApiResponse } from '../services/api';

type ApiError = {
  error?: string;
};

const UploadPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Silakan pilih gambar terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const predictionResult: MultiClassApiResponse = await uploadImage(selectedFile);

      navigate('/results/latest', {
        state: {
          prediction: predictionResult,
          originalImage: originalImageUrl,
          isLoading: false,
          error: null,
        },
      });
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.error || 'Gagal menganalisis gambar. Silakan coba lagi.';
      setError(errorMessage);
      navigate('/results/error', {
        state: {
          prediction: undefined,
          originalImage: originalImageUrl,
          isLoading: false,
          error: errorMessage,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Upload Dental Image</h1>
          <p className="text-gray-600">
            Upload a clear image of your teeth for AI analysis to detect tooth structure, caries, cavities, and cracks.
          </p>
        </div>

        <div className="mb-8">
          <UploadArea onFileSelected={handleFileSelected} />
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {selectedFile && (
          <div className="animate-fade-in card p-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center">
                <Tooth size={24} className="text-primary-600" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{selectedFile.name}</h3>
                <p className="text-gray-500 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Processing...
              </>
            ) : (
              'Analyze Image'
            )}
          </button>
        </div>

        {/* Information about the AI model */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Tentang Model AI</h3>
          <p className="text-blue-700 text-sm">
            Model AI kami menggunakan arsitektur U-Net untuk segmentasi gambar dental dan dapat mendeteksi 4 kelas:
          </p>
          <ul className="text-blue-700 text-sm mt-2 space-y-1">
            <li>• <strong>Tooth:</strong> Struktur gigi normal</li>
            <li>• <strong>Caries:</strong> Karies gigi (kerusakan awal)</li>
            <li>• <strong>Cavity:</strong> Lubang pada gigi</li>
            <li>• <strong>Crack:</strong> Retakan pada gigi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;