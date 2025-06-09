import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadArea from '../components/UploadArea';
import { Bluetooth as Tooth, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadImage, checkHealth, MultiClassApiResponse } from '../services/api';

type ApiError = {
  error?: string;
};

const UploadPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check server health on component mount
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        await checkHealth();
        setServerStatus('online');
      } catch (error) {
        setServerStatus('offline');
        console.error('Server health check failed:', error);
      }
    };

    checkServerHealth();
  }, []);

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

    if (serverStatus === 'offline') {
      setError('Server Flask API tidak dapat dijangkau. Pastikan server berjalan di http://localhost:5000');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Starting image analysis...');
      const predictionResult: MultiClassApiResponse = await uploadImage(selectedFile);
      console.log('✅ Analysis completed:', predictionResult);

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
      console.error('❌ Analysis failed:', errorMessage);
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

  const retryServerConnection = async () => {
    setServerStatus('checking');
    try {
      await checkHealth();
      setServerStatus('online');
      setError(null);
    } catch (error) {
      setServerStatus('offline');
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

        {/* Server Status Indicator */}
        <div className="mb-6">
          <div className={`p-4 rounded-lg border flex items-center justify-between ${
            serverStatus === 'online' 
              ? 'bg-green-50 border-green-200' 
              : serverStatus === 'offline'
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center space-x-2">
              {serverStatus === 'online' && <CheckCircle size={20} className="text-green-600" />}
              {serverStatus === 'offline' && <AlertCircle size={20} className="text-red-600" />}
              {serverStatus === 'checking' && (
                <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
              )}
              <span className={`font-medium ${
                serverStatus === 'online' 
                  ? 'text-green-700' 
                  : serverStatus === 'offline'
                  ? 'text-red-700'
                  : 'text-yellow-700'
              }`}>
                Server Status: {
                  serverStatus === 'online' ? 'Online' :
                  serverStatus === 'offline' ? 'Offline' : 'Checking...'
                }
              </span>
            </div>
            {serverStatus === 'offline' && (
              <button
                onClick={retryServerConnection}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
              >
                Retry Connection
              </button>
            )}
          </div>
          
          {serverStatus === 'offline' && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <strong>Troubleshooting:</strong>
              <ol className="mt-1 ml-4 list-decimal">
                <li>Pastikan Flask API berjalan dengan menjalankan: <code className="bg-red-100 px-1 rounded">python api/app.py</code></li>
                <li>Periksa apakah server berjalan di <code className="bg-red-100 px-1 rounded">http://localhost:5000</code></li>
                <li>Pastikan file model <code className="bg-red-100 px-1 rounded">unet_dental_segmentation.h5</code> ada di folder <code className="bg-red-100 px-1 rounded">api/models/</code></li>
              </ol>
            </div>
          )}
        </div>

        <div className="mb-8">
          <UploadArea onFileSelected={handleFileSelected} />
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            <div className="flex items-start space-x-2">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <strong>Error:</strong> {error}
              </div>
            </div>
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
            disabled={!selectedFile || isLoading || serverStatus !== 'online'}
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
            <li>• <strong>Tooth:</strong> Struktur gigi normal (Hijau)</li>
            <li>• <strong>Caries:</strong> Karies gigi/kerusakan awal (Kuning)</li>
            <li>• <strong>Cavity:</strong> Lubang pada gigi (Merah)</li>
            <li>• <strong>Crack:</strong> Retakan pada gigi (Oranye)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;