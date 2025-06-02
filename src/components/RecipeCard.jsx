export default function RecipeCard({ recipe, onFavorite, onViewVideo, onViewDetails }) {
  return (
    <div className="bg-white rounded-lg w-full sm:w-72 overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_25px_5px_rgba(0,128,0,0.4)]">
      
      {/* Image section: clicking image shows video */}
      <div
        className="cursor-pointer h-48 md:h-56 overflow-hidden"
        onClick={() => onViewVideo(recipe.videoUrl)}
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title section */}
      <h3 className="text-green-800 text-lg font-semibold mt-2 px-4 truncate" title={recipe.title}>
        {recipe.title}
      </h3>

      {/* Buttons section */}
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={() => onFavorite(recipe.id)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full"
        >
          ❤️ Save
        </button>
        <button
          onClick={() => onViewDetails(recipe.id)}
          className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded-full"
        >
          📺 View Recipe
        </button>
      </div>
    </div>
  );
}
