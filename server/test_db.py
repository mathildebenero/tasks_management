from db import db
from db import users_collection
from db import tasks_collection

tasks_collection.insert_one({
    "user_id": "testuser",
    "name": "test_task",
    "due_date": "08/04/2025",
    "status": "done",
    "description": "work",
    "time_estimate": "1 hour"
})

