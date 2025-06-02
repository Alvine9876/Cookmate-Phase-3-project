
import React from "react";

export default function RecipeDetails({ recipe, onClose }) {
  if (!recipe) return null;

  
  const getSteps = () => {
    if (
      recipe.analyzedInstructions?.length > 0 &&
      recipe.analyzedInstructions[0].steps?.length > 0
    ) {
      return recipe.analyzedInstructions[0].steps.map((step) => step.step);
    }

    if (recipe.instructions) {
      
      return recipe.instructions
        .split(/(?:\.|\n|\r)/)
        .map((step) => step.trim())
        .filter((step) => step.length > 10); 
    }

    return ["No instructions available."];
  };

  const steps = getSteps();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg max-w-3xl w-full p-6 overflow-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "80vh" }}
      >
        <h2 className="text-2xl text-red-600 font-bold mb-4">{recipe.title}</h2>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full rounded mb-4"
        />

        {/* Ingredients */}
        <h3 className="text-xl text-white font-semibold mb-2">Ingredients:</h3>
        <ul className="list-disc list-inside text-white mb-4">
          {recipe.extendedIngredients?.length > 0 ? (
            recipe.extendedIngredients.map((ing) => (
              <li key={ing.id}>{ing.original}</li>
            ))
          ) : (
            <li>No ingredients listed.</li>
          )}
        </ul>

        {/* Instructions */}
        <h3 className="text-xl text-white font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside text-white space-y-2">
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>

        <button
          onClick={onClose}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Close Details
        </button>
      </div>
    </div>
  );
}
