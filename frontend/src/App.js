import "./App.css";
import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictedDataset, setPredictedDataset] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);  // To store the image preview URL
  const [isModalOpen, setIsModalOpen] = useState(false);  // To control the modal visibility

  const classify = async (e) => {
    e.preventDefault();

    // Check if an image has been selected
    if (!image) {
      alert("Please select an image.");
      return;
    }

    const imgFormData = new FormData();
    imgFormData.append("image", image);

    try {
      const response = await fetch("http://127.0.0.1:5000/classify", {
        method: "POST",
        body: imgFormData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setPrediction(data.prediction);
        setPredictedDataset(data.class);
        setIsModalOpen(true); // Open the modal after prediction
      } else {
        throw new Error("err");
      }
    } catch (err) {
      console.error("err: ", err.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);  // Close the modal
  };

  // Set image preview URL when the user selects a file
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage && selectedImage.type.startsWith('image/')) {
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage)); // Generate a preview URL
    } else {
      alert("Please select a valid image file.");
    }

    // setImage(selectedImage);
    // setImagePreview(URL.createObjectURL(selectedImage)); // Generate a preview URL
  };

  const closeBins = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/close_bins", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Network error:", error.message);
    }
  };

  return (
    <div className="App">
      {/* Title - BinVision */}
      <h1 className="app-title">BinVision</h1>

      <form onSubmit={classify} className="image-form">
        <label className="image-label">Enter image:</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="image-input"
        />
        <input type="submit" className="submit-btn" />
      </form>

      {/* Modal for displaying the prediction results */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Prediction Result</h2>
            {/* Display uploaded image */}
            <div className="image-preview">
              <img src={imagePreview} alt="Uploaded" />
            </div>
            <p><strong>The image goes in:</strong> {prediction}</p>
            <p><strong>This image is classified as:</strong> {predictedDataset}</p>
            <button onClick={() => {closeModal(); closeBins();}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
