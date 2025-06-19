//ExploreFeedback.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import Select from 'react-select';

const EditFeedback = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(1);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [imageLinks, setImageLinks] = useState('');

    useEffect(() => {
        const fetchFeedbackAndCategories = async () => {
            try {
                const [catRes, feedbackRes] = await Promise.all([
                    axiosPrivate.get('/feedbacks/categories'),
                    axiosPrivate.get(`/feedbacks/${id}`),
                ]);

                setCategories(catRes.data);
                const { title, message, rating, category, images } = feedbackRes.data;

                setTitle(title);
                setMessage(message);
                setRating(rating);
                setCategory(category);
                setImageLinks(images?.join(', ') || '');
            } catch (err) {
                console.error('Error fetching feedback or categories:', err);
            }
        };
        fetchFeedbackAndCategories();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('message', message);
        formData.append('rating', rating);
        formData.append('category', category);

        images.forEach(img => formData.append('images', img));

        if (imageLinks.trim()) {
            const linksArray = imageLinks
                .split(',')
                .map(link => link.trim())
                .filter(Boolean);
            formData.append('existingImages', JSON.stringify(linksArray));
        }


        try {
            await axiosPrivate.put(`/feedbacks/${id}/edit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/feedback/${id}`);
        } catch (err) {
            console.error('Error updating feedback:', err.response?.data || err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                    Edit Feedback
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Category</label>
                        <Select
                            options={categories.map(cat => ({ label: cat, value: cat }))}
                            value={category ? { label: category, value: category } : null}
                            onChange={(selected) => setCategory(selected.value)}
                            placeholder="Select a category"
                            isSearchable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: '#f9f9f9',
                                    color: '#000',
                                    borderColor: '#ccc',
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: '#000',
                                }),
                                menu: (base) => ({
                                    ...base,
                                    backgroundColor: '#fff',
                                    color: '#000',
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isFocused ? '#e2e8f0' : '#fff',
                                    color: '#000',
                                }),
                            }}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            type="text"
                            className="w-full border px-4 py-2 rounded bg-white text-black dark:bg-gray-100 dark:text-black"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Message</label>
                        <textarea
                            rows={5}
                            className="w-full border px-4 py-2 rounded bg-white text-black dark:bg-gray-100 dark:text-black"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Rating (1–10)</label>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="w-full border px-4 py-2 rounded bg-white text-black dark:bg-gray-100 dark:text-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Image URLs (comma-separated)</label>
                        <input
                            type="text"
                            placeholder="https://img1, https://img2"
                            value={imageLinks}
                            onChange={(e) => setImageLinks(e.target.value)}
                            className="w-full border px-4 py-2 rounded bg-white text-black dark:bg-gray-100 dark:text-black"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Upload Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setImages([...e.target.files])}
                            className="block text-sm text-gray-500"
                        />
                    </div>

                    {images.length > 0 && (
                        <div className="flex gap-3 flex-wrap">
                            {Array.from(images).map((img, i) => (
                                <img
                                    key={i}
                                    src={URL.createObjectURL(img)}
                                    alt={`preview-${i}`}
                                    className="h-16 w-16 object-cover rounded"
                                />
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update Feedback
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditFeedback;
