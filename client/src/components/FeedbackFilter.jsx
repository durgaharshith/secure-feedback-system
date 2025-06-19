import React from "react";
import Select from "react-select";
import useTheme from "../hooks/useTheme"; // adjust path as needed

const FeedbackFilter = ({
  selectedCategories,
  setSelectedCategories,
  availableCategories,
  sort,
  setSort,
  setPage,
}) => {
  const isDark = useTheme();

  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected.map((opt) => opt.value));
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSort("");
    setPage(1);
  };

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: isDark ? "#1f2937" : "white",
      color: isDark ? "white" : "black",
      borderColor: isDark ? "#4b5563" : "#ccc",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDark ? "#1f2937" : "white",
      color: isDark ? "white" : "black",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDark
          ? "#374151"
          : "#f3f4f6"
        : isDark
        ? "#1f2937"
        : "white",
      color: isDark ? "white" : "black",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: isDark ? "#374151" : "#e5e7eb",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: isDark ? "white" : "black",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: isDark ? "white" : "black",
      ":hover": {
        backgroundColor: isDark ? "#4b5563" : "#d1d5db",
        color: "white",
      },
    }),
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mt-6 mb-4">
      <Select
        isMulti
        options={availableCategories.map((cat) => ({ value: cat, label: cat }))}
        value={selectedCategories.map((cat) => ({ value: cat, label: cat }))}
        onChange={handleCategoryChange}
        placeholder="Filter by categories"
        className="react-select-container mt-1"
        classNamePrefix="react-select"
        styles={selectStyles}
      />

      <select
        value={sort}
        onChange={handleSortChange}
        className="w-44 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
      >
        <option value="">Sort by</option>
        <option value="rating_desc">Rating: High to Low</option>
        <option value="rating_asc">Rating: Low to High</option>
      </select>

      <button
        type="button"
        onClick={handleClearFilters}
        className="px-4 py-2 border rounded-md text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FeedbackFilter;
