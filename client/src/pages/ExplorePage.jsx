import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { IoClose } from 'react-icons/io5';
import { ArrowUp } from "lucide-react";
import FeedbackFilter from "../components/FeedbackFilter";
import { FaRegBookmark, FaRegCommentDots, FaRegHeart, FaHeart, FaBookmark } from "react-icons/fa";
import useAuth from "../hooks/useAuth";



const ExplorePage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [likes, setLikes] = useState({});
    const [bookmarks, setBookmarks] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [userBookmarks, setUserBookmarks] = useState([]);
    const {auth} = useAuth();
    const currentUser = auth?.user;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchExploreFeedbacks = async () => {
            setLoading(true);
            try {
                const res = await axiosPrivate.get(`/feedbacks/explore?page=${page}&limit=6`);
                setFeedbacks(res.data.feedbacks);
                setPagination(res.data.pagination || {});
                setError(null);
            } catch (err) {
                console.error("Explore fetch error:", err);
                setError("Failed to load explore feedbacks.");
            } finally {
                setLoading(false);
            }
        };
        fetchExploreFeedbacks();
    }, [page]);

    useEffect(() => {
    if (feedbacks.length > 0 && userBookmarks.length > 0) {
        const likeStates = {};
        const likeCounts = {};
        const bookmarkStates = {};
        feedbacks.forEach(fb => {
            likeStates[fb._id] = fb.likes?.includes(currentUser?._id);
            likeCounts[fb._id] = fb.likes?.length || 0;
            bookmarkStates[fb._id] = userBookmarks.includes(fb._id);
        });
        setLikes(likeStates);
        setLikeCounts(likeCounts);
        setBookmarks(bookmarkStates);
    }
}, [feedbacks, userBookmarks]);


    useEffect(() => {
        const fetchUserBookmarks = async () => {
            try {
            const res = await axiosPrivate.get("/users/profile");
            setUserBookmarks(res.data.user.bookmarks || []);
            } catch (err) {
            console.error("Failed to fetch user bookmarks:", err);
            }
        };

        fetchUserBookmarks();
    }, []);


    const toggleLike = async (id) => {
        try {
            const res = await axiosPrivate.post(`/feedbacks/${id}/like`);
            const liked = !likes[id];
            setLikes(prev => ({ ...prev, [id]: liked }));
            setLikeCounts(prev => ({
                ...prev,
                [id]: liked ? prev[id] + 1 : prev[id] - 1,
            }));
        } catch (err) {
            console.error("Error liking feedback:", err);
        }
    };

    const toggleBookmark = async (id) => {
        try {
            const res = await axiosPrivate.post(`/users/${id}/bookmark`);
            const updatedBookmarks = res.data.userBookmarks || [];
            setUserBookmarks(updatedBookmarks);
            setBookmarks((prev) => ({
                ...prev,
                [id]: updatedBookmarks.includes(id),
            }));
        } catch (err) {
            console.error("Error bookmarking feedback:", err);
        }
    };





    if (loading) {
        return <div className="p-6 text-center text-lg text-gray-600 dark:text-gray-300">Loading Explore Feedbacks...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="px-4 py-6 max-w-6xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Explore Feedbacks</h1>
                <button
                    type="button"
                    onClick={() => navigate("/createfeedback")}
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition-all"
                >
                    + Add Feedback
                </button>
            </div>

            {feedbacks.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-12">No Feedbacks Found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedbacks.map((fb) => {
                        const userLiked = likes[fb._id] ?? fb.isLiked;
                        const bookmarked = userBookmarks.includes(fb._id);


                        return (
                            <div
                                key={fb._id}
                                onClick={() => navigate(`/feedback/${fb._id}`)}
                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition rounded-2xl p-5 cursor-pointer flex flex-col"
                                style={{ minHeight: '360px' }}
                            >
                                {/* User Info */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                fb.user?.profilePic?.startsWith("http")
                                                    ? fb.user.profilePic
                                                    : `/uploads/${fb.user?.profilePic || "default.png"}`
                                            }
                                            alt="User"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {fb.user?.username || "Anonymous"}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(fb.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>

                                {/* Title + Message + Images */}
                                <div className="flex-grow">
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">{fb.title}</h2>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">{fb.message}</p>

                                    {fb.images?.length > 0 && (
                                        <div className="flex gap-3 mt-2">
                                            {fb.images.slice(0, 2).map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img.startsWith("http") ? img : `/uploads/${img}`}
                                                    alt={`Img ${idx}`}
                                                    className="rounded-lg w-28 h-28 object-cover border border-gray-300 dark:border-gray-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewImage(img.startsWith("http") ? img : `/uploads/${img}`);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Icons Row at Bottom */}
                                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-around text-gray-500 dark:text-gray-400 text-sm">
                                    {/* Like */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(fb._id);
                                        }}
                                        className="flex items-center gap-1 group"
                                        title="Like"
                                    >
                                        {likes[fb._id] ? (
                                            <FaHeart className="text-red-500 text-base transition group-hover:scale-110" />
                                        ) : (
                                            <FaRegHeart className="text-gray-400 text-base transition group-hover:scale-110" />
                                        )}
                                        <span>{likeCounts[fb._id] ?? fb.likes?.length ?? 0}</span>
                                    </button>

                                    {/* Comments */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/feedback/${fb._id}`);
                                        }}
                                        className="flex items-center gap-1 hover:text-blue-500"
                                        title="Comments"
                                    >
                                        <FaRegCommentDots />
                                        <span>{fb.commentsCount || 0}</span>
                                    </button>

                                    {/* Bookmark */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleBookmark(fb._id);
                                        }}
                                        className="flex items-center gap-1 group"
                                        title="Bookmark"
                                    >
                                        {bookmarks[fb._id] ? (
                                            <FaBookmark className="text-yellow-500 text-base" />
                                        ) : (
                                            <FaRegBookmark className="text-gray-400 text-base" />
                                        )}
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2 flex-wrap">
                    <button
                        disabled={!pagination.hasPrevPage}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            pagination.hasPrevPage
                                ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Previous
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrent = pageNum === pagination.currentPage;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                    isCurrent
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPage((prev) => prev + 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            pagination.hasNextPage
                                ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Back to Top Button */}
            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
                title="Back to Top"
            >
                <ArrowUp size={20} />
            </button>

            {/* Preview Image Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-5xl w-full px-6" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center text-white bg-black bg-opacity-60 rounded-full hover:bg-opacity-90 z-[60]"
                        >
                            <IoClose size={20} />
                        </button>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="rounded-lg max-w-full max-h-[80vh] mx-auto object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
