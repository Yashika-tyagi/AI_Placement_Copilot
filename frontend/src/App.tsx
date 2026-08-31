import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

function App() {
  // =========================================================
  // LOGIN STATES
  // =========================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [loginError, setLoginError] = useState("");

  // =========================================================
  // RESUME STATES
  // =========================================================

  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // JOB MATCHER STATES
  // =========================================================

  const [jobDescription, setJobDescription] = useState("");
  const [jobMatchResult, setJobMatchResult] = useState<any>(null);
  const [jobMatchLoading, setJobMatchLoading] = useState(false);
  const [jobMatchError, setJobMatchError] = useState("");

  // =========================================================
  // INTERVIEW COPILOT STATES
  // =========================================================

  const [interviewQuestion, setInterviewQuestion] = useState("");
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewEvaluation, setInterviewEvaluation] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [interviewError, setInterviewError] = useState("");

  // =========================================================
  // PREPARATION PLAN STATES
  // =========================================================

  const [preparationPlan, setPreparationPlan] = useState("");
  const [preparationLoading, setPreparationLoading] = useState(false);
  const [preparationError, setPreparationError] = useState("");

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async () => {
    setLoginError("");

    if (!email || !password) {
      setLoginError("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        setLoginError(data.detail || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.access_token);

      setLoggedIn(true);
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setLoginError("Unable to connect to backend.");
    }
  };

  // =========================================================
  // SELECT FILE
  // =========================================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0] || null;

    setFile(selectedFile);
    setResult(null);
    setError("");
  };

  // =========================================================
  // UPLOAD RESUME
  // =========================================================

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoggedIn(false);
        setError("Please login first.");
        return;
      }

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/api/resume/upload",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      console.log("Resume response:", data);

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");

          setLoggedIn(false);

          throw new Error(
            "Invalid or expired token. Please login again."
          );
        }

        throw new Error(
          data.detail || "Resume upload failed."
        );
      }

      setResult(data);
    } catch (err: any) {
      console.error("RESUME UPLOAD ERROR:", err);

      setError(
        err.message ||
          "Something went wrong while analyzing the resume."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // JOB MATCHER
  // =========================================================

  const handleJobMatch = async () => {
    setJobMatchError("");
    setJobMatchResult(null);

    if (!jobDescription.trim()) {
      setJobMatchError(
        "Please enter a job description."
      );

      return;
    }

    setJobMatchLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoggedIn(false);

        setJobMatchError("Please login first.");

        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/job-match",
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

          setLoggedIn(false);

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

  // =========================================================
  // GENERATE INTERVIEW QUESTION
  // =========================================================

  const handleGenerateQuestion = async () => {
    setInterviewError("");
    setInterviewEvaluation("");
    setInterviewAnswer("");
    setInterviewQuestion("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoggedIn(false);
        return;
      }

      setInterviewLoading(true);

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

      console.log("Interview question:", data);

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");

          setLoggedIn(false);

          throw new Error(
            "Invalid or expired token. Please login again."
          );
        }

        throw new Error(
          data.detail ||
            "Failed to generate interview question."
        );
      }

      setInterviewQuestion(data.question);
    } catch (err: any) {
      console.error(
        "INTERVIEW QUESTION ERROR:",
        err
      );

      setInterviewError(
        err.message ||
          "Something went wrong while generating the question."
      );
    } finally {
      setInterviewLoading(false);
    }
  };

  // =========================================================
  // EVALUATE INTERVIEW ANSWER
  // =========================================================

  const handleEvaluateAnswer = async () => {
    setInterviewError("");

    if (!interviewQuestion) {
      setInterviewError(
        "Please generate an interview question first."
      );

      return;
    }

    if (!interviewAnswer.trim()) {
      setInterviewError(
        "Please write your answer first."
      );

      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoggedIn(false);
        return;
      }

      setEvaluationLoading(true);

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

      console.log(
        "Interview evaluation:",
        data
      );

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");

          setLoggedIn(false);

          throw new Error(
            "Invalid or expired token. Please login again."
          );
        }

        throw new Error(
          data.detail ||
            "Failed to evaluate interview answer."
        );
      }

      setInterviewEvaluation(data.evaluation);
    } catch (err: any) {
      console.error(
        "INTERVIEW EVALUATION ERROR:",
        err
      );

      setInterviewError(
        err.message ||
          "Something went wrong while evaluating the answer."
      );
    } finally {
      setEvaluationLoading(false);
    }
  };

  // =========================================================
  // GENERATE PERSONALIZED PREPARATION PLAN
  // =========================================================

  const handleGeneratePreparationPlan =
    async () => {
      setPreparationError("");
      setPreparationPlan("");

      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          setLoggedIn(false);

          setPreparationError(
            "Please login first."
          );

          return;
        }

        setPreparationLoading(true);

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

        console.log(
          "Preparation Plan response:",
          data
        );

        if (!response.ok) {
          if (
            response.status === 401 ||
            response.status === 403
          ) {
            localStorage.removeItem("token");

            setLoggedIn(false);

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

  // =========================================================
  // LOGIN SCREEN
  // =========================================================

  if (!loggedIn) {
    return (
      <div className="app">

        <header className="navbar">
          <h1>AI Placement Copilot</h1>

          <span>Login</span>
        </header>

        <main className="container">

          <section className="hero-section">

            <h2>Login</h2>

            <p>
              Login to analyze your resume.
            </p>

            <div className="upload-box">

              <h3>Login to Your Account</h3>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button onClick={handleLogin}>
                Login
              </button>

              {loginError && (
                <p>{loginError}</p>
              )}

            </div>

          </section>

        </main>

      </div>
    );
  }

  // =========================================================
  // MAIN APPLICATION
  // =========================================================

  return (
    <div className="app">

      <header className="navbar">

        <h1>AI Placement Copilot</h1>

        <span>
          Personalized AI Career Assistant
        </span>

      </header>

      <main className="container">

        {/* =================================================
            RESUME ANALYZER
        ================================================= */}

        <section className="hero-section">

          <h2>Analyze Your Resume</h2>

          <p>
            Upload your resume and get an AI-powered
            analysis of your skills, projects, and
            overall resume quality.
          </p>

          <div className="upload-box">

            <h3>Upload Resume</h3>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />

            <button
              onClick={handleUpload}
              disabled={loading}
            >
              {loading
                ? "Analyzing..."
                : "Analyze Resume"}
            </button>

            {error && (
              <p>{error}</p>
            )}

          </div>

        </section>

        {/* =================================================
            RESUME RESULTS
        ================================================= */}

        {result && (
          <section className="results-section">

            {/* SCORE BREAKDOWN */}

            {result.score_breakdown && (
              <div className="score-breakdown">

                {/* SKILLS */}

                <div className="breakdown-item">

                  <div className="breakdown-header">

                    <span>Skills</span>

                    <strong>
                      {
                        result
                          .score_breakdown
                          .skills
                      }
                      /20
                    </strong>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (
                            result
                              .score_breakdown
                              .skills / 20
                          ) * 100
                        }%`,
                      }}
                    />

                  </div>

                </div>

                {/* EDUCATION */}

                <div className="breakdown-item">

                  <div className="breakdown-header">

                    <span>Education</span>

                    <strong>
                      {
                        result
                          .score_breakdown
                          .education
                      }
                      /15
                    </strong>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (
                            result
                              .score_breakdown
                              .education / 15
                          ) * 100
                        }%`,
                      }}
                    />

                  </div>

                </div>

                {/* PROJECTS */}

                <div className="breakdown-item">

                  <div className="breakdown-header">

                    <span>Projects</span>

                    <strong>
                      {
                        result
                          .score_breakdown
                          .projects
                      }
                      /25
                    </strong>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (
                            result
                              .score_breakdown
                              .projects / 25
                          ) * 100
                        }%`,
                      }}
                    />

                  </div>

                </div>

                {/* EXPERIENCE */}

                <div className="breakdown-item">

                  <div className="breakdown-header">

                    <span>Experience</span>

                    <strong>
                      {
                        result
                          .score_breakdown
                          .experience
                      }
                      /20
                    </strong>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (
                            result
                              .score_breakdown
                              .experience / 20
                          ) * 100
                        }%`,
                      }}
                    />

                  </div>

                </div>

                {/* PROJECT BULLETS */}

                <div className="breakdown-item">

                  <div className="breakdown-header">

                    <span>
                      Project Bullets
                    </span>

                    <strong>
                      {
                        result
                          .score_breakdown
                          .project_bullets
                      }
                      /10
                    </strong>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (
                            result
                              .score_breakdown
                              .project_bullets /
                            10
                          ) * 100
                        }%`,
                      }}
                    />

                  </div>

                </div>

                {/* COMPLETENESS */}

                <div className="breakdown-item">

                  <div className="breakdown-header">

                    <span>
                      Completeness
                    </span>

                    <strong>
                      {
                        result
                          .score_breakdown
                          .completeness
                      }
                      /10
                    </strong>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (
                            result
                              .score_breakdown
                              .completeness /
                            10
                          ) * 100
                        }%`,
                      }}
                    />

                  </div>

                </div>

              </div>
            )}

            {/* SKILLS */}

            <div className="card">

              <h3>Skills</h3>

              <p>
                {result.profile?.skills
                  ?.length > 0
                  ? result.profile.skills.join(
                      ", "
                    )
                  : "No skills detected."}
              </p>

            </div>

            {/* EDUCATION */}

            <div className="card">

              <h3>Education</h3>

              <p>
                {result.profile?.education
                  ?.length > 0
                  ? result.profile.education.join(
                      ", "
                    )
                  : "No education details detected."}
              </p>

            </div>

            {/* PROJECTS */}

            <div className="card">

              <h3>Projects</h3>

              {result.profile?.projects
                ?.length > 0 ? (
                <ul>

                  {result.profile.projects.map(
                    (
                      project: any,
                      index: number
                    ) => (
                      <li key={index}>

                        {typeof project ===
                        "string"
                          ? project
                          : project.name}

                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p>
                  No projects detected.
                </p>
              )}

            </div>

            {/* MISSING SECTIONS */}

            <div className="card">

              <h3>Missing Sections</h3>

              {result.missing_sections
                ?.length > 0 ? (
                <p>
                  {result.missing_sections.join(
                    ", "
                  )}
                </p>
              ) : (
                <p>
                  No missing sections.
                </p>
              )}

            </div>

            {/* WEAK BULLETS */}

            <div className="card">

              <h3>Weak Bullets</h3>

              {result.weak_bullets
                ?.length > 0 ? (
                <ul>

                  {result.weak_bullets.map(
                    (
                      bullet: string,
                      index: number
                    ) => (
                      <li key={index}>
                        {bullet}
                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p>
                  No weak bullets detected.
                </p>
              )}

            </div>

            {/* AI SUGGESTIONS */}

            <div className="card">

              <h3>AI Suggestions</h3>

              {result.suggestions
                ?.length > 0 ? (
                <ul>

                  {result.suggestions.map(
                    (
                      suggestion: string,
                      index: number
                    ) => (
                      <li key={index}>
                        {suggestion}
                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p>
                  No suggestions available.
                </p>
              )}

            </div>

            {/* OVERALL AI FEEDBACK */}

            <div className="card">

              <h3>
                Overall AI Feedback
              </h3>

              {result.overall_feedback ? (
                <p
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {result.overall_feedback}
                </p>
              ) : (
                <p>
                  No overall feedback
                  available.
                </p>
              )}

            </div>

          </section>
        )}

        {/* =================================================
            JOB MATCHER
        ================================================= */}

        <section className="hero-section">

          <h2>Job Matcher</h2>

          <p>
            Paste a job description and find out
            how well your resume matches the role.
          </p>

          <div className="upload-box">

            <h3>
              Target Job / Job Description
            </h3>

            <textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(
                  e.target.value
                )
              }
              rows={10}
            />

            <button
              onClick={handleJobMatch}
              disabled={jobMatchLoading}
            >
              {jobMatchLoading
                ? "Matching..."
                : "Match My Resume"}
            </button>

            {jobMatchError && (
              <p>{jobMatchError}</p>
            )}

          </div>

        </section>

        {/* =================================================
            JOB MATCH RESULTS
        ================================================= */}

        {jobMatchResult && (
          <section className="results-section">

            {/* MATCH SCORE */}

            <div className="card">

              <h3>Match Score</h3>

              <h2>
                {jobMatchResult.match_score}%
              </h2>

            </div>

            {/* MATCHING SKILLS */}

            <div className="card">

              <h3>Matching Skills</h3>

              {jobMatchResult.matching_skills
                ?.length > 0 ? (
                <ul>

                  {jobMatchResult.matching_skills.map(
                    (
                      skill: string,
                      index: number
                    ) => (
                      <li key={index}>
                        ✓ {skill}
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

              <h3>Missing Skills</h3>

              {jobMatchResult.missing_skills
                ?.length > 0 ? (
                <ul>

                  {jobMatchResult.missing_skills.map(
                    (
                      skill: string,
                      index: number
                    ) => (
                      <li key={index}>
                        ✗ {skill}
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

            <div className="card">

              <h3>AI Explanation</h3>

              {jobMatchResult.ai_explanation ? (
                <p
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {
                    jobMatchResult.ai_explanation
                  }
                </p>
              ) : (
                <p>
                  No AI explanation available.
                </p>
              )}

            </div>

          </section>
        )}

        {/* =================================================
            INTERVIEW COPILOT
        ================================================= */}

        <section className="hero-section">

          <h2>Interview Copilot</h2>

          <p>
            Practice interview questions based on
            your target role and get AI-powered
            feedback on your answers.
          </p>

          <div className="upload-box">

            <h3>
              AI Interview Practice
            </h3>

            <button
              onClick={
                handleGenerateQuestion
              }
              disabled={interviewLoading}
            >
              {interviewLoading
                ? "Generating..."
                : "Generate Interview Question"}
            </button>

            {interviewError && (
              <p>{interviewError}</p>
            )}

          </div>

        </section>

        {/* =================================================
            INTERVIEW QUESTION + ANSWER
        ================================================= */}

        {interviewQuestion && (
          <section className="results-section">

            {/* QUESTION */}

            <div className="card">

              <h3>
                Interview Question
              </h3>

              <p>
                {interviewQuestion}
              </p>

            </div>

            {/* ANSWER */}

            <div className="card">

              <h3>Your Answer</h3>

              <textarea
                placeholder="Write your interview answer here..."
                value={interviewAnswer}
                onChange={(e) =>
                  setInterviewAnswer(
                    e.target.value
                  )
                }
                rows={8}
              />

              <button
                onClick={
                  handleEvaluateAnswer
                }
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

                <p>
                  {interviewError}
                </p>

              </div>
            )}

            {/* AI EVALUATION */}

            {interviewEvaluation && (
              <div className="card">

                <h3>
                  AI Evaluation
                </h3>

                <p
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {interviewEvaluation}
                </p>

              </div>
            )}

          </section>
        )}

        {/* =================================================
            PERSONALIZED PREPARATION PLAN
        ================================================= */}

        <section className="hero-section">

          <h2>
            Personalized Preparation Plan
          </h2>

          <p>
            Get a customized preparation roadmap
            based on your resume, target role,
            skills and interview performance.
          </p>

          <div className="upload-box">

            <h3>
              AI Career Preparation
            </h3>

            <button
              onClick={
                handleGeneratePreparationPlan
              }
              disabled={
                preparationLoading
              }
            >
              {preparationLoading
                ? "Generating..."
                : "Generate My Preparation Plan"}
            </button>

            {preparationError && (
              <p>
                {preparationError}
              </p>
            )}

          </div>

        </section>

        {/* =================================================
            PREPARATION PLAN RESULT
        ================================================= */}

        {preparationPlan && (
  <section className="results-section">

    <div className="card preparation-card">

      <div className="preparation-header">
        <div>
          <span className="section-label">
            AI CAREER ASSISTANT
          </span>

          <h3>Personalized Preparation Roadmap</h3>

          <p className="preparation-subtitle">
            A customized plan based on your profile,
            skills, target role, and interview performance.
          </p>
        </div>
      </div>

      <div className="preparation-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
  {preparationPlan}
</ReactMarkdown>
      </div>

    </div>

  </section>
)}

      </main>

    </div>
  );
}

export default App;