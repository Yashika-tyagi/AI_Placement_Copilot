
from pydantic import BaseModel, Field
from typing import List


class ResumeProfile(BaseModel):

    skills: List[str] = Field(
        default_factory=list
    )

    education: List[str] = Field(
        default_factory=list
    )

    projects: List[str] = Field(
        default_factory=list
    )

    experience: List[str] = Field(
        default_factory=list
    )


class ResumeResponse(BaseModel):

    resume_id: str

    filename: str

    file_path: str

    text: str

    profile: ResumeProfile

    score: int

    score_breakdown: dict

    missing_sections: list[str]

    weak_bullets: list[str]

    suggestions: list[str]

    overall_feedback: str

