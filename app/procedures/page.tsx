"use client";
import { useState } from "react";

const procedures = [
  {
    title: "Lost Item",
    questions: [
      "Describe the item that was lost.",
      "When and where was the item last seen?",
      "Does the item contain any sensitive personal information? If yes, what?",
    ],
  },
  {
    title: "Theft",
    questions: [
      "Where and when did the theft happen?",
      "Description of the assailants.",
      "Description of any vehicles that the assailants used.",
      "Description of the items stolen.",
      "Have you or anyone with you suffered any injuries?",
    ],
  },
  {
    title: "Minor Accident",
    questions: [
      "Where and when did the accident happen?",
      "Have you or anyone with you suffered any injuries?",
      "Description of your vehicle and that of the other vehicle(s).",
      "Were any pedestrians involved? If so, their details.",
    ],
  },
  {
    title: "Missing Person",
    questions: [
      "Details of the person missing.",
      "When and where did you last see/hear from the person?",
      "Phone no of the missing person.",
    ],
  },
  {
    title: "Police Clearance Certificate",
    questions: [
      "What is your address?",
      "Since when have you been residing at this address?",
      "Is it a rented accommodation? If so, details of landlord.",
      "Who are living with you at your house?",
      "What is your occupation and where do you work? Details of owner.",
      "What is the purpose of seeking police verification?",
    ],
  },
];

type Procedure = {
  title: string;
  questions: string[];
};

export default function Procedures() {
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
    null
  );
  const [formData, setFormData] = useState({});
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const handleProcedureSelect = (procedure: {
    title: string;
    questions: string[];
  }) => {
    setSelectedProcedure(procedure);
    setFormData({}); // Reset form data when selecting a new procedure
    setName(""); // Reset name
    setContact(""); // Reset contact
  };

  interface FormData {
    [key: string]: string;
  }

  const handleInputChange = (question: string, value: string) => {
    setFormData((prevFormData: FormData) => ({
      ...prevFormData,
      [question]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send to the backend
    const dataToSend = {
      procedure: selectedProcedure?.title,
      name,
      contact,
      details: formData,
    };

    try {
      const response = await fetch("/api/submit-procedure", {
        // Update with your backend endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        // Handle successful response
        console.log("Data submitted successfully");
      } else {
        // Handle error response
        console.error("Error submitting data");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-black text-center">
          Police Procedures
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {procedures.map((procedure, index) => (
            <div
              key={index}
              className="bg-black p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => handleProcedureSelect(procedure)}
            >
              <h3 className="text-2xl font-semibold mb-4 text-white">
                {procedure.title}
              </h3>
            </div>
          ))}
        </div>

        {selectedProcedure && (
          <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-3xl font-bold mb-6 text-black">
              {selectedProcedure.title} Details
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  className="border rounded-lg p-2 w-full text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Your Contact Number
                </label>
                <input
                  type="tel"
                  className="border rounded-lg p-2 w-full text-black"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
              {selectedProcedure.questions.map((question, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    {question}
                  </label>
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-full text-black"
                    onChange={(e) =>
                      handleInputChange(question, e.target.value)
                    }
                    required
                  />
                </div>
              ))}
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
