// FeedbackDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import useAuth from "../hooks/useAuth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function FeedbackDetail() {
  const { id } = useParams();
  const { auth } = useAuth();
  const currentUser = auth?.user;
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchFeedback = async () => {
      try {
        const res = await axiosPrivate.get(`/feedbacks/${id}`);
        setFeedback(res.data);
      } catch (err) {
        setError("Failed to load feedback.");
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axiosPrivate.get(`/feedbacks/${id}/comments`);
        setComments(res.data.comment);
      } catch (err) {
        setError("Failed to load comments.");
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchFeedback(), fetchComments()]);
      setLoading(false);
    };

    fetchData();
  }, [id, auth]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axiosPrivate.post(`/feedbacks/${id}/comments`, { text: commentText });
      setComments((prev) => [res.data.comment, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error("Failed to post comment: ", err);
      alert("Error submitting comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;
  if (!feedback) return <div className="p-4 text-center text-gray-500">Feedback not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      {/* Feedback Info */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-4">
        <div className="flex items-center gap-3">
          {feedback.author?.profilePic && (
            <img src={feedback.author.profilePic} alt="Author" className="w-10 h-10 rounded-full" />
          )}
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {feedback.author?.name}
            </p>
            <p className="text-xs text-gray-500">
              {dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}
            </p>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{feedback.title}</h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{feedback.message}</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Rating: <strong>{feedback.rating}</strong>
          </p>
        </div>

        {feedback.images?.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedback.images.map((img) => (
              <img key={img} src={img} alt="screenshot" className="rounded-xl w-full object-cover" />
            ))}
          </div>
        )}

        {currentUser?._id === feedback.author?.id && (
          <button
            onClick={() => navigate(`/editfeedback/${feedback.id}`)}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            ✏️ Edit Feedback
          </button>
        )}
      </div>

      {/* Comment Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Comments ({comments.length})
        </h2>

        {/* Add Comment */}
        <form onSubmit={handleAddComment} className="mb-6 space-y-2">
          <textarea
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>

        {/* Comment List */}
        {comments.length > 0 ? (
          <div className="space-y-5">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 border-t pt-4">
                {comment.user?.profilePic && (
                  <img
                    src={comment.user.profilePic}
                    alt="User"
                    className="w-9 h-9 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {comment.user.username}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dayjs(comment.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to reply.</p>
        )}
      </div>
    </div>
  );
}
