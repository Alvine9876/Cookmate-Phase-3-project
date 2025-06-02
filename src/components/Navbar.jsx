import React, { useState } from "react";

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleInputChange(e) {
    setQuery(e.target.value);
  }

  function handleSearch() {
    if (query.trim()) {
      onSearch(query.trim());
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white text-black shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold text-red-600">CookMate</div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="px-4 py-2 rounded-full outline-none bg-gray-200 text-black placeholder-gray-500"
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
        >
          Search
        </button>

        {/* Other Buttons */}
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full">
          Recipes
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full">
          Saved
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full">
          Sign In
        </button>
      </div>
    </nav>
  );
}
