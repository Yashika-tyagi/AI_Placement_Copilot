from pydantic import BaseModel,Field
from typing import Optional, List


class StudentProfile(BaseModel):
    target_role: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    education: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)


class StudentProfileResponse(BaseModel):
    name: str
    email: str
    target_role: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    education: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)