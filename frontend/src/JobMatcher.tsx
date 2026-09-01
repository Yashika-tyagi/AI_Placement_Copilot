import { useState } from "react";

function JobMatcher() {
  const [jobDescription, setJobDescription] = useState("");
  const [jobMatchResult, setJobMatchResult] = useState<any>(null);
  const [jobMatchLoading, setJobMatchLoading] = useState(false);
  const [jobMatchError, setJobMatchError] = useState("");

  const handleJobMatch = async () => {
    setJobMatchError("");
    setJobMatchResult(null);

    if (!jobDescription.trim()) {
      setJobMatchError("Please enter a job description.");
      return;
    }

    setJobMatchLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setJobMatchError("Please login first.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/job-match`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            job_description: jobDescription,
          }),
        }
      );

      const data = await response.json();

      console.log("Job Match response:", data);

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
          data.detail || "Job matching failed."
        );
      }

      setJobMatchResult(data);

    } catch (err: any) {
      console.error("JOB MATCH ERROR:", err);

      setJobMatchError(
        err.message ||
          "Something went wrong while matching the job."
      );

    } finally {
      setJobMatchLoading(false);
    }
  };

  return (
    <div className="page">

      {/* =========================
          HEADER
      ========================= */}

      <span className="section-label">
        CAREER TOOLS
      </span>

      <h2>Job Matcher</h2>

      <p>
        Compare your resume with a job description
        and identify your strengths and skill gaps.
      </p>


      {/* =========================
          JOB DESCRIPTION
      ========================= */}

      <div className="job-input-card">

        <h3>💼 Target Job Description</h3>

        <p>
          Paste the job description of the role
          you want to apply for.
        </p>

        <textarea
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(e.target.value)
          }
          rows={12}
        />

        <button
          className="primary-button"
          onClick={handleJobMatch}
          disabled={jobMatchLoading}
        >
          {jobMatchLoading
            ? "Matching..."
            : "Match My Resume"}
        </button>

        {jobMatchError && (
          <p className="error-message">
            {jobMatchError}
          </p>
        )}

      </div>


      {/* =========================
          RESULTS
      ========================= */}

      {jobMatchResult && (
        <div className="job-match-results">

          {/* MATCH SCORE */}

          <div className="match-score-card">

            <span className="section-label">
              RESUME MATCH
            </span>

            <h3>Match Score</h3>

            <div className="match-score">
              {jobMatchResult.match_score}%
            </div>

            <p>
              Compatibility between your resume
              and this job description.
            </p>

          </div>


          {/* JOB SKILLS */}

          <div className="card">

            <h3>📋 Job Skills Detected</h3>

            {jobMatchResult.job_skills?.length > 0 ? (
              <ul>

                {jobMatchResult.job_skills.map(
                  (
                    skill: string,
                    index: number
                  ) => (
                    <li key={index}>
                      {skill}
                    </li>
                  )
                )}

              </ul>
            ) : (
              <p>
                No skills detected from the job description.
              </p>
            )}

          </div>


          {/* MATCHING SKILLS */}

          <div className="card">

            <h3>✅ Matching Skills</h3>

            {jobMatchResult.matching_skills
              ?.length > 0 ? (

              <ul>

                {jobMatchResult.matching_skills.map(
                  (
                    skill: string,
                    index: number
                  ) => (
                    <li key={index}>
                      {skill}
                    </li>
                  )
                )}

              </ul>

            ) : (
              <p>
                No matching skills found.
              </p>
            )}

          </div>


          {/* MISSING SKILLS */}

          <div className="card">

            <h3>⚠️ Missing Skills</h3>

            {jobMatchResult.missing_skills
              ?.length > 0 ? (

              <ul>

                {jobMatchResult.missing_skills.map(
                  (
                    skill: string,
                    index: number
                  ) => (
                    <li key={index}>
                      {skill}
                    </li>
                  )
                )}

              </ul>

            ) : (
              <p>
                No major skill gaps found.
              </p>
            )}

          </div>


          {/* AI EXPLANATION */}

          <div className="card ai-explanation-card">

            <h3>🤖 AI Explanation</h3>

            {jobMatchResult.ai_explanation ? (

              <p
                style={{
                  whiteSpace: "pre-line",
                }}
              >
                {jobMatchResult.ai_explanation}
              </p>

            ) : (
              <p>
                No AI explanation available.
              </p>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default JobMatcher;