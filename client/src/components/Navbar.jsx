import { NavLink, Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { auth, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() =>
        localStorage.getItem("theme") === "dark"
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isAdmin = auth?.user?.role === 'admin';

    // Apply dark mode class on initial mount and whenever state changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        const newDark = !darkMode;
        setDarkMode(newDark);
        localStorage.setItem("theme", newDark ? "dark" : "light");
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const handleLinkClick = () => {
        setMenuOpen(false);
        setDropdownOpen(false);
    };

    const commonLinks = (
        <>
            <NavLink to='/feed' onClick={handleLinkClick} className={({ isActive }) => isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400 transition"}>Feed</NavLink>
            <NavLink to='/explore' onClick={handleLinkClick} className={({ isActive }) => isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400 transition"}>Explore</NavLink>
        </>
    );

    const authLinks = auth?.user ? (
        <div className="relative" ref={dropdownRef}>
            <img
                src={auth.user.profilePic || "/default-featured-image.jpg"}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover cursor-pointer border-2 border-blue-400 transition hover:scale-105"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <Link to="/profile" onClick={handleLinkClick} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Profile</Link>
                    <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Logout</button>
                </div>
            )}
        </div>
    ) : (
        <>
            <NavLink to="/login" onClick={handleLinkClick} className="hover:underline transition">Login</NavLink>
            <NavLink to="/register" onClick={handleLinkClick} className="hover:underline transition">Register</NavLink>
        </>
    );

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md dark:text-white sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    FeedbackHub
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex gap-6 items-center">
                    {commonLinks}
                    {isAdmin && (
                        <NavLink
                            to="/admin"
                            onClick={handleLinkClick}
                            className={({ isActive }) =>
                                isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400 transition"
                            }
                        >
                            Admin
                        </NavLink>
                    )}
                    <button onClick={toggleDarkMode} aria-label="Toggle Theme" className="hover:text-yellow-500 transition">
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    {authLinks}
                </div>

                {/* Mobile Menu Button */}
                <button onClick={toggleMenu} aria-label="Toggle Menu" className="md:hidden text-blue-600 dark:text-blue-400">
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 flex flex-col gap-4 animate-slide-down text-base">
                    {commonLinks}
                    {isAdmin && (
                        <NavLink
                            to="/admin"
                            onClick={handleLinkClick}
                            className={({ isActive }) =>
                                isActive ? "text-blue-500 font-semibold" : "hover:text-blue-400 transition"
                            }
                        >
                            Admin
                        </NavLink>
                    )}
                    <button onClick={toggleDarkMode} className="flex items-center gap-2 text-left hover:text-yellow-500 transition">
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />} {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                    {auth?.user ? (
                        <>
                            <Link to="/profile" onClick={handleLinkClick} className="hover:underline transition">Profile</Link>
                            <button onClick={logout} className="hover:underline text-left transition">Logout</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={handleLinkClick} className="hover:underline transition">Login</NavLink>
                            <NavLink to="/register" onClick={handleLinkClick} className="hover:underline transition">Register</NavLink>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
