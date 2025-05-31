import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { questionsData } from "../questionsdata"; // Assuming your questionsData is imported from here
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs
import { ref, set, getDatabase } from "firebase/database"; // Firebase Realtime Database methods
import { useAuth } from '../AuthContext'; // Import AuthContext to get current user

// Helper to determine difficulty color
const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'hard':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const SidebarSelectQuestion = () => {
  // Using Tailwind's responsive approach, initial panelWidth might not be strictly needed for styling,
  // but it's kept for the resize functionality.
  const [panelWidth, setPanelWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false); // New state to track resizing
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSolveClick1 = (questionId) => {
    // No need to call handleSelectQuestion here if it's already selected
    navigate(`/solve/${questionId}`);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const newWidth = Math.max(200, e.clientX); // Minimum width is 200px
    setPanelWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add and remove event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleSelectQuestion = (question) => {
    if (!selectedQuestions.some((q) => q.id === question.id)) {
      setSelectedQuestions((prev) => [...prev, question]);
      
      // Optional: Add a subtle confirmation for the user, like a temporary visual highlight
    }
  };

  const handleRemoveQuestion = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.filter((question) => question.id !== questionId)
    );
  };

  const handleConfirmSelection = async () => {
    if (!currentUser) {
      alert("User not authenticated. Please log in to save your selection.");
      // Redirect to login if user is not authenticated
      return;
    }

    if (selectedQuestions.length === 0) {
      alert("Please select at least one question to confirm.");
      return;
    }

    try {
      const db = getDatabase();
      // Using Promise.all to wait for all set operations to complete
      await Promise.all(selectedQuestions.map(async (question) => {
        const uniqueQuestionId = uuidv4(); // Generate a unique ID for each question instance
        const questionRef = ref(db, `users/${currentUser.uid}/selectedQuestions/${uniqueQuestionId}`);

        await set(questionRef, {
          id: question.id,
          title: question.title,
          difficulty: question.difficulty,
          complexity: question.complexity, // Include complexity if it's in questionsData
          // You might want to add a timestamp or status here too
          selectedAt: new Date().toISOString(),
        });
        console.log("Question saved to Realtime Database:", question.title);
      }));

      alert("Selected questions confirmed and saved successfully!");
      navigate("/company-dashboard"); 
      // Optionally, clear selected questions after confirmation if desired
      // setSelectedQuestions([]); 
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("There was an error saving your questions. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar displaying selected questions */}
      <motion.div
        initial={{ x: -panelWidth }} // Initial position off-screen
        animate={{ x: 0 }} // Animate to on-screen
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ width: panelWidth }} // Apply dynamic width
        className="relative flex-shrink-0 bg-gray-800 border-r border-gray-700 overflow-y-auto p-4 md:p-6 shadow-xl"
      >
        <h3 className="text-xl md:text-2xl font-extrabold mb-6 text-indigo-400">
          Your Selected Questions
        </h3>
        <hr className="border-gray-700 mb-6" />

        {selectedQuestions.length > 0 ? (
          <div className="space-y-4">
            {selectedQuestions.map((question) => (
              <div
                key={question.id} // Use question.id for key as it's stable, not uniqueId
                className="bg-gray-700 text-white p-4 rounded-lg shadow-md border border-gray-600 hover:border-indigo-500 transition-all duration-200"
              >
                <h4 className="font-semibold text-lg md:text-xl text-indigo-200 mb-1">{question.title}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)} text-white`}>
                    {question.difficulty}
                  </span>
                  {question.complexity && (
                    <span>
                      Time: {question.complexity.time} | Space: {question.complexity.space}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => handleRemoveQuestion(question.id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleSolveClick1(question.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-200 text-sm font-medium"
                  >
                    Attempt
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8 border border-dashed border-gray-700 rounded-lg">
            <p className="mb-2">No questions selected yet.</p>
            <p className="text-sm">Select questions from the right panel to add them here.</p>
          </div>
        )}

        {/* Sidebar resize handle */}
        <div
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize bg-gray-600 hover:bg-indigo-500 transition-colors duration-200"
          onMouseDown={handleMouseDown}
        ></div>
      </motion.div>

      {/* Main content area displaying all questions */}
      <div
        className="flex-1 p-4 md:p-8 overflow-y-auto"
        style={{
          backgroundImage: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        }}
      >
        <h3 className="text-2xl md:text-3xl font-extrabold mb-8 text-white text-center">
          Available Coding Challenges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {questionsData.map((question) => (
            <div
              key={question.id}
              className="bg-gray-800 text-white p-6 rounded-lg shadow-xl cursor-pointer
                         transform hover:scale-102 hover:shadow-2xl transition-all duration-300
                         flex flex-col justify-between border border-gray-700"
            >
              <div>
                <h4 className="font-bold text-xl mb-2 text-blue-300">{question.title}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)} text-white`}>
                    {question.difficulty}
                  </span>
                  {question.complexity && (
                    <span>
                      Time: {question.complexity.time} | Space: {question.complexity.space}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleSelectQuestion(question)}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-all duration-200
                            ${selectedQuestions.some((q) => q.id === question.id)
                              ? "bg-gray-500 cursor-not-allowed" // Already selected style
                              : "bg-blue-600 hover:bg-blue-700"
                            }`}
                disabled={selectedQuestions.some((q) => q.id === question.id)}
              >
                {selectedQuestions.some((q) => q.id === question.id) ? "Selected" : "Select Question"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Button fixed at the bottom-right */}
      <div
        className="fixed bottom-6 right-6 z-10" // Use fixed positioning with z-index
      >
        <button
          onClick={handleConfirmSelection}
          className="bg-purple-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-purple-700
                     transform hover:scale-105 transition-all duration-300 font-bold text-lg
                     disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedQuestions.length === 0} // Disable if no questions are selected
        >
          Confirm Selection ({selectedQuestions.length})
        </button>
      </div>
    </div>
  );
};

export default SidebarSelectQuestion;