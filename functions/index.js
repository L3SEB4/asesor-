/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import fetch from "node-fetch";
import { onRequest } from "firebase-functions/v2/https";

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const chatWithAI = onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: "No message provided" });
    return;
  }

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=AIzaSyAQCQW1EPv9JTZtjHcqhLjIH4cxPaLaESc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });
    const data = await response.json();
    let aiReply;
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
      aiReply = data.candidates[0].content.parts[0].text;
    } else {
      aiReply = 'Gemini JSON: ' + JSON.stringify(data);
    }
    res.json({ reply: aiReply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
