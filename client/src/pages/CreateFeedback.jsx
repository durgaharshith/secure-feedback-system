import React, { useState, useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const CreateFeedback = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(1);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [imageLinks, setImageLinks] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosPrivate.get('/feedbacks/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('message', message);
    formData.append('rating', rating);
    formData.append('category', category);

    images.forEach((img) => {
      formData.append('images', img);
    });

    if (imageLinks.trim()) {
      const linksArray = imageLinks.split(',').map(link => link.trim()).filter(Boolean);
      formData.append('imageLinks', JSON.stringify(linksArray));
    }

    try {
      await axiosPrivate.post('/feedbacks/createFeedback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/feed');
    } catch (err) {
      console.error('Error submitting feedback:', err.response?.data || err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 bg-white dark:bg-gray-900 shadow-md rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Submit Feedback</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">

        {/* Category Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <Select
            options={categories.map((cat) => ({ label: cat, value: cat }))}
            value={category ? { label: category, value: category } : null}
            onChange={(selectedOption) => setCategory(selectedOption.value)}
            placeholder="Select a category"
            isSearchable
            className="text-black"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#f9fafb',
                borderColor: '#d1d5db',
                padding: '2px',
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: '#ffffff',
              }),
            }}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            placeholder="Enter feedback title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-100 text-gray-900"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
            className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-100 text-gray-900 resize-none"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Rating (1–10)</label>
          <input
            type="number"
            min={1}
            max={10}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
            className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-100 text-gray-900"
          />
        </div>

        {/* Image Links */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Image Links (comma-separated)</label>
          <input
            type="text"
            placeholder="https://img1.jpg, https://img2.png"
            value={imageLinks}
            onChange={(e) => setImageLinks(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-100 text-gray-900"
          />
        </div>

        {/* Upload Images */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
            className="block w-full text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFeedback;
