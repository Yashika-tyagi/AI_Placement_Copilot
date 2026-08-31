from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.database import resumes_collection
from app.utils.auth import get_current_user
from app.utils.job_matcher import calculate_job_match
from app.utils.job_match_ai import generate_job_match_explanation

router = APIRouter(
    prefix="/api/job-match",
    tags=["Job Matcher"]
)


# =========================================================
# REQUEST MODEL
# =========================================================

class JobMatchRequest(BaseModel):
    job_description: str


# =========================================================
# MATCH JOB WITH RESUME
# =========================================================

@router.post("")
async def match_job(
    data: JobMatchRequest,
    user_id: str = Depends(get_current_user)
):

    # -----------------------------------------------------
    # GET USER'S RESUME
    # -----------------------------------------------------

    resume = await resumes_collection.find_one(
        {"user_id": user_id}
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found. Please upload your resume first."
        )

    # -----------------------------------------------------
    # GET PARSED RESUME PROFILE
    # -----------------------------------------------------

    profile = resume.get(
        "profile",
        {
            "skills": [],
            "education": [],
            "projects": [],
            "experience": []
        }
    )

    # -----------------------------------------------------
    # CALCULATE MATCH
    # -----------------------------------------------------

    result = calculate_job_match(
        profile,
        data.job_description
    )
    ai_explanation = generate_job_match_explanation(
    profile,
    data.job_description,
    result["match_score"],
    result["matching_skills"],
    result["missing_skills"]
)
    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {
    "message": "Job matched successfully",
    "match_score": result["match_score"],
    "matching_skills": result["matching_skills"],
    "missing_skills": result["missing_skills"],
    "job_skills": result["job_skills"],
    "ai_explanation": ai_explanation
}