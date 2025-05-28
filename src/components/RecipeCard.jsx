export default function RecipeCard({ recipe, onFavorite, onViewVideo, onViewDetails }) {
  return (
    <div className="bg-white rounded-lg shadow-md w-72 overflow-hidden">
      <div
        className="cursor-pointer h-44 overflow-hidden"
        onClick={() => onViewVideo(recipe.videoUrl)}
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={() => onFavorite(recipe.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full"
        >
          ❤️ Save
        </button>
        <button
          onClick={() => onViewDetails(recipe.id)}  // <-- call details handler here
          className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1 rounded-full"
        >
          📺 View Recipe
        </button>
      </div>
    </div>
  );
}
