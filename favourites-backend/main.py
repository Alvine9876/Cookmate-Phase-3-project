from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import Favourite
from auth import get_current_user, get_db
from schemas import FavouriteCreate, FavouriteOut
from typing import List

Base.metadata.create_all(bind=engine)
app = FastAPI()

@app.post("/favourites", response_model=FavouriteOut)
def add_favourite(fav: FavouriteCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    existing = db.query(Favourite).filter_by(user_id=user.id, recipe_id=fav.recipe_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already saved")
    new_fav = Favourite(user_id=user.id, recipe_id=fav.recipe_id, title=fav.title, image=fav.image)
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return new_fav

@app.get("/favourites", response_model=List[FavouriteOut])
def get_favourites(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Favourite).filter_by(user_id=user.id).all()

@app.delete("/favourites/{recipe_id}")
def delete_favourite(recipe_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    fav = db.query(Favourite).filter_by(user_id=user.id, recipe_id=recipe_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(fav)
    db.commit()
    return {"detail": "Deleted"}
