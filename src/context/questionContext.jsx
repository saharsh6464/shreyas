import React, { createContext, useState, useContext } from "react";
import { questionsData } from "../questionsdata";

const QuestionsContext = createContext();

export const QuestionsProvider = ({ children }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(questionsData[0] || null); // Set the first object as default
  const [currentCode, setCurrentCode] = useState(selectedQuestion ? selectedQuestion.code : ""); // Store current code
  const [results, setResults] = useState({});
  const [score, setScore] = useState({});
  const [id,setId] = useState(3);
  const [riskScore,setRiskScore] = useState(0);
  const [voice,setVoice] = useState("");
  
  const updateResults = (index1, userOutpu1, expectedOutput1) => {
    if(index1==-1) {
      setResults({});
    }
    const a = { case: index1, userOutput: userOutpu1, expectedOutput: expectedOutput1 }
    console.log(a);
    setResults((prevResults) => {
      const newResults = { ...prevResults };
      newResults[index1] = a;
      return newResults;
    });
  };
  
  
  const handleSelectQuestion = (questionId) => {
    const question = questionsData.find((q) => q.id === questionId);
    setSelectedQuestion(question);
    setCurrentCode(question ? question.code : ""); // Update current code when question changes
  };

  const appendScore = (a) => { 
    setScore(prevScore => {
        const newScore = { ...prevScore, [a.qu_id]: a };
        return newScore;
    });
    console.log(score);
  };

  const setRiskScoreData = (data) => {
    console.log("Risk Score:"+data);;
    let t=riskScore+data;
    setRiskScore(t);
    console.log("Risk Score:"+t);
  }

  const setVoiceData = (data) => {
    let t=voice+data;
    setVoice(t);
    console.log("Voice:"+t);
  }

  return (
    <QuestionsContext.Provider
      value={{
        results,
        setResults,
        updateResults,
        selectedQuestion,
        setSelectedQuestion,
        currentCode,
        setCurrentCode, // Expose function to update code
        questionsData,
        handleSelectQuestion, 
        appendScore,
        id
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  return useContext(QuestionsContext);
};
