// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Questions from "./mainquestions/questions";
// import ResizableLayout from "./componenets/Layout/ResizableLayout";
// import { QuestionsProvider } from "./context/questionContext";
// import TopBar1 from "./DashBoard/TopBar1";
// import SideBar from "./DashBoard/SideBar";
// import Dashboard from "./pages/Dashboard";
// import PracticeTests from "./pages/PracticeTests";
// import MockExams from "./pages/MockExams";
// import ReferAndRule from "./pages/ReferAndRule";
// import HowToUse from "./pages/HowToUse";
// import Settings from "./pages/Settings";
// import { useState } from "react";

// // import "./App.css"; // Import your CSS file for styling
// // import "./componenets/Layout/TopPanel.css"; // Import your CSS file for styling
// // import "./componenets/Layout/BottomPanel.css"; // Import your CSS file for styling
// function App() {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };
//   return (
//     // <Router>
//     //   <TopBar />
//     //   <QuestionsProvider>
//     //     <Routes>
//     //       {/* <Route path="/" element={<Questions />} /> */}
//     //       {/* <Route path="/solve/:questionId" element={<ResizableLayout />} /> */}
//     //       <Route path="/home" element = {<SideBar/>}/>
//     //     </Routes>
//     //   </QuestionsProvider>
//     // </Router>
//     <Router>
//       <div className="flex h-screen bg-darkBg">
//         {/* Sidebar remains fixed */}
//         <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

//         {/* Main content area */}
//         <div className="flex-1 flex flex-col min-h-screen">
//         <QuestionsProvider>
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/" element={<PracticeTests />} />
//             <Route path="/mock-exams" element={<MockExams />} />
//             <Route path="/refer-and-rule" element={<ReferAndRule />} />
//               <Route path="/q" element={<Questions />} />

//             <Route path="/how-to-use" element={<HowToUse />} />
//             <Route path="/settings" element={<Settings />} />
//              <Route path="/solve/:questionId" element={<ResizableLayout />} />
//           </Routes>
//           </QuestionsProvider>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

// FINAL CODE AS OF ROUND 2

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Questions from "./mainquestions/questions";
import ResizableLayout from "./componenets/Layout/ResizableLayout";
import { QuestionsProvider } from "./context/questionContext";
import TopBar1 from "./DashBoard/TopBar1";
import SideBar from "./DashBoard/SideBar";
import Dashboard from "./pages/Dashboard";
import PracticeTests from "./pages/PracticeTests";
import MockExams from "./pages/MockExams";
import ReferAndRule from "./pages/ReferAndRule";
import HowToUse from "./pages/HowToUse";
import Settings from "./pages/Settings";
import PracticeInstructions from "./pages/PracticeInstructions";
import FrontPage from "./Parts/FrontPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import WebcamCapture from "./backend/WebCamCapture";
function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation(); // Get current path

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-darkBg">
      {/* Sidebar remains fixed */}
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Apply margin-left ONLY when on /practice-tests */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          location.pathname === "/practice-tests" ? (isSidebarOpen ? "ml-64" : "ml-16") : ""
        }`}
      >
        {/* Hide TopBar1 when on /practice-tests */}
        {location.pathname !== "/practice-tests" && <TopBar1 />}

        <QuestionsProvider>
  <Routes>
    <Route path="/" element={<FrontPage />} /> {/* Set FrontPage as the landing page */}
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/practice-tests" element={<PracticeInstructions />} />
    <Route path="/mock-exams" element={<MockExams />} />
    <Route path="/refer-and-rule" element={<ReferAndRule />} />
    <Route path="/how-to-use" element={<HowToUse />} />
    <Route path="/settings" element={<Settings />} />
    {/* <Route path="/webcam" element={<SettingWebcamCaptures />} /> */}
    <Route path="/solve/:questionId" element={<ResizableLayout />} />

  </Routes>
</QuestionsProvider>

        
      </div>
    </div>
  );
}

// Wrap App with Router to use useLocation inside
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}


//MAIN
{/* <QuestionsProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/practice-tests" element={<PracticeInstructions />} />
            <Route path="/mock-exams" element={<MockExams />} />
            <Route path="/refer-and-rule" element={<ReferAndRule />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/solve/:questionId" element={<ResizableLayout />} />
          </Routes>
        </QuestionsProvider> */}

// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import Questions from "./mainquestions/questions";
// import ResizableLayout from "./componenets/Layout/ResizableLayout";
// import { QuestionsProvider } from "./context/questionContext";
// import TopBar1 from "./DashBoard/TopBar1";
// import SideBar from "./DashBoard/SideBar";
// import Dashboard from "./pages/Dashboard";
// import PracticeTests from "./pages/PracticeTests";
// import MockExams from "./pages/MockExams";
// import ReferAndRule from "./pages/ReferAndRule";
// import HowToUse from "./pages/HowToUse";
// import Settings from "./pages/Settings";
// import PracticeInstructions from "./pages/PracticeInstructions";

// function App() {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation(); // Get current path

//   const toggleSidebar = (state) => {
//     setSidebarOpen(state);
//   };

//   return (
//     <div className="flex h-screen bg-darkBg">
//       {/* Sidebar remains fixed */}
//       <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

//       {/* Apply margin-left ONLY when on /practice-tests */}
//       <div
//         className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
//           location.pathname === "/practice-tests" ? "ml-0" : isSidebarOpen ? "ml-64" : "ml-16"
//         }`}
//       >
//         {/* Hide TopBar1 when on /practice-tests */}
//         {location.pathname !== "/practice-tests" && <TopBar1 />}

//         <QuestionsProvider>
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/practice-tests" element={<PracticeInstructions toggleSidebar={toggleSidebar} />} />
//             <Route path="/mock-exams" element={<MockExams />} />
//             <Route path="/refer-and-rule" element={<ReferAndRule />} />
//             <Route path="/how-to-use" element={<HowToUse />} />
//             <Route path="/settings" element={<Settings />} />
//             <Route path="/solve/:questionId" element={<ResizableLayout />} />
//           </Routes>
//         </QuestionsProvider>
//       </div>
//     </div>
//   );
// }

// // Wrap App with Router to use useLocation inside
// export default function WrappedApp() {
//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// }
