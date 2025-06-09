import os
import io
import numpy as np
from PIL import Image
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from tensorflow.keras.preprocessing.image import img_to_array
import datetime

from model import load_unet_model

app = Flask(__name__)
CORS(app)

# Updated model path to match your folder structure
MODEL_PATH = 'models/unet_dental_segmentation.h5'
IMAGE_SIZE = (128, 128)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Class mapping for multi-class segmentation
CLASS_NAMES = {
    0: 'background',
    1: 'tooth',
    2: 'caries',
    3: 'cavity',
    4: 'crack'
}

# Color mapping for visualization
CLASS_COLORS = {
    0: (0, 0, 0),        # background - black
    1: (0, 255, 0),      # tooth - green
    2: (255, 255, 0),    # caries - yellow
    3: (255, 0, 0),      # cavity - red
    4: (255, 165, 0)     # crack - orange
}

model = None

def initialize_model():
    global model
    try:
        # Check if model file exists
        if not os.path.exists(MODEL_PATH):
            print(f"ERROR: Model file not found at {MODEL_PATH}")
            print(f"Current working directory: {os.getcwd()}")
            print(f"Files in current directory: {os.listdir('.')}")
            if os.path.exists('models'):
                print(f"Files in models directory: {os.listdir('models')}")
            return False
        
        print(f"Loading model from {MODEL_PATH}...")
        model = load_unet_model(MODEL_PATH)
        print(f"✅ Model loaded successfully from {MODEL_PATH}")
        return True
    except Exception as e:
        print(f"❌ Failed to initialize model: {e}")
        import traceback
        traceback.print_exc()
        return False

# Initialize model on startup
model_loaded = initialize_model()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_bytes, target_size):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_resized = image.resize(target_size, Image.LANCZOS)
        image_array = img_to_array(image_resized)
        image_array = image_array / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        return image_array
    except Exception as e:
        print(f"Error in preprocessing image: {e}")
        raise

def analyze_multiclass_segmentation(predicted_mask, total_pixels):
    """
    Analyze multi-class segmentation mask to get percentages for each class.
    """
    try:
        # Handle different output shapes from the model
        if len(predicted_mask.shape) == 3:
            # If output is (height, width, num_classes)
            predicted_classes = np.argmax(predicted_mask, axis=-1)
        elif len(predicted_mask.shape) == 2:
            # If output is (height, width) - single channel
            # Assume it's binary segmentation, convert to multi-class
            predicted_classes = (predicted_mask > 0.5).astype(np.uint8)
        else:
            raise ValueError(f"Unexpected mask shape: {predicted_mask.shape}")
        
        # Calculate percentages for each class
        class_percentages = {}
        class_pixel_counts = {}
        
        for class_id, class_name in CLASS_NAMES.items():
            if class_name == 'background':
                continue
                
            if len(predicted_mask.shape) == 3:
                pixel_count = np.sum(predicted_classes == class_id)
            else:
                # For binary segmentation, treat non-zero as "tooth"
                if class_name == 'tooth':
                    pixel_count = np.sum(predicted_classes == 1)
                else:
                    pixel_count = 0
            
            percentage = (pixel_count / total_pixels) * 100
            class_percentages[class_name] = round(percentage, 2)
            class_pixel_counts[class_name] = int(pixel_count)
        
        # Determine overall condition
        max_class = max(class_percentages.items(), key=lambda x: x[1])
        
        if max_class[1] < 1.0:  # Less than 1% of any pathological condition
            detected_class = "Healthy - No significant dental issues detected"
            severity = "healthy"
        elif max_class[0] == 'tooth':
            detected_class = "Normal tooth structure detected"
            severity = "healthy"
        else:
            detected_class = f"Dental condition detected: {max_class[0].capitalize()}"
            if max_class[1] < 5:
                severity = "mild"
            elif max_class[1] < 15:
                severity = "moderate"
            else:
                severity = "severe"
        
        return {
            "detected_class": detected_class,
            "severity": severity,
            "class_percentages": class_percentages,
            "class_pixel_counts": class_pixel_counts,
            "dominant_condition": max_class[0] if max_class[1] > 1.0 else "healthy"
        }
    except Exception as e:
        print(f"Error in analyze_multiclass_segmentation: {e}")
        raise

def create_multiclass_overlay(original_image_pil, predicted_mask, alpha=0.6):
    """
    Create overlay image with different colors for each class.
    """
    try:
        original_resized_pil = original_image_pil.resize(IMAGE_SIZE, Image.LANCZOS)
        original_array = np.array(original_resized_pil)
        
        # Handle different output shapes
        if len(predicted_mask.shape) == 3:
            predicted_classes = np.argmax(predicted_mask, axis=-1)
        else:
            predicted_classes = (predicted_mask > 0.5).astype(np.uint8)
        
        # Create colored overlay
        overlay = np.zeros_like(original_array)
        
        if len(predicted_mask.shape) == 3:
            # Multi-class segmentation
            for class_id, color in CLASS_COLORS.items():
                if class_id == 0:  # Skip background
                    continue
                mask = predicted_classes == class_id
                overlay[mask] = color
        else:
            # Binary segmentation - use green for detected areas
            mask = predicted_classes == 1
            overlay[mask] = CLASS_COLORS[1]  # Green for tooth
        
        # Blend original image with overlay
        result = original_array.copy()
        
        # Only apply overlay where there are non-background predictions
        non_bg_mask = predicted_classes > 0
        if np.any(non_bg_mask):
            result[non_bg_mask] = (
                (1 - alpha) * original_array[non_bg_mask] + 
                alpha * overlay[non_bg_mask]
            ).astype(np.uint8)
        
        return Image.fromarray(result)
    except Exception as e:
        print(f"Error in create_multiclass_overlay: {e}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_path': MODEL_PATH,
        'model_exists': os.path.exists(MODEL_PATH),
        'current_directory': os.getcwd(),
        'timestamp': datetime.datetime.now().isoformat()
    })

@app.route('/predict_endpoint', methods=['POST'])
def predict_endpoint_route():
    print("🔄 Received prediction request")
    
    if model is None:
        error_msg = 'Model tidak dapat dimuat. Silakan periksa log server dan pastikan file model ada.'
        print(f"❌ {error_msg}")
        return jsonify({'error': error_msg}), 500

    if 'file' not in request.files:
        error_msg = 'Tidak ada file dalam permintaan.'
        print(f"❌ {error_msg}")
        return jsonify({'error': error_msg}), 400

    file = request.files['file']
    if file.filename == '':
        error_msg = 'Tidak ada file yang dipilih untuk diunggah.'
        print(f"❌ {error_msg}")
        return jsonify({'error': error_msg}), 400

    if file and allowed_file(file.filename):
        try:
            print(f"📁 Processing file: {file.filename}")
            
            # Read and process image
            image_bytes = file.read()
            original_image_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            print(f"📷 Original image size: {original_image_pil.size}")
            
            # Preprocess image
            processed_image_array = preprocess_image(image_bytes, IMAGE_SIZE)
            print(f"🔄 Preprocessed image shape: {processed_image_array.shape}")

            # Get model prediction
            print("🤖 Running model prediction...")
            predicted_mask_batch = model.predict(processed_image_array)
            predicted_mask_single = predicted_mask_batch[0]
            print(f"📊 Prediction output shape: {predicted_mask_single.shape}")

            # Calculate total pixels
            total_image_pixels = IMAGE_SIZE[0] * IMAGE_SIZE[1]
            
            # Analyze segmentation results
            print("📈 Analyzing segmentation results...")
            analysis_data = analyze_multiclass_segmentation(predicted_mask_single, total_image_pixels)

            # Create overlay visualization
            print("🎨 Creating overlay visualization...")
            final_image_to_send_pil = create_multiclass_overlay(original_image_pil, predicted_mask_single)

            # Convert to base64
            buffered = io.BytesIO()
            final_image_to_send_pil.save(buffered, format="PNG")
            img_str_processed = base64.b64encode(buffered.getvalue()).decode()

            # Prepare response
            response_data = {
                'processed_image': 'data:image/png;base64,' + img_str_processed,
                'detected_class': analysis_data["detected_class"],
                'severity': analysis_data["severity"],
                'class_percentages': analysis_data["class_percentages"],
                'class_pixel_counts': analysis_data["class_pixel_counts"],
                'dominant_condition': analysis_data["dominant_condition"],
                'legend': {
                    'tooth': 'Green - Normal tooth structure',
                    'caries': 'Yellow - Dental caries detected',
                    'cavity': 'Red - Cavity formation',
                    'crack': 'Orange - Tooth crack/fracture'
                }
            }
            
            print("✅ Analysis completed successfully")
            return jsonify(response_data)

        except Exception as e:
            import traceback
            error_msg = f'Terjadi kesalahan saat memproses gambar: {str(e)}'
            print(f"❌ {error_msg}")
            traceback.print_exc()
            return jsonify({'error': error_msg}), 500
    else:
        error_msg = 'Tipe file tidak diizinkan. Gunakan PNG, JPG, atau JPEG.'
        print(f"❌ {error_msg}")
        return jsonify({'error': error_msg}), 400

if __name__ == '__main__':
    print("🚀 Starting Flask server...")
    print(f"📁 Current working directory: {os.getcwd()}")
    print(f"🤖 Model loaded: {model is not None}")
    
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)