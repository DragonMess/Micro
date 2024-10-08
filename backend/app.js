const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const Prometheus = require("prom-client");
const register = new Prometheus.Registry();
register.setDefaultLabels({
  app: "download-random-image_app"
});
Prometheus.collectDefaultMetrics({ register });

const http_request_counter = new Prometheus.Counter({
  name: "myapp_http_request_count",
  help: "Count of HTTP requests made to my app",
  labelNames: ["method", "route", "statusCode"]
});
register.registerMetric(http_request_counter);

const cors = require("cors");
const axios = require("axios");
const { Pool } = require("pg");
const app = express();

app.use(cors());

// create dynamic connection -pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "postgres",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
});

const url = "https://place.dog";

app.use(function (req, res, next) {
  // Increment the HTTP request counter
  http_request_counter
    .labels({ method: req.method, route: req.originalUrl, statusCode: res.statusCode })
    .inc();

  next();
});

app.get("/metrics", function (req, res) {
  res.setHeader("Content-Type", register.contentType);

  register.metrics().then((data) => res.status(200).send(data));
});

app.get("/", (req, res) => {
  res.json([
    {
      Actors: [
        {
          name: "Tom Cruise",
          age: 62,
          "Born At": "Syracuse, NY",
          Birthdate: "July 3, 1962",
          photo: "https://jsonformatter.org/img/tom-cruise.jpg",
          wife: null,
          weight: 67.5,
          hasChildren: true,
          hasGreyHair: false,
          children: ["Suri", "Isabella Jane", "Connor"]
        },
        {
          name: "Robert Downey Jr.",
          age: 59,
          "Born At": "New York City, NY",
          Birthdate: "April 4, 1965",
          photo: "https://jsonformatter.org/img/Robert-Downey-Jr.jpg",
          wife: "Susan Downey",
          weight: 77.1,
          hasChildren: true,
          hasGreyHair: false,
          children: ["Indio Falconer", "Avri Roel", "Exton Elias"]
        }
      ]
    }
  ]);
});

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

app.listen(3001, () => {
  console.log(`Backend running on port 3001`);
});
