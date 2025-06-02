// src/pages/HistoryPage.tsx
import React, { useEffect, useState } from 'react'; // Pastikan React diimpor
// import Layout from '../components/Layout'; // Jika Anda menggunakan Layout
import { getHistory, HistoryEntry, ApiError } from '../services/api'; // Impor dari api.ts
import { List, AlertTriangle, RefreshCw, Calendar, Tag, Eye, Info } from 'lucide-react'; // Contoh ikon

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Gagal memuat riwayat.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    // <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <List size={32} className="mr-3 text-blue-600" />
            Riwayat Analisis Gambar
          </h1>
          <button
            onClick={fetchHistory}
            disabled={isLoading}
            className="btn btn-outline btn-primary flex items-center gap-2"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            Muat Ulang
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-10">
            <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500">Memuat riwayat...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold flex items-center"><AlertTriangle size={20} className="mr-2"/>Terjadi Kesalahan!</strong>
            <span className="block sm:inline ml-1">{error}</span>
          </div>
        )}

        {!isLoading && !error && history.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Info size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Belum ada riwayat analisis.</p>
            <p className="text-gray-500">Unggah gambar untuk memulai analisis pertama Anda.</p>
          </div>
        )}

        {!isLoading && !error && history.length > 0 && (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-1">
                    {item.processed_image_preview ? (
                       <img 
                         src={item.processed_image_preview} // Ini adalah base64
                         alt={`Hasil Analisis ${item.id}`} 
                         className="w-full h-32 object-contain rounded bg-gray-100 p-1"
                       />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        <Eye size={32}/>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 flex items-center mb-1">
                      <Calendar size={14} className="mr-2" />
                      Tanggal: {new Date(item.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    <p className="text-md font-semibold text-gray-700 flex items-center">
                      <Tag size={16} className="mr-2 text-blue-500" />
                      Hasil: <span className="ml-1 font-normal text-blue-600">{item.detected_class}</span>
                    </p>
                    {/* Anda bisa tambahkan tombol "Lihat Detail" jika ada halaman detail per riwayat */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    // </Layout>
  );
};

export default HistoryPage;