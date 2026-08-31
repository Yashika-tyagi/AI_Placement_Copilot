import os
from pymongo import AsyncMongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME", "ai_placement_copilot")
print("Mongo URL loaded:", MONGODB_URL is not None)

client = AsyncMongoClient(MONGODB_URL)

database = client[DB_NAME]

users_collection = database["users"]
resumes_collection = database["resumes"]