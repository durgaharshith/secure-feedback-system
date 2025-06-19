// EditProfileForm.jsx
import React, { useState, useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import Select from "react-select";

const categoryOptions = [
  { value: "Smartphones & tablets", label: "Smartphones & tablets" },
  { value: "Laptops & computers", label: "Laptops & computers" },
  { value: "TVs & home theater systems", label: "TVs & home theater systems" },
  { value: "Smartwatches & fitness trackers", label: "Smartwatches & fitness trackers" },
  { value: "Audio equipment (headphones, speakers)", label: "Audio equipment (headphones, speakers)" },
  { value: "Gaming consoles & accessories", label: "Gaming consoles & accessories" },
  { value: "Home appliances (refrigerators, washing machines)", label: "Home appliances (refrigerators, washing machines)" },
  { value: "Men’s clothing", label: "Men’s clothing" },
  { value: "Women’s clothing", label: "Women’s clothing" },
  { value: "Kids’ clothing", label: "Kids’ clothing" },
  { value: "Footwear", label: "Footwear" },
  { value: "Accessories (watches, jewelry, sunglasses)", label: "Accessories (watches, jewelry, sunglasses)" },
  { value: "Bags & luggage", label: "Bags & luggage" },
  { value: "Furniture", label: "Furniture" },
  { value: "Cookware & bakeware", label: "Cookware & bakeware" },
  { value: "Storage & organization items", label: "Storage & organization items" },
  { value: "Cleaning supplies", label: "Cleaning supplies" },
  { value: "Home décor items", label: "Home décor items" },
  { value: "Lighting products", label: "Lighting products" },
  { value: "Toiletries (soap, shampoo, toothpaste)", label: "Toiletries (soap, shampoo, toothpaste)" },
  { value: "Hygiene products", label: "Hygiene products" },
  { value: "Skincare products", label: "Skincare products" },
  { value: "Haircare products", label: "Haircare products" },
  { value: "Makeup / Cosmetics", label: "Makeup / Cosmetics" },
  { value: "Health supplements", label: "Health supplements" },
  { value: "Packaged food", label: "Packaged food" },
  { value: "Fresh produce", label: "Fresh produce" },
  { value: "Beverages (coffee, tea, soft drinks)", label: "Beverages (coffee, tea, soft drinks)" },
  { value: "Snacks", label: "Snacks" },
  { value: "Organic / specialty food", label: "Organic / specialty food" },
  { value: "Baby food", label: "Baby food" },
  { value: "Diapers", label: "Diapers" },
  { value: "Toys & games", label: "Toys & games" },
  { value: "Strollers, cribs, and baby gear", label: "Strollers, cribs, and baby gear" },
  { value: "Pet food", label: "Pet food" },
  { value: "Pet accessories (leashes, collars, litter)", label: "Pet accessories (leashes, collars, litter)" },
  { value: "Pet toys", label: "Pet toys" },
  { value: "Pet grooming products", label: "Pet grooming products" },
  { value: "Movies (theatrical releases)", label: "Movies (theatrical releases)" },
  { value: "TV shows / streaming series", label: "TV shows / streaming series" },
  { value: "Documentaries", label: "Documentaries" },
  { value: "Short films / web series", label: "Short films / web series" },
  { value: "Animated content", label: "Animated content" },
  { value: "Fiction books", label: "Fiction books" },
  { value: "Non-fiction books", label: "Non-fiction books" },
  { value: "Comics & graphic novels", label: "Comics & graphic novels" },
  { value: "Academic or educational books", label: "Academic or educational books" },
  { value: "Music albums / EPs / singles", label: "Music albums / EPs / singles" },
  { value: "Live performances / concerts", label: "Live performances / concerts" },
  { value: "Streaming music experiences", label: "Streaming music experiences" },
  { value: "Console games", label: "Console games" },
  { value: "PC games", label: "PC games" },
  { value: "Mobile games", label: "Mobile games" },
  { value: "Online / multiplayer games", label: "Online / multiplayer games" },
  { value: "Game DLCs & expansions", label: "Game DLCs & expansions" },
  { value: "Productivity apps", label: "Productivity apps" },
  { value: "Design tools", label: "Design tools" },
  { value: "Social media platforms", label: "Social media platforms" },
  { value: "Utility apps", label: "Utility apps" },
  { value: "Restaurants", label: "Restaurants" },
  { value: "Cafés", label: "Cafés" },
  { value: "Takeout / delivery services", label: "Takeout / delivery services" },
  { value: "Hotel rooms", label: "Hotel rooms" },
  { value: "Hotel amenities", label: "Hotel amenities" },
  { value: "Hotel staff & service", label: "Hotel staff & service" },
  { value: "Tourist destinations", label: "Tourist destinations" },
  { value: "Local experiences", label: "Local experiences" },
  { value: "Attractions / landmarks", label: "Attractions / landmarks" },
  { value: "Nature parks", label: "Nature parks" },
  { value: "Concerts", label: "Concerts" },
  { value: "Theater / plays", label: "Theater / plays" },
  { value: "Conventions / expos", label: "Conventions / expos" },
  { value: "Festivals", label: "Festivals" },
  { value: "Schools / colleges", label: "Schools / colleges" },
  { value: "Online courses", label: "Online courses" },
  { value: "Coaching centers", label: "Coaching centers" },
  { value: "Tutors", label: "Tutors" },
  { value: "Hospitals", label: "Hospitals" },
  { value: "Clinics", label: "Clinics" },
  { value: "Doctors / specialists", label: "Doctors / specialists" },
  { value: "Wellness centers", label: "Wellness centers" },
  { value: "Mental health services", label: "Mental health services" },
  { value: "Cars", label: "Cars" },
  { value: "Bikes", label: "Bikes" },
  { value: "Buses", label: "Buses" },
  { value: "Trains", label: "Trains" },
  { value: "Metros", label: "Metros" },
  { value: "Ride-hailing services (Uber, Lyft)", label: "Ride-hailing services (Uber, Lyft)" },
  { value: "Taxi services", label: "Taxi services" },
  { value: "Airlines", label: "Airlines" },
  { value: "Car rentals", label: "Car rentals" },
  { value: "Scooter / bike rentals", label: "Scooter / bike rentals" },
  { value: "Vacation rentals (Airbnb)", label: "Vacation rentals (Airbnb)" },
  { value: "E-commerce websites", label: "E-commerce websites" },
  { value: "Learning platforms", label: "Learning platforms" },
  { value: "Streaming platforms", label: "Streaming platforms" },
  { value: "Forums & communities", label: "Forums & communities" },
  { value: "Tech support", label: "Tech support" },
  { value: "Warranty services", label: "Warranty services" },
  { value: "Complaint handling", label: "Complaint handling" },
  { value: "Banks", label: "Banks" },
  { value: "Insurance providers", label: "Insurance providers" },
  { value: "Mobile wallets", label: "Mobile wallets" },
  { value: "Credit card companies", label: "Credit card companies" },
  { value: "Internet providers", label: "Internet providers" },
  { value: "Electricity/gas services", label: "Electricity/gas services" },
  { value: "Subscription boxes", label: "Subscription boxes" },
  { value: "Cloud services", label: "Cloud services" },
  { value: "Others", label: "Others" }
];


const EditProfileForm = ({ user, setUser, onClose }) => {
  const isDarkMode = document.documentElement.classList.contains("dark");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    preferredCategories: [],
    profilePic: null,
  });

  // Preload user data into form
  useEffect(() => {
    console.log("Loaded user:", user);
    if (user) {
      const categoryValues = user.preferredCategories || [];
      console.log("Raw preferredCategories:", categoryValues);
      const matchedOptions = categoryOptions.filter((opt) =>
        categoryValues.includes(opt.value)
      );

      console.log("Matched Options:", matchedOptions);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        preferredCategories: matchedOptions,
        profilePic: null,
      });
    }
  }, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      preferredCategories: selectedOptions,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      profilePic: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      // Send only fields that user may have updated
      if (formData.name) form.append("name", formData.name);
      if (formData.email) form.append("email", formData.email);

      const selectedCategories = formData.preferredCategories.map((c) => c.value);
      if (selectedCategories.length > 0) {
        form.append("preferredCategories", JSON.stringify(selectedCategories));
      }

      if (formData.profilePic) {
        form.append("profilePic", formData.profilePic);
      }

      const response = await axiosPrivate.put("/users/profile/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(response.data.user);      // update UI with new info
      onClose();                        // close the modal
    } catch (err) {
      console.error("Update failed", err);
      alert("Profile update failed.");
    }
  };

  const darkSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937", // Tailwind's gray-800
      color: "white",
      borderColor: "#4b5563", // Tailwind's gray-600
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937", // dark menu
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#374151" : "#1f2937", // highlight dark
      color: "white",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#374151", // dark chip background
      color: "white",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      ":hover": {
        backgroundColor: "#4b5563",
        color: "white",
      },
    }),
  };


  const lightSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "white",
      color: "black",
      borderColor: "#d1d5db", // Tailwind gray-300
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "white",
      color: "black",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f3f4f6" : "white", // Tailwind gray-100
      color: "black",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e5e7eb", // Tailwind gray-200
      color: "black",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "black",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "black",
      ":hover": {
        backgroundColor: "#d1d5db", // Tailwind gray-300
        color: "black",
      },
    }),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Preferred Categories
        </label>
        <Select
          isMulti
          options={categoryOptions}
          value={formData.preferredCategories}
          onChange={handleCategoryChange}
          className="react-select-container mt-1"
          classNamePrefix="react-select"
          styles={isDarkMode ? darkSelectStyles : lightSelectStyles}

        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Profile Picture (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mt-1"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Update Profile
      </button>
    </form>
  );
};

export default EditProfileForm;
