import React, { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import RecipeDetails from "../components/RecipeDetails";

const BATCH_SIZE = 12;

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("chicken");

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
        );
        const data = await res.json();
        setRecipes(data.meals || []);
      } catch (err) {
        setError("Failed to fetch recipes.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [searchQuery]);

  const currentBatch = recipes.slice(0, BATCH_SIZE);

  function handleFavorite(title) {
    if (!favorites.includes(title)) {
      setFavorites([...favorites, title]);
      alert("Added to favorites!");
    } else {
      alert("Already in favorites!");
    }
  }

  function handleViewVideo(recipe) {
    if (recipe.strYoutube) {
      const embedUrl = recipe.strYoutube.replace("watch?v=", "embed/");
      setVideoUrl(embedUrl);
      setSelectedRecipe(null);
    } else {
      alert("No video available for this recipe.");
    }
  }

  function handleViewDetails(idMeal) {
    const recipe = recipes.find((r) => r.idMeal === idMeal);
    if (recipe) {
      setSelectedRecipe(recipe);
      setVideoUrl(null);
    } else {
      alert("Recipe details not found");
    }
  }

  function closeVideo() {
    setVideoUrl(null);
  }

  if (loading)
    return <div className="p-6 text-black text-center">Loading recipes...</div>;

  if (error)
    return (
      <div className="p-6 text-red-600 text-center">
        Error fetching recipes: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-6">Trending🔥</h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {currentBatch.length > 0 ? (
          currentBatch.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={{
                id: recipe.idMeal,
                title: recipe.strMeal,
                image: recipe.strMealThumb || "https://via.placeholder.com/150",
              }}
              onFavorite={() => handleFavorite(recipe.strMeal)}
              onViewDetails={() => handleViewDetails(recipe.idMeal)}
              onViewVideo={() => handleViewVideo(recipe)}
              cardColor="white"
            />
          ))
        ) : (
          <p className="text-black">No recipes found for "{searchQuery}"</p>
        )}
      </div>

      {/* Video modal */}
      {videoUrl && (
        <div
          onClick={closeVideo}
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4"
        >
          <div
            className="bg-black rounded-lg max-w-3xl w-full aspect-video overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={videoUrl}
              title="Recipe Video"
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
            <button
              onClick={closeVideo}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
            >
              Close Video
            </button>
          </div>
        </div>
      )}

      {/* Recipe details modal */}
      {selectedRecipe && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            className="bg-green-100 rounded-lg max-w-3xl w-full p-6 overflow-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "80vh" }}
          >
            <h2 className="text-2xl text-green-800 font-bold mb-4">
              {selectedRecipe.strMeal}
            </h2>
            <img
              src={selectedRecipe.strMealThumb}
              alt={selectedRecipe.strMeal}
              className="w-full rounded mb-6"
            />

            {/* Ingredients */}
            <h3 className="text-green-700 text-lg font-semibold mb-2">🧂 Ingredients:</h3>
            <ul className="list-disc list-inside text-green-900 mb-6 space-y-1">
              {Array.from({ length: 20 }).map((_, i) => {
                const ingredient = selectedRecipe[`strIngredient${i + 1}`];
                const measure = selectedRecipe[`strMeasure${i + 1}`];
                if (ingredient && ingredient.trim()) {
                  return (
                    <li key={i}>
                      {measure?.trim()} {ingredient.trim()}
                    </li>
                  );
                }
                return null;
              })}
            </ul>

            {/* Instructions */}
            <h3 className="text-green-700 text-lg font-semibold mb-2">👨‍🍳 Steps:</h3>
            <ol className="list-decimal list-inside text-green-900 space-y-2 mb-6">
              {selectedRecipe.strInstructions
                .split(/(?<=\.)\s+/)
                .filter((step) => step.trim().length > 0)
                .map((step, index) => (
                  <li key={index}>{step.trim()}</li>
                ))}
            </ol>

            <button
              onClick={() => setSelectedRecipe(null)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
