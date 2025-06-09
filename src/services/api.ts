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
    const response = await axios.post<MultiClassApiResponse>(`${API_BASE_URL}/predict_endpoint`, formData, {
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

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ApiError;
    }
    throw { error: 'Failed to check server health' } as ApiError;
  }
};