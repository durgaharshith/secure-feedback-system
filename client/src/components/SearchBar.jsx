import { useState, useEffect } from "react";
import {useNavigate, useLocation } from 'react-router-dom';
import { Search } from "lucide-react";
import axiosPrivate from "../api/axios";

export default function SearchBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [query, setQuery] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const queryParam = new URLSearchParams(location.search).get("q") || "";
    const [error, setError] = useState(null);

    useEffect(() => {
        if (queryParam) {
        setQuery(queryParam);
        handleSearch(queryParam);
        }
    }, [queryParam]);

    const handleSearch = async (searchText = query) => {
        if (!searchText.trim()) return;

        try {
        const res = await axiosPrivate.get(
            `/feedbacks/search?q=${encodeURIComponent(searchText)}`
        );
        console.log("Search result: ", res.data.feedbacks);
        setFeedbacks(res.data.feedbacks);
        navigate(`/feed?q=${encodeURIComponent(searchText)}`);
        } catch (err) {
        console.error("Search error:", err);
        setError("Search Failed");
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    return (
        <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border px-3 py-2 rounded-xl shadow-sm bg-white dark:bg-gray-800 w-full max-w-lg mx-auto mt-4"
        >
            <input
                type="text"
                placeholder="Search by title, content or category..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow bg-transparent outline-none text-sm text-gray-800 dark:text-white"
            />
            <button type="submit" title="Search">
                <Search size={20} className="text-gray-500 dark:text-gray-300" />
            </button>
        </form>
    );

}