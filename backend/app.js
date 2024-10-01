const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Pool } = require("pg");
const app = express();

//Define coors option to resource sharing
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));

// create dynamic connection -pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "postgres",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
});

const url = "https://place.dog";

app.post("/download-random-image", async (req, res) => {
  try {
    const width = Math.floor(Math.random() * 100) + 200;
    const height = Math.floor(Math.random() * 100) + 200;
    const imageUrl = `${url}/${width}/${height}`;
    const imageName = `image-${width}x${height}.jpg`;

    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "arraybuffer"
    });

    const imageData = response.data;

    const query = "INSERT INTO images (image_name, image_data) VALUES ($1, $2)";
    await pool.query(query, [imageName, imageData]);

    res.status(200).json({ message: "Image downloaded and saved!", imageUrl, imageName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error downloading or saving image." });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Backend running on port ${port}`);
});
