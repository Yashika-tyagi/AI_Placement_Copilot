import re


def extract_skills_from_jd(job_description: str):
    """
    Extract common technical skills from the job description.
    """

    common_skills = [
        "python",
        "java",
        "javascript",
        "typescript",
        "c++",
        "c#",
        "react",
        "node.js",
        "express",
        "fastapi",
        "django",
        "flask",
        "mongodb",
        "mysql",
        "postgresql",
        "sql",
        "docker",
        "kubernetes",
        "aws",
        "azure",
        "git",
        "github",
        "html",
        "css",
        "tailwind",
        "machine learning",
        "deep learning",
        "tensorflow",
        "pytorch",
        "langchain",
        "rest api",
    ]

    jd_lower = job_description.lower()

    found_skills = []

    for skill in common_skills:

        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, jd_lower):
            found_skills.append(skill)

    return found_skills


def calculate_job_match(resume_profile, job_description):
    """
    Compare resume skills with skills found in the job description.
    """

    resume_skills = resume_profile.get("skills", [])

    resume_skills_lower = [
        skill.lower()
        for skill in resume_skills
    ]

    job_skills = extract_skills_from_jd(
        job_description
    )

    matching_skills = []
    missing_skills = []

    for skill in job_skills:

        if skill in resume_skills_lower:
            matching_skills.append(skill)

        else:
            missing_skills.append(skill)

    if len(job_skills) == 0:
        match_score = 0

    else:
        match_score = round(
            (len(matching_skills) / len(job_skills)) * 100
        )

    return {
        "match_score": match_score,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "job_skills": job_skills
    }