// src/components/AnalysisResults.tsx

import { CheckCircle, AlertTriangle, InfoIcon, Percent } from 'lucide-react'; // Tambahkan Percent
import { useEffect, useState } from 'react';

// Sesuaikan dengan output baru dari app.py
export interface UnetApiResponse {
  processed_image: string;
  detected_class: string;
  anomaly_percentage: number; // Persentase anomali umum
  // class_percentages?: { // Opsional, untuk masa depan jika ada model multi-kelas
  //   tooth?: number;
  //   caries?: number;
  //   cavity?: number;
  //   crack?: number;
  // };
}

interface AnalysisResultsProps {
  prediction?: UnetApiResponse;
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
    // ... (kode loading sama seperti sebelumnya) ...
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
    // ... (kode error sama seperti sebelumnya) ...
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
    // ... (kode !prediction sama seperti sebelumnya) ...
    return (
      <div className="flex flex-col justify-center items-center p-12 text-center bg-yellow-50 border border-yellow-200 rounded-lg min-h-[300px]">
        <InfoIcon size={48} className="text-yellow-500 mb-4" />
        <h3 className="text-xl font-semibold text-yellow-700 mb-2">Tidak Ada Hasil Analisis</h3>
        <p className="text-gray-600">Data hasil analisis tidak tersedia.</p>
      </div>
    );
  }

  const isNormal = prediction.detected_class?.toLowerCase().includes("normal");

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
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Gambar Hasil Analisis (Segmentasi)</h3>
          <div className="aspect-square overflow-hidden rounded flex items-center justify-center bg-gray-100">
            <img
              src={prediction.processed_image}
              alt="Gambar Gigi Hasil Analisis"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Kesimpulan Analisis</h3>
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0 pt-1">
            {isNormal ? (
              <CheckCircle size={28} className="text-green-500" />
            ) : (
              <AlertTriangle size={28} className="text-orange-500" />
            )}
          </div>
          <div>
            <p className={`text-lg font-semibold ${isNormal ? "text-green-700" : "text-orange-700"}`}>
              {prediction.detected_class || "Tidak ada kelas spesifik terdeteksi."}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Model AI telah melakukan segmentasi pada gambar gigi Anda.
            </p>
          </div>
        </div>

        {/* Tampilkan Persentase Anomali Umum */}
        {!isNormal && typeof prediction.anomaly_percentage === 'number' && prediction.anomaly_percentage > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
              <Percent size={20} className="mr-2 text-blue-500" />
              Estimasi Area Anomali Terdeteksi:
            </h4>
            <p className="text-2xl font-bold text-blue-600">
              {prediction.anomaly_percentage.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Persentase ini menunjukkan besarnya area yang ditandai oleh model AI dibandingkan total area gambar.
            </p>
          </div>
        )}

        {/* Tempat untuk menampilkan persentase per kelas jika sudah ada
        {prediction.class_percentages && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Detail Persentase per Kelas (Contoh):</h4>
            <ul>
              {Object.entries(prediction.class_percentages).map(([key, value]) => (
                value > 0 && <li key={key} className="text-sm text-gray-600">{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.toFixed(2)}%`}</li>
              ))}
            </ul>
          </div>
        )}
        */}

        <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200">
          <strong>Penting:</strong> Aplikasi ini adalah alat bantu edukasi dan skrining awal, bukan pengganti diagnosis medis profesional. Untuk diagnosis dan perawatan yang akurat, selalu konsultasikan dengan dokter gigi Anda.
        </p>
      </div>
    </div>
  );
};

export default AnalysisResults;