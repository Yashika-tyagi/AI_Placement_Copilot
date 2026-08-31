import os

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException

from app.models.resume import ResumeResponse
from app.database import resumes_collection
from app.utils.auth import get_current_user
from app.utils.resume_parser import parse_resume
from app.utils.pdf import extract_text_from_pdf
from app.utils.resume_score import calculate_resume_score
from app.utils.missingSections import detect_missing_sections
from app.utils.weak import detect_weak_bullets
from app.utils.ai_suggestions import (
    improve_bullet,
    generate_resume_feedback
)


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"]
)


# =========================================================
# UPLOAD RESUME
# =========================================================

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):

    # Check PDF
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # Read file
    contents = await file.read()

    # Create uploads directory
    os.makedirs("uploads", exist_ok=True)

    # Create file path
    file_path = os.path.join(
        "uploads",
        file.filename
    )

    # Save PDF
    with open(file_path, "wb") as f:
        f.write(contents)

    # -----------------------------------------------------
    # EXTRACT TEXT
    # -----------------------------------------------------

    text = extract_text_from_pdf(file_path)

    # -----------------------------------------------------
    # PARSE RESUME
    # -----------------------------------------------------

    profile = parse_resume(text)

    # -----------------------------------------------------
    # CALCULATE SCORE + BREAKDOWN
    # -----------------------------------------------------

    score, breakdown = calculate_resume_score(profile)

    # -----------------------------------------------------
    # MISSING SECTIONS
    # -----------------------------------------------------

    missing_sections = detect_missing_sections(profile)

    # -----------------------------------------------------
    # GET PROJECT BULLETS
    # -----------------------------------------------------

    bullets = []

    for project in profile.get("projects", []):
        bullets.extend(
            project.get("bullets", [])
        )

    # -----------------------------------------------------
    # DETECT WEAK BULLETS
    # -----------------------------------------------------

    weak_bullets = detect_weak_bullets(
        bullets
    )

    # -----------------------------------------------------
    # AI IMPROVED BULLET SUGGESTIONS
    # -----------------------------------------------------

    suggestions = []

    for bullet in weak_bullets:

        suggestion = improve_bullet(
            bullet
        )

        suggestions.append(
            suggestion
        )

    # -----------------------------------------------------
    # OVERALL AI FEEDBACK
    # -----------------------------------------------------

    overall_feedback = generate_resume_feedback(
        profile,
        score,
        missing_sections,
        weak_bullets
    )

    # -----------------------------------------------------
    # STORE IN MONGODB
    # -----------------------------------------------------

    resume_document = {
        "user_id": user_id,
        "filename": file.filename,
        "file_path": file_path,
        "text": text,
        "profile": profile,
        "score": score,
        "score_breakdown": breakdown,
        "suggestions": suggestions,
        "overall_feedback": overall_feedback
    }

    await resumes_collection.update_one(
        {"user_id": user_id},
        {"$set": resume_document},
        upsert=True
    )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {
        "message": "Resume uploaded and processed successfully",
        "filename": file.filename,
        "user_id": user_id,
        "profile": profile,
        "score": score,
        "score_breakdown": breakdown,
        "missing_sections": missing_sections,
        "weak_bullets": weak_bullets,
        "suggestions": suggestions,
        "overall_feedback": overall_feedback
    }


# =========================================================
# GET RESUME
# =========================================================

@router.get("/", response_model=ResumeResponse)
async def get_resume(
    user_id: str = Depends(get_current_user)
):

    # Find logged-in user's resume
    resume = await resumes_collection.find_one(
        {"user_id": user_id}
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # -----------------------------------------------------
    # GET PROFILE
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
    # SCORE + BREAKDOWN
    # -----------------------------------------------------

    score, breakdown = calculate_resume_score(
        profile
    )

    # -----------------------------------------------------
    # MISSING SECTIONS
    # -----------------------------------------------------

    missing_sections = detect_missing_sections(
        profile
    )

    # -----------------------------------------------------
    # GET PROJECT BULLETS
    # -----------------------------------------------------

    bullets = []

    for project in profile.get("projects", []):
        bullets.extend(
            project.get("bullets", [])
        )

    # -----------------------------------------------------
    # WEAK BULLETS
    # -----------------------------------------------------

    weak_bullets = detect_weak_bullets(
        bullets
    )

    # -----------------------------------------------------
    # AI SUGGESTIONS
    # -----------------------------------------------------

    suggestions = []

    for bullet in weak_bullets:

        suggestion = improve_bullet(
            bullet
        )

        suggestions.append(
            suggestion
        )

    # -----------------------------------------------------
    # OVERALL AI FEEDBACK
    # -----------------------------------------------------

    overall_feedback = generate_resume_feedback(
        profile,
        score,
        missing_sections,
        weak_bullets
    )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {
        "resume_id": str(resume["_id"]),
        "filename": resume["filename"],
        "file_path": resume["file_path"],
        "text": resume["text"],
        "profile": profile,
        "score": score,
        "score_breakdown": breakdown,
        "missing_sections": missing_sections,
        "weak_bullets": weak_bullets,
        "suggestions": suggestions,
        "overall_feedback": overall_feedback
    }

