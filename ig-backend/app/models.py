from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)  # Firebase UID
    email = Column(String, unique=True, index=True)
    favourites = relationship("Favourite", back_populates="user")

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)
    steps = Column(Text)
    image = Column(String)

class Favourite(Base):
    __tablename__ = "favourites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    recipe_id = Column(Integer, ForeignKey("recipes.id"))

    user = relationship("User", back_populates="favourites")
