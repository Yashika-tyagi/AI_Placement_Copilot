import { useState } from "react";
import ReactMarkdown from "react-markdown";

function Preparation() {
  const [preparationPlan, setPreparationPlan] = useState("");
  const [preparationLoading, setPreparationLoading] = useState(false);
  const [preparationError, setPreparationError] = useState("");

  // =========================
  // GENERATE PREPARATION PLAN
  // =========================

  const handleGeneratePreparationPlan = async () => {
    setPreparationError("");
    setPreparationPlan("");

    const token = localStorage.getItem("token");

    if (!token) {
      setPreparationError("Please login first.");
      return;
    }

    setPreparationLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/preparation/generate",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Preparation Plan response:", data);

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");

          throw new Error(
            "Invalid or expired token. Please login again."
          );
        }

        throw new Error(
          data.detail ||
            "Failed to generate preparation plan."
        );
      }

      setPreparationPlan(
        data.preparation_plan
      );

    } catch (err: any) {
      console.error(
        "PREPARATION PLAN ERROR:",
        err
      );

      setPreparationError(
        err.message ||
          "Something went wrong while generating the preparation plan."
      );

    } finally {
      setPreparationLoading(false);
    }
  };

  return (
    <div className="page">

      {/* =========================
          HEADER
      ========================= */}

      <span className="section-label">
        AI CAREER COACH
      </span>

      <h2>
        Personalized Preparation Plan
      </h2>

      <p>
        Get a customized preparation roadmap based
        on your resume, skills, target role and
        interview performance.
      </p>


      {/* =========================
          GENERATE PLAN
      ========================= */}

      <div className="job-input-card">

        <h3>
          🎯 AI Career Preparation
        </h3>

        <p>
          Generate a personalized roadmap to help
          you prepare for your placement goals.
        </p>

        <button
          className="primary-button"
          onClick={
            handleGeneratePreparationPlan
          }
          disabled={preparationLoading}
        >
          {preparationLoading
            ? "Generating..."
            : "Generate My Preparation Plan"}
        </button>

        {preparationError && (
          <p className="error-message">
            {preparationError}
          </p>
        )}

      </div>


      {/* =========================
          PREPARATION PLAN
      ========================= */}

      {preparationPlan && (
        <div className="preparation-card">

          <div className="preparation-header">

            <span className="section-label">
              AI CAREER ASSISTANT
            </span>

            <h3>
              Personalized Preparation Roadmap
            </h3>

            <p className="preparation-subtitle">
              A customized plan based on your
              profile, skills, target role and
              interview performance.
            </p>

          </div>


          {/* =========================
              MARKDOWN CONTENT
          ========================= */}

          <div className="preparation-content">

            <ReactMarkdown
              components={{

                // =========================
                // TABLE
                // =========================

                table: ({ children }) => (
                  <div className="preparation-table-wrapper">
                    <table className="preparation-table">
                      {children}
                    </table>
                  </div>
                ),

                thead: ({ children }) => (
                  <thead>
                    {children}
                  </thead>
                ),

                tbody: ({ children }) => (
                  <tbody>
                    {children}
                  </tbody>
                ),

                tr: ({ children }) => (
                  <tr>
                    {children}
                  </tr>
                ),

                th: ({ children }) => (
                  <th>
                    {children}
                  </th>
                ),

                td: ({ children }) => (
                  <td>
                    {children}
                  </td>
                ),

              }}
            >
              {preparationPlan}
            </ReactMarkdown>

          </div>

        </div>
      )}

    </div>
  );
}

export default Preparation;