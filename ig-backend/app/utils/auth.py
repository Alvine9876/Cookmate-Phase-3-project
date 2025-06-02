import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Depends, Request
import os

# Initialize Firebase
cred = credentials.Certificate("firebase.json")  # Ensure this is in your .gitignore
firebase_admin.initialize_app(cred)

def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=403, detail="Authorization header missing")
    token = auth_header.split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
