import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadArea from '../components/UploadArea';
import { Bluetooth as Tooth } from 'lucide-react';
import { uploadImage } from '../services/api';
// Define UnetApiResponse type locally if not available from api.ts
type UnetApiResponse = object; // Replace '{}' with 'object' to satisfy lint rules

// Define ApiError type if not imported from elsewhere
type ApiError = {
  error?: string;
};

const UploadPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For compatibility with the rest of the code
  const file = selectedFile;
  const isUploading = isLoading;

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
      const predictionResult: UnetApiResponse = await uploadImage(selectedFile);

      navigate('/results', {
        state: {
          prediction: predictionResult,
          originalImage: originalImageUrl,
          isLoading: false,
          error: null,
        },
      });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Gagal menganalisis gambar. Silakan coba lagi.');
      navigate('/results', {
        state: {
          prediction: undefined,
          originalImage: originalImageUrl,
          isLoading: false,
          error: apiError.error || 'Gagal menganalisis gambar. Silakan coba lagi.',
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
            Upload a clear image of your teeth for AI analysis to detect potential dental issues.
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

        {file && (
          <div className="animate-fade-in card p-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center">
                <Tooth size={24} className="text-primary-600" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-gray-500 text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Processing...
              </>
            ) : (
              'Analyze Image'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;