from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.database import users_collection, resumes_collection
from app.utils.auth import get_current_user
from app.utils.preparation_ai import generate_preparation_plan


router = APIRouter(
    prefix="/api/preparation",
    tags=["Preparation Plan"]
)


# =========================================================
# GENERATE PERSONALIZED PREPARATION PLAN
# =========================================================

@router.post("/generate")
async def generate_plan(
    user_id: str = Depends(get_current_user)
):

    # -----------------------------------------------------
    # GET USER
    # -----------------------------------------------------

    try:
        user = await users_collection.find_one(
            {"_id": ObjectId(user_id)}
        )
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid user ID"
        )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # -----------------------------------------------------
    # GET TARGET ROLE
    # -----------------------------------------------------

    target_role = user.get("target_role")

    if not target_role:
        raise HTTPException(
            status_code=400,
            detail="Target role not set"
        )

    # -----------------------------------------------------
    # GET RESUME
    # -----------------------------------------------------

    resume = await resumes_collection.find_one(
        {"user_id": user_id}
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # -----------------------------------------------------
    # GET RESUME PROFILE
    # -----------------------------------------------------

    profile = resume.get("profile")

    if not profile:
        raise HTTPException(
            status_code=400,
            detail="Resume profile not available"
        )

    # -----------------------------------------------------
    # GET JOB MATCH DATA
    # -----------------------------------------------------

    job_match = resume.get("job_match")

    if job_match:
        missing_skills = job_match.get(
            "missing_skills",
            []
        )
    else:
        missing_skills = []

    # -----------------------------------------------------
    # INTERVIEW WEAKNESSES
    # -----------------------------------------------------

    interview_weaknesses = []

    # We will connect actual interview evaluation
    # data here later.

    # -----------------------------------------------------
    # GENERATE AI PLAN
    # -----------------------------------------------------

    try:

        preparation_plan = generate_preparation_plan(
            profile,
            target_role,
            missing_skills,
            interview_weaknesses
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate preparation plan: {str(e)}"
        )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {
        "message": "Personalized preparation plan generated successfully",
        "target_role": target_role,
        "preparation_plan": preparation_plan
    }