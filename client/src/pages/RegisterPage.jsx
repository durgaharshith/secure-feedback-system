import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        profilePic: null,
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        const { name, value, files } = e.target;
        if (name === 'profilePic') {
            setFormData(prev => ({ ...prev, profilePic: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('username', formData.username.trim());
            data.append('email', formData.email);
            data.append('password', formData.password);
            if (formData.profilePic) data.append('profilePic', formData.profilePic);

            await axiosPrivate.post('/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-200"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 text-sm p-3 rounded-lg text-center border border-red-300">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        value={formData.name}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        value={formData.username}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        value={formData.email}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <input
                        type="file"
                        name="profilePic"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition duration-300 ${
                        loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline font-medium">Login here</a>
                </p>
            </form>
        </div>
    );
}
