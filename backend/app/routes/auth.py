from fastapi import APIRouter, HTTPException, Depends
from app.models.user import UserCreate, UserLogin
from app.database import users_collection
from app.utils.password import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.utils.auth import get_current_user





router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/register")
async def register_user(user: UserCreate):

    existing_user = await users_collection.find_one({
        "email": user.email
    })

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(user.password)

    user_document = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "target_role": user.target_role
    }

    result = await users_collection.insert_one(user_document)

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }


@router.post("/login")
async def login_user(user: UserLogin):

    # Find user by email
    existing_user = await users_collection.find_one({
        "email": user.email
    })

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    password_correct = verify_password(
        user.password,
        existing_user["password"]
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT
    access_token = create_access_token({
        "user_id": str(existing_user["_id"])
    })

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }
    
@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user)):
    return {
        "message": "You are authenticated",
        "user_id": user_id
    }