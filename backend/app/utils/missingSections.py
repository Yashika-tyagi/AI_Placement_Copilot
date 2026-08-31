def detect_missing_sections(profile: dict) -> list[str]:
    missing_sections = []

    required_sections = [
        "skills",
        "education",
        "projects",
        "experience"
    ]

    for section in required_sections:
        if not profile.get(section):
            missing_sections.append(section)

    return missing_sections


if __name__ == "__main__":
    test_profile = {
        "skills": ["C++", "React"],
        "education": ["B.Tech"],
        "projects": ["ShopSphere"],
        "experience": []
    }

    result = detect_missing_sections(test_profile)

    print(result)