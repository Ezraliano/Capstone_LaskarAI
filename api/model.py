import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import custom_object_scope
import numpy as np # Meskipun tidak digunakan langsung di sini, seringkali berguna

# Ini adalah fungsi custom yang mungkin Anda gunakan saat melatih model U-Net
# Pastikan definisinya sama dengan yang Anda gunakan saat training jika model disimpan dengan custom objects
def dice_coef(y_true, y_pred, smooth=1e-6): # Ditambahkan smooth untuk stabilitas
    y_true_f = tf.keras.backend.flatten(y_true)
    y_pred_f = tf.keras.backend.flatten(y_pred)
    intersection = tf.keras.backend.sum(y_true_f * y_pred_f)
    return (2. * intersection + smooth) / (tf.keras.backend.sum(y_true_f) + tf.keras.backend.sum(y_pred_f) + smooth)

def dice_loss(y_true, y_pred):
    return 1 - dice_coef(y_true, y_pred)

def load_unet_model(model_path):
    """
    Memuat model U-Net dengan custom objects jika diperlukan.
    """
    try:
        # Jika model Anda dilatih dengan custom metrics/losses seperti dice_coef atau dice_loss,
        # Anda perlu menyertakannya dalam custom_object_scope.
        # Sesuaikan dictionary ini jika nama fungsi Anda berbeda atau ada custom objects lain.
        with custom_object_scope({'dice_coef': dice_coef, 'dice_loss': dice_loss}):
            model = load_model(model_path)
        print(f"Model loaded successfully from {model_path}")
        return model
    except Exception as e:
        print(f"Error loading U-Net model from {model_path}: {e}")
        # Anda bisa memilih untuk raise error lagi atau mengembalikan None dan ditangani di app.py
        raise e # Lebih baik di-raise agar app.py tahu ada masalah serius