from app.database import SessionLocal
from app.models import Recipe

db = SessionLocal()

dummy = Recipe(title="Ugali & Sukuma", category="Dinner", steps="1. Boil water...\n2. Add flour", image="ugali.jpg")
db.add(dummy)
db.commit()
db.close()
