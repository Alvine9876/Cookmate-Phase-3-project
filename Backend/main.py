from fastapi import FastAPI
import httpx

app = FastAPI()

MEALDB_RANDOM_URL = "https://www.themealdb.com/api/json/v1/1/random.php"

@app.get("/recipes/feed")
async def get_random_recipes():
    recipes = []

    # Let's get 5 random meals for the feed
    async with httpx.AsyncClient() as client:
        for _ in range(5):
            response = await client.get(MEALDB_RANDOM_URL)
            data = response.json()
            if data["meals"]:
                recipes.append(data["meals"][0])  # each response gives a single meal

    return {"recipes": recipes}
