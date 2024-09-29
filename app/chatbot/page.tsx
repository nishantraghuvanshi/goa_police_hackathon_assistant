"use client";
import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  // Define the interface for messages
  interface Message {
    sender: string;
    text: string;
    audio?: string;
  }

  // Language code mapping
  const languageCodes = {
    Kannada: "kn",
    Tamil: "ta",
    Telugu: "te",
    Malayalam: "ml",
    Bodo: "brx",
    English: "en",
    Meitei: "mni",
    Odia: "or",
    Marathi: "mr",
    Punjabi: "pa",
    Gujarati: "gu",
    Bengali: "bn",
    Hindi: "hi",
    Assamese: "as",
    Rajasthani: "raj",
  };

  const [messages, setMessages] = useState<Message[]>([]); // Store chat messages
  const [inputValue, setInputValue] = useState(""); // Store input value
  const [isRecording, setIsRecording] = useState(false); // Track if recording is active
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined); // Store the audio URL for playback
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // Store the selected language
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // MediaRecorder reference
  const audioChunksRef = useRef([]); // Store audio data

  // Ref for the last message element to scroll into view
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending text messages
  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = { sender: "user", text: inputValue };
    setMessages([...messages, userMessage]);

    // Send text message to backend and handle the response
    await sendMessageToBackend(userMessage.text);

    setInputValue(""); // Clear input field
  };

  // Scroll to the bottom when messages are updated
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url); // Save the audio for playback
          audioChunksRef.current = []; // Reset the chunks

          // Send audio blob to backend and handle the response
          await sendAudioToBackend(audioBlob);
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

  // Function to send audio to the backend
  const sendAudioToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("languageCode", languageCodes[selectedLanguage]); // Include language code

    try {
      const response = await fetch("http://localhost:5000/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send audio to the backend");
      }

      const data = await response.json();
      console.log("Audio successfully uploaded:", data);

      // Update the messages with the server response (transcription or status)
      const botMessage = {
        sender: "bot",
        text: data.transcription || "Audio received!",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      const audioBuffer = Buffer.from(data.audio, "base64"); // Decoding base64 to binary
      const blob = new Blob([audioBuffer], { type: "audio/wav" });

      // Create a URL for the Blob and play the audio
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  // Function to send a text message to the backend
  const sendMessageToBackend = async (messageText: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message to the backend");
      }

      const data = await response.json();
      console.log("Message successfully sent:", data);

      // Update the messages with the server response (text response from the model)
      const botMessage = {
        sender: "bot",
        text: data.response || "Message received!",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]); // Append the bot's response
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl p-6 bg-gray-800 shadow-xl rounded-lg flex flex-col border border-gray-700">
          <h2 className="text-3xl font-semibold mb-6 text-center text-white">
            Police Assistant
          </h2>

          {/* Language Selection Dropdown */}
          <div className="mb-4">
            <label htmlFor="language" className="text-white mb-2 block">
              Select Language:
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="p-2 bg-gray-700 border border-gray-600 text-white rounded-lg"
            >
              {Object.keys(languageCodes).map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          {/* Chat messages section */}
          <div className="flex-grow bg-gray-700 p-4 rounded-lg mb-4 overflow-y-auto max-h-[60vh] border border-gray-600">
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
                    {message.sender === "bot" ? (
                      <div
                        className={`p-4 rounded-lg shadow-lg ${
                          message.text.includes("Error")
                            ? "bg-red-500 text-white"
                            : "bg-gray-500 text-white"
                        } max-w-md w-full`}
                      >
                        <div className="font-semibold text-lg">Bot:</div>
                        <div className="mt-1 text-sm">
                          <span className="text-white font-semibold">
                            {message.text}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`p-3 rounded-lg shadow-sm ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {message.text}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input and recording section */}
          <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-4">
            <div className="flex items-center space-x-3 max-w-4xl mx-auto">
              <input
                type="text"
                className="flex-grow text-white p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />

              <button
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                onClick={handleSend}
              >
                Send
              </button>

              {isRecording ? (
                <button
                  className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-500"
                  onClick={stopRecording}
                >
                  Stop
                </button>
              ) : (
                <button
                  className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-500"
                  onClick={startRecording}
                >
                  Record
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}