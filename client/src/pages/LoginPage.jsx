// src/pages/LoginPage.jsx
import { useState } from "react";
import instance from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { showToast } from "../utils/toastHelper";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await instance.post('/auth/login', { username, password }, { withCredentials: true });

      const accessToken = res.data?.accessToken;
      const user = res.data?.user;

      if (!accessToken || !user) throw new Error('Invalid login response');
      login(user, accessToken);

      if (!user.preferredCategories || user.preferredCategories.length === 0) {
        navigate('/preferences');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.log('Login error:', err.response?.data?.message || err.message);
      showToast('error', err.response?.data?.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-indigo-700 text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Email or Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 placeholder-gray-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 placeholder-gray-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
}
