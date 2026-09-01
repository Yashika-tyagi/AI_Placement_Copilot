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

    prompt = prompt = f"""
You are an AI career preparation assistant.

Create a personalized preparation plan for the student based on:
- Resume/profile
- Skills
- Target role
- Interview performance

IMPORTANT OUTPUT FORMAT:

Generate the plan in Markdown.

Divide the plan into multiple weeks.

For EVERY week, create a separate Markdown table.

Each table MUST have exactly these columns:

| Day | Task | Resource | Output |
|-----|------|----------|--------|

Example format:

## Week 1

| Day | Task | Resource | Output |
|-----|------|----------|--------|
| Day 1 | Learn Arrays and Sliding Window | LeetCode | Solve 5 problems |
| Day 2 | Practice Two Pointers | LeetCode | Solve 5 problems |
| Day 3 | Learn Hashing | LeetCode | Solve 5 problems |

## Week 2

| Day | Task | Resource | Output |
|-----|------|----------|--------|
| Day 1 | Learn System Design Basics | Grokking System Design | Prepare notes |
| Day 2 | Learn Database Design | MongoDB Documentation | Practice queries |
| Day 3 | Learn Caching | Redis Documentation | Implement caching |

RULES:
1. Every week MUST have its own table.
2. Use exactly four columns: Day, Task, Resource, Output.
3. Do NOT use bullet points for daily tasks.
4. Do NOT create separate headings for Day 1, Day 2, etc.
5. Use Markdown tables for all weekly schedules.
6. Make the plan personalized to the student's profile.
7. Include practical tasks and resources.
8. Keep the plan realistic and actionable.
9. Generate multiple weeks according to the student's preparation needs.

Student Profile:
{profile}

Target Role:
{target_role}

Interview Weaknesses:
{interview_weaknesses}
"""

    response = llm.invoke(prompt)

    return response.content