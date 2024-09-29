const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Express app
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

// PaLM API Key (replace with your key)
const API_KEY = "AIzaSyBYFQFDRboSL-9zzIF37ftCIEzvKh34oGA";

// ChatPDF API Key (replace with your key)
const CHATPDF_API_KEY = "sec_eepONxpA9ckDQlFvSB3MrcnkMngzKBB9";

const sourceId = "src_sIQLI7XdMlOCNpeMPg0c6";

const sourceId1="src_QxeyWHeItNqFuMtLGnmAE";

// Route to handle audio uploads
app.post("/api/upload-audio", upload.single("audio"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No audio file uploaded");
  }

  // Handle file processing (e.g., transcribing or saving to disk)
  console.log("Audio file uploaded:", file);

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
    let response = result.response.text();

    // Remove asterisks from the response
    response = response.replace(/\*/g, "");

    // Send Gemini's response back to the frontend
    res.json({ response: response });
  } catch (error) {
    console.error("Error with PaLM API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

// Route to upload a PDF to ChatPDF
// app.post("/api/upload-pdf", upload.single("pdf"), async (req, res) => {
//   const file = req.file;

//   if (!file) {
//     return res.status(400).send("No PDF file uploaded");
//   }

//   try {
//     const formData = new FormData();
//     formData.append("file", fs.createReadStream(file.path));

//     const options = {
//       headers: {
//         "x-api-key": CHATPDF_API_KEY,
//         ...formData.getHeaders(),
//       },
//     };

//     // Upload PDF to ChatPDF
//     const response = await axios.post("https://api.chatpdf.com/v1/sources/add-file", formData, options);

//     // Extract sourceId from the response
//     const sourceId = response.data.sourceId;

//     // Send back the sourceId to frontend for later use
//     console.log("Source ID:", sourceId);
//     res.json({ sourceId });
//   } catch (error) {
//     console.error("Error uploading PDF to ChatPDF:", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to upload PDF to ChatPDF" });
//   }
// });

// Route to chat with PDF using the sourceId
app.post("/api/chat-with-pdf", async (req, res) => {
  const { question } = req.body;

  if ( !question) {
    return res.status(400).json({ error: "Missing sourceId or question" });
  }

  try {
    const data = {
      sourceId: sourceId1,
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    };

    const options = {
      headers: {
        "x-api-key": CHATPDF_API_KEY,
        "Content-Type": "application/json",
      },
    };

    // Make request to ChatPDF to ask a question about the PDF
    const response = await axios.post("https://api.chatpdf.com/v1/chats/message", data, options);

    // Send back ChatPDF's response content to the frontend
    const chatResponse = response.data.content;
    res.json({ response: chatResponse });
  } catch (error) {
    console.error("Error with ChatPDF API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to chat with PDF" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
