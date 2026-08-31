
def calculate_resume_score(profile: dict):

    # -------------------------
    # SKILLS - 20 POINTS
    # -------------------------

    skills = profile.get("skills", [])

    if len(skills) >= 8:
        skills_score = 20
    elif len(skills) >= 5:
        skills_score = 15
    elif len(skills) >= 3:
        skills_score = 10
    elif len(skills) >= 1:
        skills_score = 5
    else:
        skills_score = 0


    # -------------------------
    # EDUCATION - 15 POINTS
    # -------------------------

    education = profile.get("education", [])

    education_score = 15 if education else 0


    # -------------------------
    # PROJECTS - 25 POINTS
    # -------------------------

    projects = profile.get("projects", [])

    if len(projects) >= 3:
        projects_score = 25
    elif len(projects) == 2:
        projects_score = 20
    elif len(projects) == 1:
        projects_score = 10
    else:
        projects_score = 0


    # -------------------------
    # EXPERIENCE - 20 POINTS
    # -------------------------

    experience = profile.get("experience", [])

    experience_score = 20 if experience else 0


    # -------------------------
    # PROJECT BULLETS - 10 POINTS
    # -------------------------

    total_bullets = 0

    for project in projects:
        bullets = project.get("bullets", [])
        total_bullets += len(bullets)


    if total_bullets >= 6:
        bullets_score = 10
    elif total_bullets >= 4:
        bullets_score = 8
    elif total_bullets >= 2:
        bullets_score = 5
    elif total_bullets >= 1:
        bullets_score = 2
    else:
        bullets_score = 0


    # -------------------------
    # COMPLETENESS - 10 POINTS
    # -------------------------

    sections_present = 0

    if skills:
        sections_present += 1

    if education:
        sections_present += 1

    if projects:
        sections_present += 1

    if experience:
        sections_present += 1


    if sections_present == 4:
        completeness_score = 10
    elif sections_present == 3:
        completeness_score = 7
    elif sections_present == 2:
        completeness_score = 5
    elif sections_present == 1:
        completeness_score = 2
    else:
        completeness_score = 0


    # -------------------------
    # TOTAL SCORE
    # -------------------------

    total_score = (
        skills_score
        + education_score
        + projects_score
        + experience_score
        + bullets_score
        + completeness_score
    )


    # -------------------------
    # BREAKDOWN
    # -------------------------

    breakdown = {
        "skills": skills_score,
        "education": education_score,
        "projects": projects_score,
        "experience": experience_score,
        "project_bullets": bullets_score,
        "completeness": completeness_score
    }


    return total_score, breakdown


# -------------------------
# TEST
# -------------------------

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
            "B.Tech in CSE (AI)"
        ],

        "projects": [

            {
                "name": "ShopSphere",
                "bullets": [
                    "Developed an e-commerce application.",
                    "Implemented authentication."
                ]
            },

            {
                "name": "RAG Book Assistant",
                "bullets": [
                    "Built a RAG application.",
                    "Implemented semantic search."
                ]
            },

            {
                "name": "Smart Traffic System",
                "bullets": [
                    "Developed AI traffic management.",
                    "Integrated REST APIs."
                ]
            }

        ],

        "experience": []

    }


    score, breakdown = calculate_resume_score(sample_profile)

    print("Resume Score:", score)
    print("Score Breakdown:")

    for category, points in breakdown.items():
        print(f"{category}: {points}")

