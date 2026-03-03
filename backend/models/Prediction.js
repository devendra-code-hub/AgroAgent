const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  disease: String,
  confidence: Number,
  imageName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Prediction", predictionSchema);