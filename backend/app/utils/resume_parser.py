import re


def parse_resume(text: str) -> dict:
    skills = []
    education = []
    projects = []
    experience = []

    lines = text.splitlines()

    current_section = None

    current_project = None
    project_list = []

    # Skill category headings
    skill_categories = {
        "languages",
        "core cs",
        "web development",
        "databases",
        "tools"
    }

    # -------------------------
    # HELPER: PROJECT DATE
    # -------------------------

    def is_project_date(line):
        return bool(
        re.match(
            r"^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}$",
            line,
            re.IGNORECASE
        )
    )

    # -------------------------
    # PROCESS EACH LINE
    # -------------------------

    for line in lines:

        line = line.strip()

        if not line:
            continue

        lower_line = line.lower()

        # -------------------------
        # SECTION DETECTION
        # -------------------------

        if (
            "technical skills" in lower_line
            or lower_line == "skills"
            or "technical proficiency" in lower_line
        ):
            current_section = "skills"
            continue

        if (
            "education" in lower_line
            or "academic background" in lower_line
        ):
            current_section = "education"
            continue

        if (
            lower_line == "projects"
            or "projects & achievements" in lower_line
        ):
            current_section = "projects"
            continue

        if (
            "experience" in lower_line
            or "internship" in lower_line
            or "work history" in lower_line
        ):
            current_section = "experience"
            continue

        # -------------------------
        # STOP CURRENT SECTION
        # -------------------------

        if (
            "achievements" in lower_line
            or "certifications" in lower_line
            or "professional summary" in lower_line
        ):
            current_section = None
            continue

        # -------------------------
        # SKILLS
        # -------------------------

        if current_section == "skills":

            # Category ko actual skill mat banao
            if lower_line in skill_categories:
                continue

            if "," in line:

                skills.extend(
                    skill.strip()
                    for skill in line.split(",")
                    if skill.strip()
                )

            else:
                skills.append(line)

        # -------------------------
        # EDUCATION
        # -------------------------

        elif current_section == "education":

            education.append(line)

        # -------------------------
        # PROJECTS
        # -------------------------

        elif current_section == "projects":

            # -------------------------
            # BULLET
            # -------------------------

            if line.startswith("•"):

                if current_project is not None:
                    current_project["bullets"].append(line)

            # -------------------------
            # DATE
            # -------------------------

            elif is_project_date(line):

                if current_project is not None:
                    current_project["date"] = line

            # -------------------------
            # NON-BULLET LINE
            # -------------------------

            else:

                # If we already have a project
                # and it has bullets, this line
                # could be a new project name OR
                # continuation of the previous bullet.

                if (
                    current_project is not None
                    and current_project["bullets"]
                ):

                    # A line ending with punctuation
                    # is most likely a wrapped bullet.
                    if line.endswith((".", ",", ";", ":")):

                        current_project["bullets"][-1] += " " + line

                    # Short continuation such as:
                    # "authorization"
                    elif len(line.split()) <= 2:

                        current_project["bullets"][-1] += " " + line

                    else:
                        # Treat as new project
                        project_list.append(current_project)

                        current_project = {
                            "name": line,
                            "date": "",
                            "bullets": []
                        }

                else:

                    # First project
                    current_project = {
                        "name": line,
                        "date": "",
                        "bullets": []
                    }

        # -------------------------
        # EXPERIENCE
        # -------------------------

        elif current_section == "experience":

            experience.append(line)

    # -------------------------
    # ADD LAST PROJECT
    # -------------------------

    if current_project is not None:
        project_list.append(current_project)

    projects = project_list

    # -------------------------
    # RETURN
    # -------------------------

    return {
        "skills": skills,
        "education": education,
        "projects": projects,
        "experience": experience
    }


# -------------------------
# TEST
# -------------------------

if __name__ == "__main__":

    sample_text = """
    Education
    B.Tech in CSE (AI), CGPA: 8.3

    Technical Skills
    Languages
    C++, JavaScript, TypeScript, SQL
    Core CS
    Data Structures and Algorithms, OOP
    Web Development
    React, Node.js, MongoDB
    Tools
    Git, GitHub

    Projects
    AI Placement Copilot
    June 2026
    • Built an AI career assistant using FastAPI and MongoDB.
    • Implemented resume analysis and interview preparation.

    ShopSphere E-Commerce Website
    June 2026
    • Developed a full stack application using React and Node.js.
    • Implemented product management and authentication.

    Experience
    Full Stack Intern
    """

    result = parse_resume(sample_text)

    print(result)