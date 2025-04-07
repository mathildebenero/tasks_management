# user schema
from bson import ObjectId

# checks required fields
def validate_user_data(data):
    required_fields = ["username", "email", "password"]
    for field in required_fields:
        value = data.get(field)
        if not value or not str(value).strip():
            return False, f"{field.capitalize()} is required."
    return True, None

# can be used before sending user data in API responses (without exposing the raw ObjectId or password)
def format_user_document(user_doc):
    """
    Formats a user document (e.g., before returning in an API response).
    """
    return {
        "id": str(user_doc["_id"]),
        "username": user_doc["username"],
        "email": user_doc["email"]
    }
