const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");


// Initialize Express app
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

// Your PaLM API Key from Google Cloud
const API_KEY = "AIzaSyBYFQFDRboSL-9zzIF37ftCIEzvKh34oGA"; // Replace with your actual API key

// Correct PaLM API endpoint for text-bison model (text generation)
const PALM_API_URL = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${API_KEY}`;

// Route to handle audio uploads
app.post("/api/upload-audio", upload.single("audio"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No audio file uploaded");
  }

  // Handle file processing (e.g., transcribing or saving to disk)
  console.log("Audio file uploaded:", file);

  // Respond back with the transcription or status
  res.json({ transcription: "Your audio has been received!" });
});

// Route to send text to PaLM API and get response from Gemini
app.post("/api/send-message", async (req, res) => {
  const text = req.body.message;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


    const result = await model.generateContent(text);
    const response = result.response.text();


    // Send Gemini's response back to the frontend
    res.json({ response: response });
  } catch (error) {
    console.error("Error with PaLM API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
