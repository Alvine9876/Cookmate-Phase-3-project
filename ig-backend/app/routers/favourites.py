# app/routers/favourites.py
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from ..utils.auth import verify_token
from ..models import Favourite, Recipe
from ..database import SessionLocal

router = APIRouter(prefix="/favourites", tags=["favourites"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_user_favourites(user=Depends(verify_token), db: Session = Depends(get_db)):
    return db.query(Favourite).filter(Favourite.user_id == user["uid"]).all()

@router.post("/")
def add_to_favourites(recipe_id: int, user=Depends(verify_token), db: Session = Depends(get_db)):
    fav = Favourite(user_id=user["uid"], recipe_id=recipe_id)
    db.add(fav)
    db.commit()
    return {"message": "Added to favourites"}

@router.delete("/{fav_id}")
def delete_favourite(fav_id: int, user=Depends(verify_token), db: Session = Depends(get_db)):
    fav = db.query(Favourite).filter(Favourite.id == fav_id, Favourite.user_id == user["uid"]).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favourite not found")
    db.delete(fav)
    db.commit()
    return {"message": "Deleted from favourites"}
