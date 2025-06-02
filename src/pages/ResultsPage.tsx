// Di dalam ResultsPage.tsx
import React from 'react'; // Pastikan React diimpor jika belum
import { useLocation } from 'react-router-dom';
import AnalysisResults, { UnetApiResponse } from '../components/AnalysisResults'; // Sesuaikan path
// import Layout from '../components/Layout'; // Jika Anda menggunakan Layout

interface ResultsLocationState {
  prediction?: UnetApiResponse;
  originalImage?: string;
  isLoading: boolean;
  error?: string | null;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as ResultsLocationState | null; // state bisa null jika diakses langsung

  // Berikan nilai default atau tangani jika state tidak ada
  const predictionData = state?.prediction;
  const originalImageUrl = state?.originalImage;
  // isLoading di sini seharusnya sudah false karena kita sudah selesai proses di UploadPage
  // tapi jika Anda mengirimkannya, bisa digunakan. Atau, jika loading hanya untuk animasi di AnalysisResults
  const isLoadingInitial = state?.isLoading ?? false; // Jika tidak ada state, anggap tidak loading
  const errorMsg = state?.error;

  // Jika tidak ada state sama sekali (misalnya user akses URL /results langsung)
  if (!state) {
    return (
      // <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Tidak Ada Hasil</h1>
          <p className="text-gray-600">
            Silakan unggah gambar terlebih dahulu untuk melihat hasil analisis.
          </p>
          {/* Anda bisa tambahkan link kembali ke halaman upload */}
        </div>
      // </Layout>
    );
  }

  return (
    // <Layout>
      <div className="container mx-auto px-4 py-8">
        <AnalysisResults
          prediction={predictionData}
          originalImageUrl={originalImageUrl}
          isLoading={isLoadingInitial} // Ini akan membuat AnalysisResults menampilkan loading jika true
          error={errorMsg}
        />
      </div>
    // </Layout>
  );
};

export default ResultsPage;