"use client";

import { useState, useRef } from "react";

export default function Chatbot() {
  interface Message {
    sender: string;
    text: string;
  }

  const [messages, setMessages] = useState<Message[]>([]); // Store chat messages (text and voice)
  const [inputValue, setInputValue] = useState(""); // Store input value for text
  const [isRecording, setIsRecording] = useState(false); // Track if recording is active
  const [audioUrl, setAudioUrl] = useState(null); // Store the audio URL for playback
  const mediaRecorderRef = useRef(null); // MediaRecorder reference to manage recording
  const audioChunksRef = useRef([]); // Store the audio data

  // Handle sending text messages
  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = { sender: "user", text: inputValue };
    setMessages([...messages, userMessage]);

    // Send text message to backend (logic will be added later)

    setInputValue(""); // Clear input field
  };

  // Start recording audio
  const startRecording = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support audio recording.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url); // Save the audio for playback
          audioChunksRef.current = []; // Reset the chunks
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Render the chat interface
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-800 to-indigo-900">
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-4">
        <div className="w-full max-w-4xl p-6 bg-white/10 shadow-xl rounded-lg flex flex-col backdrop-blur-lg border border-gray-600">
          <h2 className="text-4xl font-semibold mb-6 text-center text-white">
            Police Assistant
          </h2>

          {/* Chat messages section */}
          <div className="flex-grow bg-gray-800/70 p-4 rounded-lg mb-4 overflow-y-auto max-h-[60vh] border border-gray-600">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center">
                Start the conversation...
              </p>
            ) : (
              <ul className="space-y-4">
                {messages.map((message, index) => (
                  <li
                    key={index}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.text ? (
                      <div
                        className={`p-3 rounded-lg shadow ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                            : "bg-gray-300 text-black"
                        }`}
                      >
                        {message.text}
                      </div>
                    ) : (
                      <audio
                        controls
                        src={audioUrl}
                        className="rounded-lg shadow bg-gray-300"
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Input and recording section */}
          <div className="flex space-x-3">
            <input
              type="text"
              className="flex-grow text-black p-3 border border-gray-400 rounded-lg"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()} // Send on Enter key
            />
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
              onClick={handleSend}
            >
              Send
            </button>
          </div>

          {/* Recording controls */}
          <div className="mt-4 flex space-x-3">
            <button
              className={`px-6 py-3 rounded-lg shadow-md text-white ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? "Stop Recording" : "Record Voice Note"}
            </button>

            {/* Play back the recorded voice note */}
            {audioUrl && (
              <audio
                controls
                src={audioUrl}
                className="rounded-lg shadow bg-gray-300"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
