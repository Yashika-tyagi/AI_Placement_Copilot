import { useState } from "react";

function Interview() {
  const [interviewQuestion, setInterviewQuestion] = useState("");
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewEvaluation, setInterviewEvaluation] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [interviewError, setInterviewError] = useState("");

  // =========================
  // GENERATE QUESTION
  // =========================

  const handleGenerateQuestion = async () => {
    setInterviewError("");
    setInterviewEvaluation("");
    setInterviewAnswer("");
    setInterviewQuestion("");

    const token = localStorage.getItem("token");

    if (!token) {
      setInterviewError("Please login first.");
      return;
    }

    setInterviewLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/interview/question",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to generate interview question."
        );
      }

      setInterviewQuestion(data.question);
    } catch (err: any) {
      console.error("INTERVIEW QUESTION ERROR:", err);

      setInterviewError(
        err.message ||
          "Something went wrong while generating the question."
      );
    } finally {
      setInterviewLoading(false);
    }
  };

  // =========================
  // EVALUATE ANSWER
  // =========================

  const handleEvaluateAnswer = async () => {
    setInterviewError("");

    if (!interviewQuestion) {
      setInterviewError(
        "Please generate an interview question first."
      );
      return;
    }

    if (!interviewAnswer.trim()) {
      setInterviewError("Please write your answer first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setInterviewError("Please login first.");
      return;
    }

    setEvaluationLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/interview/evaluate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            question: interviewQuestion,
            answer: interviewAnswer,
          }),
        }
      );

      const data = await response.json();

      console.log("Interview evaluation:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to evaluate answer."
        );
      }

      setInterviewEvaluation(data.evaluation);
    } catch (err: any) {
      console.error("INTERVIEW EVALUATION ERROR:", err);

      setInterviewError(
        err.message ||
          "Something went wrong while evaluating your answer."
      );
    } finally {
      setEvaluationLoading(false);
    }
  };

  return (
    <div className="page">

      {/* =========================
          HEADER
      ========================= */}

      <span className="section-label">
        AI INTERVIEW COACH
      </span>

      <h2>Interview Copilot</h2>

      <p>
        Practice interview questions and get AI-powered
        feedback to improve your interview performance.
      </p>

      {/* =========================
          GENERATE QUESTION
      ========================= */}

      <div className="job-input-card">

        <h3>🎤 AI Interview Practice</h3>

        <p>
          Generate an interview question based on your
          resume and practice answering it.
        </p>

        <button
          className="primary-button"
          onClick={handleGenerateQuestion}
          disabled={interviewLoading}
        >
          {interviewLoading
            ? "Generating..."
            : "Generate Interview Question"}
        </button>

        {interviewError && (
          <p className="error-message">
            {interviewError}
          </p>
        )}

      </div>

      {/* =========================
          QUESTION + ANSWER
      ========================= */}

      {interviewQuestion && (
        <div className="job-match-results">

          {/* QUESTION */}

          <div className="card">

            <span className="section-label">
              INTERVIEW QUESTION
            </span>

            <h3>
              {interviewQuestion}
            </h3>

          </div>

          {/* ANSWER */}

          <div className="card">

            <h3>✍️ Your Answer</h3>

            <p>
              Write your answer as if you are speaking
              directly to the interviewer.
            </p>

            <textarea
              placeholder="Write your interview answer here..."
              value={interviewAnswer}
              onChange={(e) =>
                setInterviewAnswer(e.target.value)
              }
              rows={10}
            />

            <button
              className="primary-button"
              onClick={handleEvaluateAnswer}
              disabled={evaluationLoading}
            >
              {evaluationLoading
                ? "Evaluating..."
                : "Evaluate My Answer"}
            </button>

          </div>

          {/* ERROR */}

          {interviewError && (
            <div className="card">

              <p className="error-message">
                {interviewError}
              </p>

            </div>
          )}

          {/* =========================
              AI EVALUATION
          ========================= */}

          {interviewEvaluation && (
            <div className="card ai-explanation-card">

              <span className="section-label">
                AI FEEDBACK
              </span>

              <h3>
                🤖 Interview Evaluation
              </h3>

              <div className="evaluation-content">
                {interviewEvaluation}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Interview;