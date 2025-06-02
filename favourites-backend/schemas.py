from pydantic import BaseModel

class FavouriteCreate(BaseModel):
    recipe_id: int
    title: str
    image: str

class FavouriteOut(FavouriteCreate):
    id: int
    class Config:
        # orm_mode = True
        from_attributes = True
