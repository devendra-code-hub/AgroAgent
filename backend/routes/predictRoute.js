const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const Prediction = require("../models/Prediction");

const router = express.Router();

// store uploaded file temporarily
const upload = multer({ dest: "uploads/" });

router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "http://localhost:6000/predict",
      formData,
      { headers: formData.getHeaders() }
    );

    // delete temp file
    fs.unlinkSync(req.file.path);

    // res.json(response.data);
    // Save to MongoDB
const savedPrediction = await Prediction.create({
  disease: response.data.disease,
  confidence: response.data.confidence,
  imageName: req.file.originalname
});

res.json(savedPrediction);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Prediction failed" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await Prediction.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;