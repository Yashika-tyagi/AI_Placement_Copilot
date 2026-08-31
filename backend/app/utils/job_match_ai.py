from app.utils.ai_suggestions import llm


# =========================================================
# GENERATE JOB MATCH EXPLANATION
# =========================================================

def generate_job_match_explanation(
    resume_profile: dict,
    job_description: str,
    match_score: int,
    matching_skills: list[str],
    missing_skills: list[str]
) -> str:

    prompt = f"""
Analyze how well the student's resume matches the given job description.

Resume Skills:
{resume_profile.get("skills", [])}

Job Description:
{job_description}

Match Score:
{match_score}/100

Matching Skills:
{matching_skills}

Missing Skills:
{missing_skills}

Provide a concise explanation in this format:

Overall Assessment:
- Explain how well the resume matches the job.

Strengths:
- Mention 2-3 strengths based only on the matching skills.

Skill Gaps:
- Mention the most important missing skills.

Recommendations:
- Give 2-3 practical suggestions for improving the candidate's
  preparation for this job.

Do not invent skills, experience, achievements, technologies,
numbers, or qualifications that are not present in the provided data.
Keep the response concise and useful for placement preparation.
"""

    response = llm.invoke(prompt)

    return response.content.strip()