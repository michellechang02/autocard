from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from decouple import config



# Example collection reference
users_collection = database.get_collection("cards")

# Dependency for accessing database in routes
async def get_database():
    return database
