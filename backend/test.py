import os
import asyncio
from dotenv import load_dotenv
from pymongo import AsyncMongoClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")


async def test_connection():
    client = AsyncMongoClient(
        MONGODB_URL,
        serverSelectionTimeoutMS=10000
    )

    try:
        result = await client.admin.command("ping")
        print("MongoDB ping successful:", result)
    except Exception as e:
        print("MongoDB connection failed:")
        print(type(e).__name__)
        print(e)
    finally:
        await client.close()


asyncio.run(test_connection())