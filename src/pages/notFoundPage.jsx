import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/user");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-gray-800">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-4xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-lg mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>
      </div>

      <div className="mb-8">
        <img
          src="https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg"
          alt="Page not found illustration"
          className="w-80 h-auto mx-auto"
        />
      </div>

      <button
        onClick={goHome}
        className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-lg transition duration-300"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
