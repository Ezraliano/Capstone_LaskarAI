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

from model import load_unet_model # Pastikan model.py Anda benar

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'models/unet_dental_segmentation.h5'
IMAGE_SIZE = (128, 128)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

model = None
try:
    if not os.path.exists(MODEL_PATH):
        print(f"ERROR: Model file not found at {MODEL_PATH}")
    else:
        model = load_unet_model(MODEL_PATH)
except Exception as e:
    print(f"Failed to initialize model system: {e}")

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

def analyze_mask_for_percentage(mask_array_binary, total_pixels):
    """
    Menganalisis masker biner untuk klasifikasi umum dan persentase area anomali.
    """
    mask_uint8 = (mask_array_binary * 255).astype(np.uint8)
    contours, _ = cv2.findContours(mask_uint8, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    analysis_results = {
        "detected_class": "Normal / No significant features detected",
        "contour_color_name": "N/A",
        "anomaly_percentage": 0.0,
        # Tempat untuk persentase per kelas di masa depan:
        # "class_percentages": {
        # "tooth": 0.0, "caries": 0.0, "cavity": 0.0, "crack": 0.0
        # }
    }

    if not contours:
        return analysis_results

    # Gabungkan semua kontur jika ada beberapa area terdeteksi sebagai "anomali" oleh model biner
    total_anomaly_area = 0
    for contour in contours:
        total_anomaly_area += cv2.contourArea(contour)
    
    min_area_threshold = total_pixels * 0.003 # Anomali harus lebih dari 0.3% total area gambar

    if total_anomaly_area > min_area_threshold:
        analysis_results["detected_class"] = "Anomaly Detected"
        analysis_results["contour_color_name"] = "Red"
        analysis_results["anomaly_percentage"] = round((total_anomaly_area / total_pixels) * 100, 2)
    else:
        analysis_results["detected_class"] = "Normal / Features too small or not significant"
        # anomaly_percentage tetap 0.0 jika di bawah threshold signifikan

    # CATATAN PENTING:
    # Untuk mendapatkan persentase "tooth, caries, cavity, crack", Anda memerlukan:
    # 1. Model segmentasi multi-kelas yang outputnya adalah masker dengan nilai berbeda untuk tiap kelas.
    # 2. Logika di sini untuk menghitung area untuk setiap nilai/kelas tersebut.
    # Contoh (jika model multi-kelas):
    # mask_multiclass = model.predict(...) -> hasilnya array dengan nilai misal 0=bg, 1=tooth, 2=caries, dst.
    # for class_value, class_name in class_map.items():
    # area_class = np.sum(mask_multiclass == class_value)
    # analysis_results["class_percentages"][class_name] = (area_class / total_pixels) * 100
    
    return analysis_results


def create_overlay_image(original_image_pil, predicted_mask_binary, overlay_color_tuple=(255, 0, 0), alpha=0.4):
    original_resized_pil = original_image_pil.resize(IMAGE_SIZE, Image.LANCZOS)
    mask_colored_np = np.zeros((*IMAGE_SIZE, 3), dtype=np.uint8)
    mask_colored_np[predicted_mask_binary == 1] = overlay_color_tuple
    mask_colored_pil = Image.fromarray(mask_colored_np, 'RGB')
    
    overlayed_image_pil = Image.blend(original_resized_pil, mask_colored_pil, alpha=alpha)
    
    final_image_np = np.array(original_resized_pil)
    final_image_np[predicted_mask_binary == 1] = np.array(overlayed_image_pil)[predicted_mask_binary == 1]
    final_overlay_pil = Image.fromarray(final_image_np)
    return final_overlay_pil

analysis_history_dummy = []

@app.route('/predict_endpoint', methods=['POST'])
def predict_endpoint_route():
    if model is None:
        return jsonify({'error': 'Model tidak dapat dimuat. Silakan periksa log server.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file dalam permintaan.'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Tidak ada file yang dipilih untuk diunggah.'}), 400

    if file and allowed_file(file.filename):
        try:
            image_bytes = file.read()
            original_image_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            
            processed_image_array = preprocess_image(image_bytes, IMAGE_SIZE)

            predicted_mask_batch = model.predict(processed_image_array)
            predicted_mask_single = predicted_mask_batch[0, :, :, 0]
            predicted_mask_binary = (predicted_mask_single > 0.5).astype(np.uint8)

            total_image_pixels = IMAGE_SIZE[0] * IMAGE_SIZE[1]
            analysis_data = analyze_mask_for_percentage(predicted_mask_binary, total_image_pixels)

            overlay_color = (255,0,0)
            if analysis_data["contour_color_name"] == "N/A":
                final_image_to_send_pil = original_image_pil.resize(IMAGE_SIZE, Image.LANCZOS)
            else:
                # Anda bisa menyesuaikan warna overlay berdasarkan analisis jika perlu
                final_image_to_send_pil = create_overlay_image(original_image_pil, predicted_mask_binary, overlay_color_tuple=overlay_color)

            buffered = io.BytesIO()
            final_image_to_send_pil.save(buffered, format="PNG")
            img_str_processed = base64.b64encode(buffered.getvalue()).decode()

            response_data = {
                'processed_image': 'data:image/png;base64,' + img_str_processed,
                'detected_class': analysis_data["detected_class"],
                'anomaly_percentage': analysis_data["anomaly_percentage"]
                # Jika nanti ada class_percentages, tambahkan di sini:
                # 'class_percentages': analysis_data["class_percentages"]
            }
            
            history_entry = {
                "id": str(len(analysis_history_dummy) + 1),
                "date": datetime.datetime.now().isoformat(),
                "processed_image_preview": 'data:image/png;base64,' + img_str_processed,
                "detected_class": analysis_data["detected_class"],
                "anomaly_percentage": analysis_data["anomaly_percentage"]
            }
            analysis_history_dummy.insert(0, history_entry)
                
            return jsonify(response_data)

        except Exception as e:
            import traceback
            print(f"Error during prediction processing: {e}")
            traceback.print_exc()
            return jsonify({'error': f'Terjadi kesalahan saat memproses gambar di server: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Tipe file tidak diizinkan. Gunakan PNG, JPG, atau JPEG.'}), 400

@app.route('/history', methods=['GET'])
def get_analysis_history():
    return jsonify(analysis_history_dummy)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)