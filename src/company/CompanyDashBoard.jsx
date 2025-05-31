import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from '../pages/Logout';
import Logoutcompany from './companyLogout';

const CompanyDashboard = () => {
  const navigate = useNavigate();

  const studentData = [
    { id: 1, name: 'Alice Johnson', riskRatio: 0.2, totalScore: 85, totalQuestions: 100 },
    { id: 2, name: 'Bob Smith', riskRatio: 0.5, totalScore: 70, totalQuestions: 100 },
    { id: 3, name: 'Charlie Brown', riskRatio: 0.8, totalScore: 50, totalQuestions: 100 },
    { id: 4, name: 'Diana Prince', riskRatio: 0.1, totalScore: 90, totalQuestions: 100 },
    { id: 5, name: 'Eve Adams', riskRatio: 0.6, totalScore: 65, totalQuestions: 100 },
    { id: 6, name: 'Frank White', riskRatio: 0.3, totalScore: 78, totalQuestions: 100 },
    { id: 7, name: 'Grace Lee', riskRatio: 0.7, totalScore: 58, totalQuestions: 100 },
    { id: 8, name: 'Henry Davis', riskRatio: 0.25, totalScore: 82, totalQuestions: 100 },
  ];

  const getRiskRatioColor = (riskRatio) => {
    if (riskRatio <= 0.3) {
      return 'bg-green-500';
    } else if (riskRatio <= 0.6) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  };

  return (
    // The outermost div now reliably covers the entire viewport
    <div className="
       text-white p-4 sm:p-6 md:p-10
      bg-gradient-to-b from-purple-900 to-pink-900
      md:bg-gradient-to-br md:from-indigo-900 md:to-blue-900
      lg:bg-gradient-to-br lg:from-purple-800 lg:via-indigo-900 lg:to-blue-950
    ">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 max-w-7xl mx-auto z-10 relative">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent leading-tight">
            SkillTrack Pro
          </h1>
          <p className="text-gray-300 mt-2 text-base sm:text-lg">Empowering Companies with Student Insights</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Logoutcompany />
        </div>
      </header>

      <main className="max-w-7xl mx-auto relative z-10">
        <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-6 md:p-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-violet-400 mb-6 border-b border-gray-700 pb-4">Student Performance Overview</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-white border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base font-semibold text-gray-200 rounded-tl-lg">ID</th>
                  <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base font-semibold text-gray-200">Student Name</th>
                  <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base font-semibold text-gray-200">Risk Ratio</th>
                  <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base font-semibold text-gray-200">Total Score</th>
                  <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base font-semibold text-gray-200 rounded-tr-lg">Questions Covered</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} border-b border-gray-600 last:border-b-0 hover:bg-gray-600 transition-colors duration-200`}
                  >
                    <td className="py-3 px-4 sm:px-6 text-sm sm:text-base text-gray-300">{student.id}</td>
                    <td className="py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-white">{student.name}</td>
                    <td className="py-3 px-4 sm:px-6 text-sm sm:text-base">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRiskRatioColor(student.riskRatio)} text-white`}>
                        {student.riskRatio.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-sm sm:text-base font-semibold text-blue-300">{student.totalScore}%</td>
                    <td className="py-3 px-4 sm:px-6 text-sm sm:text-base text-gray-300">{student.totalQuestions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate("/host-test")}
            className="flex-1 bg-violet-600 hover:bg-violet-700 transition-all duration-300 px-6 py-3 rounded-lg text-white font-semibold text-lg shadow-lg transform hover:scale-102 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75"
          >
            Create New Question Set
          </button>
          <button
            onClick={() => alert("View Detailed Reports coming soon!")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-6 py-3 rounded-lg text-white font-semibold text-lg shadow-lg transform hover:scale-102 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            View All Reports
          </button>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;