import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import custom_object_scope
import numpy as np

# Custom functions that might be used in your U-Net model
def dice_coef(y_true, y_pred, smooth=1e-6):
    y_true_f = tf.keras.backend.flatten(y_true)
    y_pred_f = tf.keras.backend.flatten(y_pred)
    intersection = tf.keras.backend.sum(y_true_f * y_pred_f)
    return (2. * intersection + smooth) / (tf.keras.backend.sum(y_true_f) + tf.keras.backend.sum(y_pred_f) + smooth)

def dice_loss(y_true, y_pred):
    return 1 - dice_coef(y_true, y_pred)

def iou_coef(y_true, y_pred, smooth=1e-6):
    y_true_f = tf.keras.backend.flatten(y_true)
    y_pred_f = tf.keras.backend.flatten(y_pred)
    intersection = tf.keras.backend.sum(y_true_f * y_pred_f)
    union = tf.keras.backend.sum(y_true_f) + tf.keras.backend.sum(y_pred_f) - intersection
    return (intersection + smooth) / (union + smooth)

def load_unet_model(model_path):
    """
    Load U-Net model with custom objects if needed.
    """
    try:
        print(f"🔄 Attempting to load model from: {model_path}")
        
        # Try loading with custom objects first
        custom_objects = {
            'dice_coef': dice_coef,
            'dice_loss': dice_loss,
            'iou_coef': iou_coef
        }
        
        with custom_object_scope(custom_objects):
            model = load_model(model_path, compile=False)
        
        print(f"✅ Model loaded successfully with custom objects")
        print(f"📊 Model input shape: {model.input_shape}")
        print(f"📊 Model output shape: {model.output_shape}")
        
        return model
        
    except Exception as e:
        print(f"⚠️ Failed to load with custom objects: {e}")
        
        # Try loading without custom objects
        try:
            print("🔄 Trying to load without custom objects...")
            model = load_model(model_path, compile=False)
            print(f"✅ Model loaded successfully without custom objects")
            print(f"📊 Model input shape: {model.input_shape}")
            print(f"📊 Model output shape: {model.output_shape}")
            return model
        except Exception as e2:
            print(f"❌ Failed to load model completely: {e2}")
            raise e2