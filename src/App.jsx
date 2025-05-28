import React from "react";
import "./App.css";
import HomePage from "./Pages/HomePage";
import SavedPage from "./Pages/SavedPage";
import RecipesPage from "./Pages/RecipesPage";
import Navbar from './components/Navbar'; 

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
