from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, recipes, favourites
from .database import engine, Base

import firebase_admin
from firebase_admin import credentials, auth

# Firebase Admin SDK initialization
cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred)

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(auth.router)
app.include_router(recipes.router)
app.include_router(favourites.router)

@app.get("/")
def root():
    return {"message": "Welcome to Cookmate API"}
