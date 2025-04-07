// import { useState } from "react";
// import { AlertTriangle, Maximize2, Minimize2 } from "lucide-react";
// import SecurityBlocker from "../SecurityBlocker";

// export default function PracticeInstructions() {
//   const [riskRatio, setRiskRatio] = useState(0);
//   const [testStarted, setTestStarted] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   const handleStartTest = () => {
//     setTestStarted(true);
//   };

//   const toggleFullScreen = () => {
//     setIsFullScreen(!isFullScreen);
//   };

//   return (
//     <div className="p-4 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-6xl mx-auto">
//       {!testStarted ? (
//         <>
//           <h2 className="text-2xl font-bold text-purple-400 mb-4">Practice Instructions</h2>
//           <p className="text-red-400">Beginning Risk Ratio: {riskRatio}</p>
//           <ul className="mt-4 space-y-2 text-lg text-purple-200">
//             <li>🔹 No tab switching (Risk Ratio increases if switched)</li>
//             <li>🔹 No copy-pasting allowed</li>
//             <li>🔹 No remote access (Detection will increase Risk Ratio)</li>
//             <li>🔹 No split screen usage</li>
//             <li>🔹 Certain browser extensions are blocked</li>
//             <li>🔹 Tab cannot be closed until submission</li>
//             <li>🔹 No screen recording or external sharing</li>
//             <li>🔹 Single-person detection only (No multiple people in view)</li>
//             <li>🔹 No electronic devices except the laptop</li>
//             <li>🔹 AI-generated content will be checked for plagiarism</li>
//             <li>🔹 The synchronized phone must have a wide-angle view of the participant</li>
//           </ul>
//           <button 
//             onClick={handleStartTest} 
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mt-6 w-full text-lg font-semibold"
//           >
//             Attempt Test
//           </button>
//         </>
//       ) : (
//         <>
//           <SecurityBlocker />
//           <div className={`flex flex-col ${isFullScreen ? "fixed inset-0 z-50 bg-gray-900 p-0 m-0" : "relative"}`}>
//             <div className="flex justify-between items-center bg-gray-800 p-2">
//               <div className="flex items-center text-red-400">
//                 <AlertTriangle className="mr-2" />
//                 <span>Warning: Any violations will increase your risk ratio!</span>
//               </div>
//               <button
//                 onClick={toggleFullScreen}
//                 className="text-purple-400 hover:text-purple-300 p-2 rounded"
//                 title={isFullScreen ? "Exit full screen" : "Enter full screen"}
//               >
//                 {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
//               </button>
//             </div>
            
//             <iframe 
//   src="http://localhost:5174/" 
//   title="Test Window"
//   className="w-full h-[80vh]"
//   allow="camera; microphone; fullscreen"
//   sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
// ></iframe>

//           </div>
//         </>
//       )}
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { AlertTriangle, Maximize2, Minimize2 } from "lucide-react";
import SecurityBlocker from "../SecurityBlocker";

export default function PracticeInstructions({ toggleSidebar }) {
  const [riskRatio, setRiskRatio] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleStartTest = () => {
    setTestStarted(true);
    toggleSidebar(false); // Hide sidebar when test starts
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      toggleSidebar(false); // Ensure sidebar stays hidden
    }
  };

  return (
    <div className={`p-4 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-6xl mx-auto ${isFullScreen ? "fixed inset-0 z-50 m-0 p-0" : ""}`}>
      {!testStarted ? (
        <>
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Practice Instructions</h2>
          <p className="text-red-400">Beginning Risk Ratio: {riskRatio}</p>
          <ul className="mt-4 space-y-2 text-lg text-purple-200">
            <li>🔹 No tab switching (Risk Ratio increases if switched)</li>
            <li>🔹 No copy-pasting allowed</li>
            <li>🔹 No remote access (Detection will increase Risk Ratio)</li>
            <li>🔹 No split screen usage</li>
            <li>🔹 Certain browser extensions are blocked</li>
            <li>🔹 Tab cannot be closed until submission</li>
            <li>🔹 No screen recording or external sharing</li>
            <li>🔹 Single-person detection only (No multiple people in view)</li>
            <li>🔹 No electronic devices except the laptop</li>
            <li>🔹 AI-generated content will be checked for plagiarism</li>
            <li>🔹 The synchronized phone must have a wide-angle view of the participant</li>
          </ul>
          <button 
            onClick={handleStartTest} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mt-6 w-full text-lg font-semibold"
          >
            Attempt Test
          </button>
        </>
      ) : (
        <>
          <SecurityBlocker />
          <div className={`flex flex-col ${isFullScreen ? "fixed inset-0 z-50 bg-gray-900 p-0 m-0" : "relative"}`}>
            <div className="flex justify-between items-center bg-gray-800 p-2">
              <div className="flex items-center text-red-400">
                <AlertTriangle className="mr-2" />
                <span>Warning: Any violations will increase your risk ratio!</span>
              </div>
              <button
                onClick={toggleFullScreen}
                className="text-purple-400 hover:text-purple-300 p-2 rounded"
                title={isFullScreen ? "Exit full screen" : "Enter full screen"}
              >
                {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
            
            <iframe 
              src="http://localhost:5174/" 
              title="Test Window"
              className="w-full h-screen"
              allow="camera; microphone; fullscreen"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
            ></iframe>

          </div>
        </>
      )}
    </div>
  );
}
