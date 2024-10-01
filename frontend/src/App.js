import React, { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");

  const downloadImage = async () => {
    try {
      const response = await axios.post("http://localhost:3001/download-random-image");
      setMessage(response.data.message);
      setImageUrl(response.data.imageUrl);
      setImageName(response.data.imageName);
    } catch (error) {
      setMessage("Failed to download image.");
    }
  };

  return (
    <div className="App">
      <h1>Image Downloader</h1>
      <button onClick={downloadImage}>Download Random Image</button>
      <h2>{imageName}</h2>
      <p>{message}</p>
      {imageUrl && <img src={imageUrl} alt="Random Image" />}
    </div>
  );
}

export default App;
