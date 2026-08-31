import os

from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI


load_dotenv()


# =========================================================
# MISTRAL MODEL
# =========================================================

llm = ChatMistralAI(
    model="mistral-small-latest",
    temperature=0.3,
    api_key=os.getenv("MISTRAL_API_KEY")
)


# =========================================================
# GENERATE PERSONALIZED PREPARATION PLAN
# =========================================================

def generate_preparation_plan(
    profile,
    target_role,
    missing_skills,
    interview_weaknesses
):

    prompt = f"""
You are an AI placement preparation assistant.

Create a personalized 30-day preparation plan for a student.

TARGET ROLE:
{target_role}

RESUME PROFILE:
{profile}

MISSING SKILLS FROM JOB MATCHER:
{missing_skills}

INTERVIEW WEAKNESSES:
{interview_weaknesses}

Create a realistic preparation plan based on the student's
actual profile and weaknesses.

The plan must contain:

1. Readiness Score out of 100
2. Main Skill Gaps
3. Week 1
4. Week 2
5. Week 3
6. Week 4
7. Interview Preparation
8. DSA Preparation
9. Technical Preparation

For each week provide clear and actionable tasks.

Do not give generic motivational advice.

Focus on skills that are actually missing or weak.

Return the response in a clean readable format.
"""

    response = llm.invoke(prompt)

    return response.content