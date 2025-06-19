// src/pages/PublicHomePage.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PublicHomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">FeedbackHub</h1>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-indigo-600 hover:underline" aria-label="Login to your account">Login</Link>
            <Link to="/register" className="text-purple-600 hover:underline" aria-label="Register a new account">Register</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center relative">
        {/* Optional Background Image */}
        <img
          src="https://t3.ftcdn.net/jpg/01/36/42/52/360_F_136425289_3RulL8uFjwdmM1qm6MKJEYM07QAzxeAq.jpg"
          alt="Illustration representing anonymous user feedback"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0"
        />


        <div className="max-w-xl z-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4"
          >
            Share. Explore. Empower.
          </motion.h2>
          <p className="text-lg text-gray-700 mb-6">
            Share your feedback securely, explore community opinions, and help shape better experiences.
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <Link
              to="/login"
              className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-full bg-white text-indigo-600 border border-indigo-400 font-semibold hover:bg-indigo-50 transition"
            >
              Register
            </Link>
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <p>🔒 Anonymous & encrypted feedback</p>
            <p>🧠 AI-powered moderation</p>
            <p>⚙️ Built with React, Node.js, and Tailwind CSS</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 bg-white shadow-inner text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FeedbackHub. Built for secure expression and community growth.
      </footer>
    </div>
  );
};

export default PublicHomePage;
