from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import json
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input # pyright: ignore[reportMissingImports]

app = Flask(__name__)

# Load model once at startup
# model = tf.keras.models.load_model("crop_disease_model_final.h5")
model = tf.keras.models.load_model("crop_model.keras")

# Load labels
with open("labels.json", "r") as f:
    labels = json.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]

    img = Image.open(file).resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    prediction = model.predict(img_array)

    class_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    return jsonify({
        "disease": labels[class_index],
        "confidence": round(confidence, 4)
    })

# if __name__ == "__main__":
#     app.run(port=6000, debug=True)
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 6000))
    app.run(host="0.0.0.0", port=port)