# task schema
# Each user has their own unique _id
# Each task stores the user’s _id in a user_id field
# To get a user's tasks → we query tasks collection with {"user_id": <user's ObjectId>}

from bson import ObjectId

VALID_CATEGORIES = ["Work", "Personal", "Errands", "Study", "Fitness"]
VALID_STATUSES = ["done", "undone"]

# validate_task_data() makes sure all required fields are there and valid
def validate_task_data(data):
    required_fields = ["user_id", "name", "due_date", "status", "description", "time_estimate"]

    for field in required_fields:
        value = data.get(field)
        if not value or not str(value).strip():
            return False, f"{field.replace('_', ' ').capitalize()} is required."

    if data["status"] not in VALID_STATUSES:
        return False, "Status must be 'done' or 'undone'."

    if data.get("category") and data["category"] not in VALID_CATEGORIES:
        return False, f"Category must be one of: {', '.join(VALID_CATEGORIES)}"

    try:
        # Validate that user_id is a valid ObjectId and prevents injection/format errors
        ObjectId(data["user_id"])
    except Exception:
        return False, "Invalid user_id format."

    return True, None

# format_task_document() is useful when sending tasks to the frontend
# used to convert raw MongoDB documents into a clean and frontend-friendly JSON structure.
def format_task_document(task_doc):
    """
    Formats a task document for client-friendly JSON response.
    """
    return {
        "id": str(task_doc["_id"]),
        "user_id": str(task_doc["user_id"]),
        "name": task_doc["name"],
        "due_date": task_doc["due_date"],
        "status": task_doc["status"],
        "description": task_doc["description"],
        "category": task_doc["category"],
        "time_estimate": task_doc["time_estimate"]
    }
