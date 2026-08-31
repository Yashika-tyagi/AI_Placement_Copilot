from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from bson import ObjectId

from app.database import users_collection, resumes_collection
from app.utils.auth import get_current_user
from app.utils.interview_ai import generate_interview_question
from app.utils.interview_evaluator import evaluate_interview_answer


router = APIRouter(
    prefix="/api/interview",
    tags=["Interview Copilot"]
)


# =========================================================
# REQUEST MODEL
# =========================================================

class InterviewAnswer(BaseModel):
    question: str
    answer: str


# =========================================================
# GENERATE INTERVIEW QUESTION
# =========================================================

@router.get("/question")
async def get_interview_question(
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
    # GENERATE QUESTION USING AI
    # -----------------------------------------------------

    try:
        question = generate_interview_question(
            profile,
            target_role
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate interview question: {str(e)}"
        )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {
        "message": "Interview question generated successfully",
        "target_role": target_role,
        "question": question
    }


# =========================================================
# EVALUATE INTERVIEW ANSWER
# =========================================================

@router.post("/evaluate")
async def evaluate_answer(
    data: InterviewAnswer,
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
    # VALIDATE QUESTION
    # -----------------------------------------------------

    if not data.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    # -----------------------------------------------------
    # VALIDATE ANSWER
    # -----------------------------------------------------

    if not data.answer.strip():
        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty"
        )

    # -----------------------------------------------------
    # EVALUATE ANSWER USING AI
    # -----------------------------------------------------

    try:
        evaluation = evaluate_interview_answer(
            data.question,
            data.answer,
            target_role
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to evaluate interview answer: {str(e)}"
        )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {
        "message": "Interview answer evaluated successfully",
        "target_role": target_role,
        "question": data.question,
        "answer": data.answer,
        "evaluation": evaluation
    }