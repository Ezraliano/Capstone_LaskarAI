import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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

export interface ApiError {
  error: string;
}

export const uploadImage = async (file: File): Promise<MultiClassApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('🔄 Uploading image to:', `${API_BASE_URL}/predict_endpoint`);
    
    const response = await axios.post<MultiClassApiResponse>(
      `${API_BASE_URL}/predict_endpoint`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout
      }
    );
    
    console.log('✅ Upload successful');
    return response.data;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        throw error.response.data as ApiError;
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        throw { error: 'Server tidak merespons. Pastikan Flask API berjalan di http://localhost:5000' } as ApiError;
      } else {
        // Something else happened
        console.error('Request setup error:', error.message);
        throw { error: `Kesalahan dalam pengaturan request: ${error.message}` } as ApiError;
      }
    }
    
    throw { error: 'Terjadi kesalahan yang tidak diketahui' } as ApiError;
  }
};

export const checkHealth = async () => {
  try {
    console.log('🔄 Checking server health...');
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    console.log('✅ Health check successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw error.response.data as ApiError;
      } else if (error.request) {
        throw { error: 'Server tidak dapat dijangkau. Pastikan Flask API berjalan.' } as ApiError;
      }
    }
    
    throw { error: 'Gagal memeriksa status server' } as ApiError;
  }
};