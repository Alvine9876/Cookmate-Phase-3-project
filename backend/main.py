from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
import firebase_admin
from firebase_admin import auth, credentials
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase Admin SDK
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
})

firebase_admin.initialize_app(cred)

app = FastAPI()

# Models
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/register", response_model=Token)
async def register(user: UserCreate):
    try:
        # Create user in Firebase
        user_record = auth.create_user(
            email=user.email,
            password=user.password
        )
        
        # Get custom token for immediate login
        custom_token = auth.create_custom_token(user_record.uid)
        
        return {"access_token": custom_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.post("/login", response_model=Token)
async def login(user: UserLogin):
    try:
        # This would normally be handled by Firebase client SDK in frontend
        # Here we're simulating the token generation
        user_record = auth.get_user_by_email(user.email)
        
        # In a real scenario, you would verify the password here
        # But with Firebase, password verification happens on the client side
        
        # Generate a custom token
        custom_token = auth.create_custom_token(user_record.uid)
        
        return {"access_token": custom_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/google-login", response_model=Token)
async def google_login(id_token: str):
    try:
        # Verify the Google ID token
        decoded_token = auth.verify_id_token(id_token)
        
        # Get user record
        user_record = auth.get_user(decoded_token['uid'])
        
        # Generate a custom token
        custom_token = auth.create_custom_token(user_record.uid)
        
        return {"access_token": custom_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    return {
        "message": "You have accessed a protected route",
        "user_id": current_user['uid'],
        "email": current_user.get('email')
    }