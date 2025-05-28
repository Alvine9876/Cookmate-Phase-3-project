import { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";

const SPOONACULAR_API_KEY = "f9a52510ad284b1788663e78edf004a0";

const BATCH_SIZE = 12;
const INTERVAL = 5000;

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [batchIndex, setBatchIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?query=chicken&number=30&addRecipeInformation=true&apiKey=${SPOONACULAR_API_KEY}`
        );
        if (!response.ok) throw new Error("Failed to fetch recipes");

        const data = await response.json();
        setRecipes(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  useEffect(() => {
    if (recipes.length === 0) return;

    const intervalId = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setBatchIndex((prev) => (prev + 1) % Math.ceil(recipes.length / BATCH_SIZE));
        setFade(true);
      }, 500);
    }, INTERVAL);

    return () => clearInterval(intervalId);
  }, [recipes]);

  const currentBatch = recipes.slice(
    batchIndex * BATCH_SIZE,
    batchIndex * BATCH_SIZE + BATCH_SIZE
  );

  function handleFavorite(title) {
    if (!favorites.includes(title)) {
      setFavorites([...favorites, title]);
      alert("Added to favorites!");
    } else {
      alert("Already in favorites!");
    }
  }

  function handleViewVideo(sourceUrl) {
    if (sourceUrl) {
      setVideoUrl(sourceUrl);
    } else {
      alert("No video or source available.");
    }
  }

  function closeVideo() {
    setVideoUrl(null);
  }

  if (loading) return <div className="p-6 text-white">Loading recipes...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Trending🔥</h1>

      <div
        className={`flex flex-wrap gap-6 justify-center transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {currentBatch.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={{
              id: recipe.id,
              title: recipe.title,
              image: recipe.image || "https://via.placeholder.com/150",
              videoUrl: recipe.sourceUrl,
            }}
            onFavorite={() => handleFavorite(recipe.title)}
            onViewDetails={() => handleViewVideo(recipe.sourceUrl)}
            onViewVideo={() => handleViewVideo(recipe.sourceUrl)}
          />
        ))}
      </div>

      {videoUrl && (
        <div
          onClick={closeVideo}
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4"
        >
          <div
            className="bg-gray-900 rounded-lg max-w-3xl w-full aspect-video overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={videoUrl}
              title="Recipe Video or Source"
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
            <button
              onClick={closeVideo}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded"
            >
              Close Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
