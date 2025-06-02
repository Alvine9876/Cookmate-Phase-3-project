import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black text-white shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold text-red-600">CookMate</div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded-full outline-none bg-gray-800 text-white placeholder-gray-400"
        />

        {/* Buttons */}
        <Link to="/">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full">
             Recipes
          </button>
        </Link>

        <Link to="/saved">
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full">
          Saved
        </button>
        </Link>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full">
          Sign In
        </button>
      </div>
    </nav>
  );
}
