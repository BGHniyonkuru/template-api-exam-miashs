import fetch from "node-fetch";

const CITY_API_URL = "https://api-ugi2pflmha-ew.a.run.app/cities";
const WEATHER_API_URL = "https://api-ugi2pflmha-ew.a.run.app/weather";

// 📌 Stockage temporaire des recettes en mémoire
const recipesDB = {};

// 🔹 Route GET /cities/:cityId/infos
export const getCityInfos = async (request, reply) => {
    try {
      const { cityId } = request.params;
      const cityResponse = await fetch(`https://api-ugi2pflmha-ew.a.run.app/cities/${cityId}`);
  
      if (!cityResponse.ok) {
        return reply.status(404).send({ error: "City not found" });
      }
  
      const cityData = await cityResponse.json();
  
      reply.send({
        coordinates: cityData.coordinates,
        population: cityData.population,
        knownFor: cityData.knownFor,
        recipes: cityData.recipes || [],
      });
  
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  };
  

// 🔹 Route POST /cities/:cityId/recipes
export const addRecipe = async (request, reply) => {
  try {
    const { cityId } = request.params;
    const { content } = request.body;

    // 🔹 Vérifier si la ville existe
    const cityResponse = await fetch(`${CITY_API_URL}/${cityId}`);
    if (!cityResponse.ok) {
      return reply.status(404).send({ error: "City not found" });
    }

    // 🔹 Vérifier le contenu de la recette
    if (!content || content.length < 10 || content.length > 2000) {
      return reply.status(400).send({ error: "Invalid recipe content" });
    }

    // 🔹 Ajouter la recette en mémoire
    if (!recipesDB[cityId]) recipesDB[cityId] = [];
    const newRecipe = { id: Date.now(), content };
    recipesDB[cityId].push(newRecipe);

    reply.status(201).send(newRecipe);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};

// 🔹 Route DELETE /cities/:cityId/recipes/:recipeId
export const deleteRecipe = async (request, reply) => {
  try {
    const { cityId, recipeId } = request.params;

    // 🔹 Vérifier si la ville existe
    if (!recipesDB[cityId]) {
      return reply.status(404).send({ error: "City not found" });
    }

    // 🔹 Trouver la recette
    const recipeIndex = recipesDB[cityId].findIndex(r => r.id == recipeId);
    if (recipeIndex === -1) {
      return reply.status(404).send({ error: "Recipe not found" });
    }

    // 🔹 Supprimer la recette
    recipesDB[cityId].splice(recipeIndex, 1);
    reply.status(204).send(); // No content
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};
