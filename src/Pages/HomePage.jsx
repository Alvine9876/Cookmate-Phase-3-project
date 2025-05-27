import { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import HeroCarousel from "../components/HeroCarousel";

const API_KEY = "6ae99f60247949c2ae7bbdde39dd193f";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [instructions, setInstructions] = useState(null);
  const [selectedRecipeTitle, setSelectedRecipeTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const heroImages = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512058564366-c9e0f0b21663?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
  ];

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      setError(null);
      try {
        const keywords = [
          "steak",
          "mac and cheese",
          "rotisserie chicken",
          "fried chicken",
          "pizza",
          "ribs",
          "lasagna",
          "burger",
        ];
        const allResults = [];

        for (let keyword of keywords) {
          const res = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(
              keyword
            )}&number=3&addRecipeInformation=true`
          );
          if (!res.ok) throw new Error(`Failed to fetch recipes for ${keyword}`);
          const data = await res.json();
          allResults.push(...data.results);
        }

        // Deduplicate by recipe ID
        const uniqueRecipes = Array.from(
          new Map(allResults.map((r) => [r.id, r])).values()
        );

        setRecipes(uniqueRecipes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  function handleFavorite(id) {
    if (!favorites.includes(id)) {
      setFavorites([...favorites, id]);
      alert("Added to favorites!");
    } else {
      alert("Already in favorites!");
    }
  }

  async function handleViewRecipe(id, title) {
    setError(null);
    setInstructions(null);
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${API_KEY}`
      );
      if (!res.ok) throw new Error("Failed to fetch instructions");
      const data = await res.json();

      if (data.length === 0) {
        setInstructions(["No instructions available for this recipe."]);
      } else {
        const steps = data[0].steps.map((step) => step.step);
        setInstructions(steps);
      }
      setSelectedRecipeTitle(title);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleViewVideo(url) {
    if (url) setVideoUrl(url);
    else alert("No video available for this recipe.");
  }

  function closeInstructions() {
    setInstructions(null);
    setSelectedRecipeTitle("");
  }

  function closeVideo() {
    setVideoUrl(null);
  }

  if (loading) return <div className="p-6">Loading recipes...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <HeroCarousel images={heroImages} />

      <h1 className="text-4xl font-bold text-red-600 mb-6">🔥 Top Recipes You’ll Love</h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={{
              id: recipe.id,
              title: recipe.title,
              image: recipe.image,
              videoUrl: recipe.video ?? recipe.videoUrl ?? "",
            }}
            onFavorite={handleFavorite}
            onViewDetails={() => handleViewRecipe(recipe.id, recipe.title)}
            onViewVideo={handleViewVideo}
          />
        ))}
      </div>

      {instructions && (
        <div
          onClick={closeInstructions}
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 overflow-auto"
        >
          <div
            className="bg-white rounded-lg max-w-lg max-h-full p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{selectedRecipeTitle} - Instructions</h2>
            <ol className="list-decimal list-inside space-y-2">
              {instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <button
              onClick={closeInstructions}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {videoUrl && (
        <div
          onClick={closeVideo}
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
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
