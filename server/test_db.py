from db import db
from db import users_collection

users_collection.insert_one({
    "username": "testuser",
    "email": "test@example.com",
    "password": "hashed_password"
})

