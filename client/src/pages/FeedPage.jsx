import React, { useEffect, useState } from "react";
import axiosPrivate from "../api/axios";
import { FaHeart, FaRegBookmark, FaRegCommentDots, FaRegHeart, FaBookmark } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { IoClose } from 'react-icons/io5';
import { ArrowUp } from "lucide-react";
import SearchBar from "../components/SearchBar";
import FeedbackFilter from "../components/FeedbackFilter";
import useAuth from "../hooks/useAuth";

const FeedPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);  // NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [preferredCategories, setPreferredCategories] = useState([]);
  

  const { auth } = useAuth();
  const currentUser = auth?.user;

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (sort) params.append("sort", sort);
      params.append("page", page);
      const categoriesToUse = selectedCategories.length > 0 ? selectedCategories : preferredCategories;
      if (categoriesToUse.length > 0) {
        params.append("categories", categoriesToUse.join(","));
      }

      const res = await axiosPrivate.get(`/feedbacks/search?${params.toString()}`);
      setFeedbacks(res.data.feedbacks);
      setTotalPages(res.data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axiosPrivate.get("/users/profile");
      const prefs = res.data.user.preferredCategories || [];
      setPreferredCategories(prefs);
      setAvailableCategories(prefs);
      setUserBookmarks(res.data.user.bookmarks || []);  // GET user bookmarks
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setAvailableCategories([]);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (preferredCategories.length === 0 && query === '') return;
    fetchFeedbacks();
  }, [preferredCategories, selectedCategories, sort, query, page]);

  const toggleLike = async (id) => {
    try {
      const res = await axiosPrivate.post(`/feedbacks/${id}/like`);
      const updatedLikes = res.data.feedback.likes;
      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb._id === id ? { ...fb, likes: updatedLikes } : fb
        )
      );
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const toggleBookmark = async (id) => {
    try {
      const res = await axiosPrivate.post(`/users/${id}/bookmark`);
      setUserBookmarks(res.data.userBookmarks);  // Update local bookmark state
    } catch (err) {
      console.error("Bookmark failed", err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading your feed...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto min-h-screen">
      <SearchBar />

      <FeedbackFilter
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        availableCategories={availableCategories}
        sort={sort}
        setSort={setSort}
        setPage={setPage}
      />

      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          {query ? "Search Results" : "Your Feed"}
        </h1>
        <button
          onClick={() => navigate("/createfeedback")}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-all"
        >
          + Add Feedback
        </button>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          {query ? "No results found for your search." : "No feedbacks found."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {feedbacks.map((fb) => {
            const userLiked = fb.likes?.some(id => id.toString() === currentUser?._id?.toString());
            const bookmarked = userBookmarks.includes(fb._id);

            return (
              <div
                key={fb._id}
                onClick={() => navigate(`/feedback/${fb._id}`)}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition rounded-2xl p-5 cursor-pointer flex flex-col"
                
              >

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        fb.user?.profilePic?.startsWith("http")
                          ? fb.user.profilePic
                          : `/uploads/${fb.user?.profilePic || "default.png"}`
                      }
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {fb.user?.username || "Anonymous"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(fb.createdAt).toLocaleString()}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">{fb.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">{fb.message}</p>

                {fb.images?.length > 0 && (
                  <div className="flex gap-3 mt-2">
                    {fb.images.slice(0, 2).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.startsWith("http") ? img : `/uploads/${img}`}
                        alt={`Feedback Img ${idx}`}
                        className="rounded-lg w-32 h-32 object-cover border border-gray-300 dark:border-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(img.startsWith("http") ? img : `/uploads/${img}`);
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-around text-gray-500 dark:text-gray-400 text-sm">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(fb._id);
                    }}
                    className="flex items-center gap-1 group"
                    title="Like"
                  >
                    {userLiked ? (
                      <FaHeart className="text-red-500 text-base  transition group-hover:scale-110" />
                    ) : (
                      <FaRegHeart className="text-gray-400 text-base  transition group-hover:scale-110" />
                    )}
                    <span>{fb.likes?.length || 0}</span>
                  </button>

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

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(fb._id);
                    }}
                    className="flex items-center gap-1 group"
                    title="Bookmark"
                  >
                    {bookmarked ? (
                      <FaBookmark className="text-yellow-500 text-base" />
                    ) : (
                      <FaRegBookmark className="text-gray-400 text-base" />
                    )}
                    {/* <span>{userBookmarks.includes(fb._id) ? 1 : 0}</span> */}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-6">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        title="Back to Top"
      >
        <ArrowUp size={20} />
      </button>

      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-5xl w-full px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
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

export default FeedPage;
