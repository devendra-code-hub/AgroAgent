import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch prediction history when page loads
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/predict",
        formData
      );

      setResult(res.data);

      // Refresh history after new prediction
      fetchHistory();

    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🌿 AgroAgents - Crop Disease Detection</h1>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        {loading ? "Analyzing..." : "Predict"}
      </button>

      {/* Prediction Result */}
      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>Prediction Result</h2>
          <p><strong>Disease:</strong> {result.disease}</p>
          <p>
            <strong>Confidence:</strong>{" "}
            {(result.confidence * 100).toFixed(2)}%
          </p>
        </div>
      )}

      {/* Prediction History */}
      {history.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <h2>Prediction History</h2>

          {history.map((item, index) => (
            <div
              key={index}
              style={{
                margin: "10px auto",
                padding: "10px",
                width: "60%",
                border: "1px solid gray",
                borderRadius: "8px"
              }}
            >
              <p><strong>Image:</strong> {item.imageName}</p>
              <p><strong>Disease:</strong> {item.disease}</p>
              <p>
                <strong>Confidence:</strong>{" "}
                {(item.confidence * 100).toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;