from fastapi import APIRouter, Depends, Request
from ..utils.auth import verify_token
from ..database import SessionLocal
from ..models import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/me")
def get_me(user_data: dict = Depends(verify_token)):
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_data["uid"]).first()
    if not user:
        user = User(id=user_data["uid"], email=user_data["email"])
        db.add(user)
        db.commit()
        db.refresh(user)
    db.close()
    return {"id": user.id, "email": user.email}
