# This file handles loading the .env file and connecting to MongoDB using pymongo.

from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Get Mongo URI and DB name
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "tasks_db")

# Create the MongoDB client
client = MongoClient(MONGO_URI)

# Get reference to the database
db = client[DB_NAME]

# You can access collections like this:
users_collection = db["users"]
tasks_collection = db["tasks"]
