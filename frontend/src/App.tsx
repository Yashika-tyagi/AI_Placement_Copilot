import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import JobMatcher from "./JobMatcher";
import Interview from "./Interview";
import Preparation from "./Preparation";
import Login from "./Login";

function Dashboard() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-label">OVERVIEW</span>
          <h2>Dashboard</h2>
          <p>Welcome to your AI-powered placement assistant.</p>
        </div>
      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <span className="dashboard-icon">📄</span>
          <h3>Resume Analyzer</h3>
          <p>
            Analyze your resume, identify weaknesses and get AI-powered
            suggestions.
          </p>
          <NavLink to="/resume" className="card-link">
            Analyze Resume →
          </NavLink>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-icon">💼</span>
          <h3>Job Matcher</h3>
          <p>
            Compare your resume with a job description and identify skill gaps.
          </p>
          <NavLink to="/job-matcher" className="card-link">
            Match Job →
          </NavLink>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-icon">🎤</span>
          <h3>Interview Copilot</h3>
          <p>
            Practice interview questions and receive AI-powered feedback.
          </p>
          <NavLink to="/interview" className="card-link">
            Practice Interview →
          </NavLink>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-icon">🧠</span>
          <h3>Preparation Plan</h3>
          <p>
            Generate a personalized preparation roadmap based on your profile.
          </p>
          <NavLink to="/preparation" className="card-link">
            View Plan →
          </NavLink>
        </div>

      </div>
    </div>
  );
}


function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0] || null;

    setFile(selectedFile);
    setResult(null);
    setError("");
  };

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
        setError("Please login first.");
        return;
      }

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resume/upload`,
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

  return (
    <div className="page">

      <span className="section-label">
        CAREER TOOLS
      </span>

      <h2>Resume Analyzer</h2>

      <p>
        Upload your resume and get an AI-powered analysis
        of your skills, projects and overall resume quality.
      </p>

      {/* =========================
          UPLOAD
      ========================= */}

      <div className="feature-placeholder">

        <h3>📄 Upload Your Resume</h3>

        <p>
          Upload your PDF resume to analyze your profile.
        </p>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />

        {file && (
          <p>
            Selected file: <strong>{file.name}</strong>
          </p>
        )}

        <button
          className="primary-button"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : "Analyze Resume"}
        </button>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

      </div>


      {/* =========================
          RESULTS
      ========================= */}

      {result && (
        <div className="resume-results">

          {/* SCORE BREAKDOWN */}

          {result.score_breakdown && (
            <div className="card">

              <h3>Resume Score Breakdown</h3>

              {Object.entries(
                result.score_breakdown
              ).map(
                ([key, value]: [string, any]) => {

                  const maxScores: any = {
                    skills: 20,
                    education: 15,
                    projects: 25,
                    experience: 20,
                    project_bullets: 10,
                    completeness: 10,
                  };

                  const max =
                    maxScores[key] || 100;

                  return (
                    <div
                      className="resume-score-item"
                      key={key}
                    >

                      <div className="score-label">

                        <span>
                          {key
                            .replaceAll("_", " ")
                            .replace(
                              /^\w/,
                              (c) => c.toUpperCase()
                            )}
                        </span>

                        <strong>
                          {value}/{max}
                        </strong>

                      </div>

                      <div className="progress-bar">

                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              (value / max) * 100
                            }%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}


          {/* SKILLS */}

          <div className="card">

            <h3>Skills</h3>

            {result.profile?.skills?.length > 0 ? (
              <p>
                {result.profile.skills.join(", ")}
              </p>
            ) : (
              <p>No skills detected.</p>
            )}

          </div>


          {/* EDUCATION */}

          <div className="card">

            <h3>Education</h3>

            {result.profile?.education?.length > 0 ? (
              <p>
                {result.profile.education.join(", ")}
              </p>
            ) : (
              <p>
                No education details detected.
              </p>
            )}

          </div>


          {/* PROJECTS */}

          <div className="card">

            <h3>Projects</h3>

            {result.profile?.projects?.length > 0 ? (
              <ul>
                {result.profile.projects.map(
                  (
                    project: any,
                    index: number
                  ) => (
                    <li key={index}>
                      {typeof project === "string"
                        ? project
                        : project.name}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>No projects detected.</p>
            )}

          </div>


          {/* MISSING SECTIONS */}

          <div className="card">

            <h3>Missing Sections</h3>

            {result.missing_sections?.length > 0 ? (
              <ul>
                {result.missing_sections.map(
                  (
                    section: string,
                    index: number
                  ) => (
                    <li key={index}>
                      {section}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>No missing sections.</p>
            )}

          </div>


          {/* WEAK BULLETS */}

          <div className="card">

            <h3>Weak Bullets</h3>

            {result.weak_bullets?.length > 0 ? (
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

            {result.suggestions?.length > 0 ? (
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


          {/* OVERALL FEEDBACK */}

          <div className="card">

            <h3>Overall AI Feedback</h3>

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
                No overall feedback available.
              </p>
            )}

          </div>

        </div>
      )}

    </div>
  );
}




function App() {
  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="navbar-brand">
          <div className="brand-icon">⚡</div>

          <div>
            <h1>AI Placement Copilot</h1>
            <span>AI Career Assistant</span>
          </div>
        </div>

        <div className="navbar-right">
          <span>👤 Student</span>

          
        </div>

      </header>


      {/* ================= MAIN LAYOUT ================= */}

      <div className="layout">

        {/* ================= SIDEBAR ================= */}

        <aside className="sidebar">

          <div className="sidebar-section">

            <p className="menu-title">
              MAIN MENU
            </p>

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span>🏠</span>
              Dashboard
            </NavLink>

          </div>


          <div className="sidebar-section">

            <p className="menu-title">
              CAREER TOOLS
            </p>

            <NavLink
              to="/resume"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span>📄</span>
              Resume Analyzer
            </NavLink>

            <NavLink
              to="/job-matcher"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span>💼</span>
              Job Matcher
            </NavLink>

          </div>


          <div className="sidebar-section">

            <p className="menu-title">
              PREPARATION
            </p>

            <NavLink
              to="/interview"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span>🎤</span>
              Interview Copilot
            </NavLink>

            <NavLink
              to="/preparation"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span>🧠</span>
              Preparation Plan
            </NavLink>

          </div>

        </aside>


        {/* ================= PAGE CONTENT ================= */}

        <main className="main-content">

          <Routes>
            <Route
    path="/login"
    element={<Login />}
  />

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/resume"
              element={<ResumeAnalyzer />}
            />

            <Route
              path="/job-matcher"
              element={<JobMatcher />}
            />

            <Route
              path="/interview"
              element={<Interview />}
            />

            <Route
              path="/preparation"
              element={<Preparation />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}

export default App;