# app/routers/recipes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Recipe

router = APIRouter(prefix="/recipes", tags=["recipes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_all_recipes(db: Session = Depends(get_db)):
    return db.query(Recipe).all()

@router.post("/")
def create_recipe(recipe: Recipe, db: Session = Depends(get_db)):
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe
