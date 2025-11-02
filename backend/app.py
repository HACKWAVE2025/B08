from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the trained model
model_path = r"C:\Users\Thanmai\OneDrive\Desktop\Smartbin2\backend\model\waste_classifier.h5"
model = tf.keras.models.load_model(model_path)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'})

    # Ensure upload folder exists
    upload_folder = os.path.join('static', 'uploads')

    # If uploads exists as a file, remove it
    if os.path.exists(upload_folder) and not os.path.isdir(upload_folder):
        os.remove(upload_folder)
    os.makedirs(upload_folder, exist_ok=True)

    # Save uploaded file
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)
    print("File saved at:", file_path)

    # Load image properly for model
    img = image.load_img(file_path, target_size=(64, 64))  # keep RGB (3 channels)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # make it shape (1, 64, 64, 3)
    img_array = img_array / 255.0


    # Predict
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction, axis=1)[0]

    # Map class index to label
    class_labels = {
        0: "Organic Waste",
        1: "Recyclable Waste",
        2: "Hazardous Waste"
    }
    predicted_label = class_labels.get(predicted_class, "Unknown")

    # ✅ Return readable output
    print("Predicted class:", predicted_class)
    return jsonify({'class': str(predicted_class)})

if __name__ == '__main__':
    app.run(debug=True)
