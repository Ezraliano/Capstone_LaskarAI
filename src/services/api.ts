// src/services/api.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Interface dari backend U-Net (sudah ada atau sesuaikan)
export interface UnetApiResponse {
  processed_image: string;
  detected_class: string;
}

export interface ApiError {
  error: string;
}

export const uploadImage = async (file: File): Promise<UnetApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<UnetApiResponse>(`${API_BASE_URL}/predict_endpoint`, formData, { // Pastikan nama endpoint benar
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ApiError;
    }
    throw { error: 'An unknown error occurred during upload or server connection failed' } as ApiError;
  }
};

// --- TAMBAHKAN BAGIAN INI UNTUK getHistory ---
export interface HistoryEntry {
  id: string;
  date: string; // ISO string date
  processed_image_preview: string; // Base64 preview
  detected_class: string;
  // Tambahkan field lain jika backend Anda menyediakannya (misal, original_image_url jika disimpan)
}

export const getHistory = async (): Promise<HistoryEntry[]> => {
  try {
    const response = await axios.get<HistoryEntry[]>(`${API_BASE_URL}/history`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ApiError; // Lempar error dari API jika ada
    }
    // Untuk error jaringan atau lainnya
    throw { error: 'Failed to fetch analysis history.' } as ApiError;
  }
};
// --- AKHIR TAMBAHAN ---