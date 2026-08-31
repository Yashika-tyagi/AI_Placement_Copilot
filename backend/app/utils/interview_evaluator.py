from app.utils.ai_suggestions import llm


# =========================================================
# EVALUATE INTERVIEW ANSWER
# =========================================================

def evaluate_interview_answer(
    question: str,
    answer: str,
    target_role: str
) -> str:

    prompt = f"""
You are an AI placement interviewer.

Evaluate the student's answer to the interview question.

Target Role:
{target_role}

Interview Question:
{question}

Student Answer:
{answer}

Evaluate the answer using these criteria:

1. Technical Accuracy
2. Clarity
3. Completeness

Give a score out of 10 for each criterion.

Then provide:

Overall Score:
Calculate an overall score out of 10.

Strengths:
- Mention 2-3 things the student did well.

Areas to Improve:
- Mention 2-3 specific weaknesses.

Feedback:
- Give concise and practical interview feedback.

Better Answer:
- Provide an improved version of the answer.
- Do not invent experience or achievements.
- Keep it appropriate for a student interview.

Return the evaluation in this exact format:

Technical Accuracy: X/10
Clarity: X/10
Completeness: X/10
Overall Score: X/10

Strengths:
- ...

Areas to Improve:
- ...

Feedback:
...

Better Answer:
...
"""

    response = llm.invoke(prompt)

    return response.content.strip()