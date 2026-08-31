from app.utils.ai_suggestions import llm


# =========================================================
# GENERATE ONE INTERVIEW QUESTION
# =========================================================

def generate_interview_question(
    profile: dict,
    target_role: str
) -> str:

    prompt = f"""
You are an AI placement interviewer.

Generate ONE interview question for a student based on
their resume and target role.

Target Role:
{target_role}

Skills:
{profile.get("skills", [])}

Education:
{profile.get("education", [])}

Projects:
{profile.get("projects", [])}

Experience:
{profile.get("experience", [])}

Rules:
- Ask only ONE question.
- Make the question relevant to the target role.
- Prefer questions based on the candidate's actual skills or projects.
- Do not invent experience or technologies.
- The question can be technical or project-based.
- Keep it concise.
- Return ONLY the interview question.
"""

    response = llm.invoke(prompt)

    return response.content.strip()