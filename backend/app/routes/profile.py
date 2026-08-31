from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.models.profile import StudentProfile, StudentProfileResponse
from app.database import users_collection
from app.utils.auth import get_current_user


router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
)

@router.put("", response_model=StudentProfileResponse)
async def update_profile(
    profile: StudentProfile,
    user_id: str = Depends(get_current_user)
):
    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "target_role": profile.target_role,
                "skills": profile.skills,
                "education": profile.education,
                "projects": profile.projects,
                "experience": profile.experience
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user = await users_collection.find_one(
        {"_id": ObjectId(user_id)}
    )

    return {
        "name": user.get("name"),
        "email": user.get("email"),
        "target_role": user.get("target_role"),
        "skills": user.get("skills", []),
        "education": user.get("education", []),
        "projects": user.get("projects", []),
        "experience": user.get("experience", [])
    }
    
@router.get("", response_model=StudentProfileResponse)
async def get_profile(
    user_id: str = Depends(get_current_user)
):
    user = await users_collection.find_one(
        {"_id": ObjectId(user_id)}
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "name": user.get("name"),
        "email": user.get("email"),
        "target_role": user.get("target_role"),
        "skills": user.get("skills", []),
        "education": user.get("education", []),
        "projects": user.get("projects", []),
        "experience": user.get("experience", [])
    }