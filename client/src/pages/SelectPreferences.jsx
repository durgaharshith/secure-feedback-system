import { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import AuthContext from "../context/AuthContext.jsx";

const MAX_VISIBLE = 20;

export default function SelectPreferencesPage() {
  const [selected, setSelected] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [remaining, setRemaining] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useContext(AuthContext);

  const allCategories = useMemo(() => {
    const categories = [
      "Smartphones & tablets",
      "Laptops & computers",
      "TVs & home theater systems",
      "Smartwatches & fitness trackers",
      "Audio equipment (headphones, speakers)",
      "Gaming consoles & accessories",
      "Home appliances (refrigerators, washing machines)",
      "Men’s clothing",
      "Women’s clothing",
      "Kids’ clothing",
      "Footwear",
      "Accessories (watches, jewelry, sunglasses)",
      "Bags & luggage",
      "Furniture",
      "Cookware & bakeware",
      "Storage & organization items",
      "Cleaning supplies",
      "Home décor items",
      "Lighting products",
      "Toiletries (soap, shampoo, toothpaste)",
      "Hygiene products",
      "Skincare products",
      "Haircare products",
      "Makeup / Cosmetics",
      "Health supplements",
      "Packaged food",
      "Fresh produce",
      "Beverages (coffee, tea, soft drinks)",
      "Snacks",
      "Organic / specialty food",
      "Baby food",
      "Diapers",
      "Toys & games",
      "Strollers, cribs, and baby gear",
      "Pet food",
      "Pet accessories (leashes, collars, litter)",
      "Pet toys",
      "Pet grooming products",
      "Movies (theatrical releases)",
      "TV shows / streaming series",
      "Documentaries",
      "Short films / web series",
      "Animated content",
      "Fiction books",
      "Non-fiction books",
      "Comics & graphic novels",
      "Academic or educational books",
      "Music albums / EPs / singles",
      "Live performances / concerts",
      "Streaming music experiences",
      "Console games",
      "PC games",
      "Mobile games",
      "Online / multiplayer games",
      "Game DLCs & expansions",
      "Productivity apps",
      "Design tools",
      "Social media platforms",
      "Utility apps",
      "Restaurants",
      "Cafés",
      "Takeout / delivery services",
      "Hotel rooms",
      "Hotel amenities",
      "Hotel staff & service",
      "Tourist destinations",
      "Local experiences",
      "Attractions / landmarks",
      "Nature parks",
      "Concerts",
      "Theater / plays",
      "Conventions / expos",
      "Festivals",
      "Schools / colleges",
      "Online courses",
      "Coaching centers",
      "Tutors",
      "Hospitals",
      "Clinics",
      "Doctors / specialists",
      "Wellness centers",
      "Mental health services",
      "Cars",
      "Bikes",
      "Buses",
      "Trains",
      "Metros",
      "Ride-hailing services (Uber, Lyft)",
      "Taxi services",
      "Airlines",
      "Car rentals",
      "Scooter / bike rentals",
      "Vacation rentals (Airbnb)",
      "E-commerce websites",
      "Learning platforms",
      "Streaming platforms",
      "Forums & communities",
      "Tech support",
      "Warranty services",
      "Complaint handling",
      "Banks",
      "Insurance providers",
      "Mobile wallets",
      "Credit card companies",
      "Internet providers",
      "Electricity/gas services",
      "Subscription boxes",
      "Cloud services",
      "Hotel staff & service" // if duplicate again, will be removed by Set
    ];
    return [...new Set(categories)];
  }, []);

  useEffect(() => {
    const shuffled = [...allCategories].sort(() => 0.5 - Math.random());
    setVisibleCategories(shuffled.slice(0, MAX_VISIBLE));
    setRemaining(shuffled.slice(MAX_VISIBLE));

    const duplicates = allCategories.filter((item, index, self) => self.indexOf(item) !== index);
    if (duplicates.length > 0) {
      console.warn("Duplicate categories detected (filtered out):", duplicates);
    }
  }, [allCategories]);

  const handleSelect = (category) => {
    if (selected.includes(category)) return;
    setSelected((prev) => [...prev, category]);
    setVisibleCategories((prev) => {
      const filtered = prev.filter((c) => c !== category);
      if (remaining.length > 0) {
        const [next, ...rest] = remaining;
        setRemaining(rest);
        return [...filtered, next];
      }
      return filtered;
    });
  };

  const handleRemove = (category) => {
    setSelected((prev) => prev.filter((c) => c !== category));
    setVisibleCategories((prev) => {
      const updated = [...prev, category];
      return updated.length > MAX_VISIBLE
        ? updated.slice(0, MAX_VISIBLE)
        : updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axiosPrivate.post("/users/preferences", {
        preferredCategories: selected.map((c) => c.trim()),
      });

      const updateUser = {
        ...auth.user,
        preferredCategories: selected,
      };
      setAuth({ ...auth, user: updateUser });

      navigate("/");
    } catch (err) {
      console.error("Preference save error:", err);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 shadow-xl rounded-3xl p-10 relative overflow-hidden">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">
          Pick Your Interests
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Select at least one category to customize your feed.
        </p>

        {/* Selected Preferences */}
        {selected.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {selected.map((category) => (
              <div
                key={category}
                onClick={() => handleRemove(category)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all shadow-sm"
              >
                {category} <span className="ml-1 font-bold">&times;</span>
              </div>
            ))}
          </div>
        )}

        {/* Visible Preferences */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {visibleCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              disabled={selected.includes(category)}
              className={`px-4 py-2 rounded-full text-sm shadow-sm transition font-medium ${
                selected.includes(category)
                  ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-center text-sm text-red-500 font-medium mb-4">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="block w-full max-w-xs mx-auto bg-blue-600 text-white font-semibold py-2.5 rounded-full hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue to Feed"}
        </button>
      </div>
    </div>
  );
}
