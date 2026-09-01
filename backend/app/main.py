from contextlib import asynccontextmanager
from app.routes.profile import router as profile_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import job_match
from app.database import client, database
from app.routes.auth import router as auth_router
from app.routes.resume import router as resume_router
from app.routes import interview
from app.routes import preparation

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await database.command("ping")
        print("MongoDB connected successfully!")
        yield
    finally:
        await client.close()
        print("MongoDB connection closed.")


app = FastAPI(
    title="AI Placement Copilot",
    description="AI-powered career and interview assistant",
    version="1.0.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-placement-copilot-zeta.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication routes
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(resume_router)
app.include_router(job_match.router)
app.include_router(interview.router)
app.include_router(preparation.router)



@app.get("/")
async def root():
    return {
        "message": "AI Placement Copilot Backend is running!"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }