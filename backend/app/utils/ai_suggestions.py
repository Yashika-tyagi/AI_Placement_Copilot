
import os

from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI


# Load variables from .env
load_dotenv()


# Create Mistral model
llm = ChatMistralAI(
    model="mistral-small-2506",
    api_key=os.getenv("MISTRAL_API_KEY")
)


# -------------------------------------------------
# IMPROVE ONE WEAK BULLET
# -------------------------------------------------

def improve_bullet(bullet: str) -> str:

    prompt = f"""
Improve the following resume bullet point.

Make it:
- professional
- concise
- action-oriented
- specific
- suitable for a software developer resume

Do not invent achievements, technologies, numbers, or results.

Original bullet:
{bullet}

Return only the improved bullet point.
"""

    response = llm.invoke(prompt)

    return response.content.strip()


# -------------------------------------------------
# GENERATE OVERALL RESUME FEEDBACK
# -------------------------------------------------

def generate_resume_feedback(
    profile: dict,
    score: int,
    missing_sections: list[str],
    weak_bullets: list[str]
) -> str:

    prompt = f"""
Analyze the following resume information and provide concise
overall feedback for a software developer student.

Resume Score:
{score}/100

Skills:
{profile.get("skills", [])}

Education:
{profile.get("education", [])}

Projects:
{profile.get("projects", [])}

Experience:
{profile.get("experience", [])}

Missing Sections:
{missing_sections}

Weak Bullets:
{weak_bullets}

Give feedback in this format:

Strengths:
- Mention 2-3 strong points.

Areas to Improve:
- Mention 2-3 important weaknesses.

Recommendations:
- Give 2-3 practical suggestions.

Do not invent information that is not present in the resume.
Keep the feedback concise and useful for placement preparation.
"""

    response = llm.invoke(prompt)

    return response.content.strip()


# -------------------------------------------------
# TEST
# -------------------------------------------------

if __name__ == "__main__":

    sample_profile = {
        "skills": [
            "C++",
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "MongoDB"
        ],
        "education": [
            "B.Tech in CSE (AI), CGPA: 8.3"
        ],
        "projects": [
            {
                "name": "AI Placement Copilot",
                "date": "June 2026",
                "bullets": [
                    "• Built an AI career assistant using FastAPI and MongoDB."
                ]
            }
        ],
        "experience": []
    }

    sample_score = 75

    sample_missing_sections = [
        "experience"
    ]

    sample_weak_bullets = [
        "• Built a website."
    ]

    print("\n--- BULLET IMPROVEMENT ---")

    improved = improve_bullet(
        sample_weak_bullets[0]
    )

    print(improved)


    print("\n--- OVERALL RESUME FEEDBACK ---")

    feedback = generate_resume_feedback(
        sample_profile,
        sample_score,
        sample_missing_sections,
        sample_weak_bullets
    )

    print(feedback)

