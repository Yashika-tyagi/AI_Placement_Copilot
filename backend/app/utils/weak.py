
def detect_weak_bullets(bullets: list[str]) -> list[str]:

    weak_bullets = []

    weak_phrases = [
        "worked on",
        "helped with",
        "responsible for",
        "built a website",
        "made a website"
    ]

    for bullet in bullets:

        clean_bullet = bullet.lstrip("•").strip()
        lower_bullet = clean_bullet.lower()

        words = clean_bullet.split()

        # Rule 1:
        # Very short AND vague bullet
        if len(words) < 8:

            vague_words = [
                "built",
                "made",
                "worked",
                "helped",
                "did"
            ]

            if any(word in lower_bullet for word in vague_words):
                weak_bullets.append(bullet)
                continue

        # Rule 2:
        # Generic / weak phrases
        for phrase in weak_phrases:

            if phrase in lower_bullet:
                weak_bullets.append(bullet)
                break

    return weak_bullets


if __name__ == "__main__":

    test_bullets = [
        "• Built a website.",
        "• Worked on a React project for college.",
        "• Integrated SUMO, ESP32-CAM, REST APIs and WebSockets.",
        "• Implemented JWT authentication and role-based authorization for secure user access."
    ]

    result = detect_weak_bullets(test_bullets)

    print(result)

