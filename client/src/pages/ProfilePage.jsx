import React, { useState, useEffect } from "react"
import { axiosPrivate } from "../api/axios"
import { useNavigate } from "react-router-dom"
import { IoClose } from 'react-icons/io5';
import { useSearchParams } from 'react-router-dom';
import EditProfileForm from "../components/EditProfileForm .jsx";


const FALLBACK_IMAGE = "/default-featured-image.jpg";


export default function ProfilePage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') || 'feedbacks';
    const [activateTab, setActivateTab] = useState(tabParam);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);
    const [modalImage, setModalImage] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', preferredCategories: [], profilePic: null });


    const tabConfig = {
        feedbacks: { title: "My Feedbacks", url: '/feedbacks/mine', dataKey: 'feedbacks' },
        comments: { title: "Comments", url: '/users/comments', dataKey: 'comments' },
        likes: { title: "Likes", url: '/users/likes', dataKey: 'likedFeedbacks' },
        bookmarks: { title: "Bookmarks", url: '/users/userbookmarks', dataKey: 'bookmarks' },
    }
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // const handleUpdateProfile = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const res = await axiosPrivate.put('/users/update', {
    //             name: user.name,
    //             email: user.email,
    //             preferredCategories: user.preferredCategories // optional
    //         });
    //         setUser(res.data.user);
    //         setShowEditModal(false);
    //     } catch (err) {
    //         console.error("Update failed", err);
    //     }
    // };

    const [toastEnabled, setToastEnabled] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("toastEnabled");
        setToastEnabled(stored !== "false"); // default to true
    }, []);

    const handleToggle = () => {
        const newValue = !toastEnabled;
        setToastEnabled(newValue);
        localStorage.setItem("toastEnabled", newValue.toString());
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosPrivate.get('/users/profile');
                setUser(res.data.user);
                setFormData({
                    name: res.data.user.name || '',
                    email: res.data.user.email || '',
                    preferredCategories: res.data.user.preferredCategories || [],
                    profilePic: null,
                });
            } catch (err) {
                console.error("Failed to fetch user profile", err);
                setError("Failed to load user profile.");
            }
        };
        fetchUser();
    }, []);


    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                const yOffset = -80; // adjust based on your header height
                const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }

        }
    }, []);

    useEffect(() => {
        setActivateTab(tabParam);
    }, [tabParam]);



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const { url, dataKey } = tabConfig[activateTab];
                const res = await axiosPrivate.get(url);

                setData(res.data[dataKey] || []);
            } catch (err) {
                console.error(err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activateTab]);
    

    const openModalWithImage = (url) => setModalImage(url);
    const closeModal = () => setModalImage(null);

    const handleTabChange = (key) => {
        setSearchParams({ tab: key });
    };

    const renderCard = (item) => {
        if (activateTab === "comments") {
            return (
                <div
                    key={item._id}
                    id={`comment-${item._id}`}
                    onClick={() => navigate(`/feedback/${item.feedback._id}#comment-${item._id}`)}
                    className="p-4 border rounded-md shadow-sm cursor-pointer hover:shadow-md transition"
                >
                    <p className="text-gray-700 dark:text-gray-300">{item.text}</p>
                    <small className="text-gray-500">{new Date(item.createdAt).toLocaleString()}</small>
                </div>
            );
        } else {
            return (
                <div
                    key={item._id}
                    onClick={() => navigate(`/feedback/${item._id}`)}
                    className="p-4 border rounded-md shadow-sm cursor-pointer hover:shadow-md transition"
                >
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{item.title || "Untitled Feedback"}</h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3">{item.message}</p>
                    {item.images && item.images.length > 0 && (
                        <div className="flex space-x-2 mt-2">
                            {item.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Feedback image ${idx + 1}`}
                                    className="w-10 h-10 object-cover rounded cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent navigating to feedback detail
                                        openModalWithImage(img);
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = FALLBACK_IMAGE;
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    <small className="text-gray-500">{new Date(item.createdAt).toLocaleString()}</small>
                </div>
            );
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen">
            {/* User info header can go here */}
            {user && (
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <img
                            src={user.profilePic || FALLBACK_IMAGE}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.username}</h2>
                            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={() => navigate('/preferences', { state: { selected: user.preferredCategories || [] } })}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Edit Preferences
                    </button>
                </div>
            )}

            

            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-2">Settings</h2>
                <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Enable Toast Notifications</span>
                <button
                    onClick={handleToggle}
                    className={`w-14 h-8 flex items-center rounded-full p-1 transition duration-300 ${
                    toastEnabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                >
                    <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                        toastEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                    ></div>
                </button>
                </div>
            </div>


            {/* Tabs */}
            <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
                {Object.entries(tabConfig).map(([key, { title }]) => (
                    <button
                        key={key}
                        onClick={() => handleTabChange(key)}
                        className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition ${activateTab === key
                                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                            }`}
                    >
                        {title}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : data.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No {tabConfig[activateTab].title.toLowerCase()} found.</p>
            ) : (
                <div className="grid gap-4">{data.map(renderCard)}</div>
            )}

            {modalImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                    className="relative max-w-5xl w-full px-6"
                    onClick={(e) => e.stopPropagation()}
                    >
                    <button
                        type="button"
                        onClick={closeModal}
                        className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center text-white bg-black bg-opacity-60 rounded-full hover:bg-opacity-90 z-[60]"
                    >
                        <IoClose size={20} />
                    </button>
                    <img
                        src={modalImage}
                        alt="Preview"
                        className="rounded-lg max-w-full max-h-[80vh] mx-auto object-contain"
                    />
                    </div>
                </div>
            )}

            {showEditModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                    onClick={() => setShowEditModal(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                            onClick={() => setShowEditModal(false)}
                        >
                            <IoClose size={20} />
                        </button>
                        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
                        <EditProfileForm user={user} setUser={setUser} onClose={() => setShowEditModal(false)}/>
                    </div>
                </div>
            )}
        </div>
    );
}