import { CheckCircle, AlertTriangle, InfoIcon, Percent, Eye, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface MultiClassApiResponse {
  processed_image: string;
  detected_class: string;
  severity: 'healthy' | 'mild' | 'moderate' | 'severe';
  class_percentages: {
    tooth: number;
    caries: number;
    cavity: number;
    crack: number;
  };
  class_pixel_counts: {
    tooth: number;
    caries: number;
    cavity: number;
    crack: number;
  };
  dominant_condition: string;
  legend: {
    tooth: string;
    caries: string;
    cavity: string;
    crack: string;
  };
}

interface AnalysisResultsProps {
  prediction?: MultiClassApiResponse;
  originalImageUrl?: string;
  isLoading: boolean;
  error?: string | null;
}

const AnalysisResults = ({ prediction, originalImageUrl, isLoading, error }: AnalysisResultsProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isLoading, prediction, error]);

  if (isLoading || (!showContent && !error && !prediction)) {
    return (
      <div className="flex justify-center items-center p-12 min-h-[300px]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Menganalisis gambar gigi Anda...</p>
          <p className="text-sm text-gray-400">Mohon tunggu sebentar.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center p-8 text-center bg-red-50 border border-red-200 rounded-lg min-h-[300px]">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Gagal Menganalisis Gambar</h3>
        <p className="text-gray-700 mb-1">Terjadi kesalahan:</p>
        <p className="text-red-600 bg-red-100 px-2 py-1 rounded text-sm mb-4">{error}</p>
        <p className="text-gray-500 text-sm">
          Silakan coba unggah gambar lain atau periksa koneksi Anda.
        </p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="flex flex-col justify-center items-center p-12 text-center bg-yellow-50 border border-yellow-200 rounded-lg min-h-[300px]">
        <InfoIcon size={48} className="text-yellow-500 mb-4" />
        <h3 className="text-xl font-semibold text-yellow-700 mb-2">Tidak Ada Hasil Analisis</h3>
        <p className="text-gray-600">Data hasil analisis tidak tersedia.</p>
      </div>
    );
  }

  const isHealthy = prediction.severity === 'healthy';
  const severityColors = {
    healthy: 'text-green-700',
    mild: 'text-yellow-700',
    moderate: 'text-orange-700',
    severe: 'text-red-700'
  };

  const severityBgColors = {
    healthy: 'bg-green-50 border-green-200',
    mild: 'bg-yellow-50 border-yellow-200',
    moderate: 'bg-orange-50 border-orange-200',
    severe: 'bg-red-50 border-red-200'
  };

  return (
    <div className={`animate-fade-in ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
        {originalImageUrl && (
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Gambar Asli</h3>
            <div className="aspect-square overflow-hidden rounded flex items-center justify-center bg-gray-100">
              <img
                src={originalImageUrl}
                alt="Gambar Gigi Asli"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
        <div className={`bg-white shadow-lg rounded-lg p-4 ${!originalImageUrl ? 'lg:col-span-2' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Hasil Segmentasi AI</h3>
          <div className="aspect-square overflow-hidden rounded flex items-center justify-center bg-gray-100">
            <img
              src={prediction.processed_image}
              alt="Gambar Gigi Hasil Analisis"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Eye size={20} className="mr-2 text-blue-500" />
          Legenda Warna Segmentasi
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">{prediction.legend.tooth}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm">{prediction.legend.caries}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">{prediction.legend.cavity}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm">{prediction.legend.crack}</span>
          </div>
        </div>
      </div>

      {/* Main Results */}
      <div className={`shadow-lg rounded-lg p-6 mb-6 border ${severityBgColors[prediction.severity]}`}>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Kesimpulan Analisis</h3>
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0 pt-1">
            {isHealthy ? (
              <CheckCircle size={28} className="text-green-500" />
            ) : (
              <AlertTriangle size={28} className="text-orange-500" />
            )}
          </div>
          <div>
            <p className={`text-lg font-semibold ${severityColors[prediction.severity]}`}>
              {prediction.detected_class}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Tingkat Keparahan: <span className={`font-medium ${severityColors[prediction.severity]}`}>
                {prediction.severity.charAt(0).toUpperCase() + prediction.severity.slice(1)}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Kondisi Dominan: <span className="font-medium">
                {prediction.dominant_condition.charAt(0).toUpperCase() + prediction.dominant_condition.slice(1)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Percentages */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <Percent size={20} className="mr-2 text-blue-500" />
          Persentase Detail per Kelas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(prediction.class_percentages).map(([className, percentage]) => {
            const colorMap = {
              tooth: 'bg-green-100 text-green-800 border-green-200',
              caries: 'bg-yellow-100 text-yellow-800 border-yellow-200',
              cavity: 'bg-red-100 text-red-800 border-red-200',
              crack: 'bg-orange-100 text-orange-800 border-orange-200'
            };
            
            return (
              <div key={className} className={`p-4 rounded-lg border ${colorMap[className as keyof typeof colorMap]}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{className}</span>
                  <Activity size={16} />
                </div>
                <div className="text-2xl font-bold">{percentage.toFixed(2)}%</div>
                <div className="text-xs opacity-75">
                  {prediction.class_pixel_counts[className as keyof typeof prediction.class_pixel_counts]} pixels
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            <strong>Catatan:</strong> Persentase menunjukkan proporsi area yang terdeteksi untuk setiap kondisi dental. 
            Warna pada gambar segmentasi sesuai dengan legenda di atas.
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Penting:</strong> Aplikasi ini adalah alat bantu edukasi dan skrining awal menggunakan AI, 
          bukan pengganti diagnosis medis profesional. Untuk diagnosis dan perawatan yang akurat, 
          selalu konsultasikan dengan dokter gigi Anda.
        </p>
      </div>
    </div>
  );
};

export default AnalysisResults;