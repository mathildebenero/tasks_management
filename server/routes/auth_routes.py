# the Register and Login functions, both part of authentication logic

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from models.user import validate_user_data, format_user_document
from db import users_collection
from bson import ObjectId

# creates a Flask Blueprint, which is a modular way to organize routes in large applications
# so we will have all relevant routes for each end point API
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    # validate the incoming data using the validate_user_data() function
    is_valid, error = validate_user_data(data)
    if not is_valid:
        return jsonify({"error": error}), 400

    # Check if username or email already exists
    if users_collection.find_one({"username": data["username"]}):
        return jsonify({"error": "Username already exists."}), 409
    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already exists."}), 409

    # password is securely hashed using generate_password_hash
    hashed_password = generate_password_hash(data["password"])

    # Create the user document
    new_user = {
        "username": data["username"],
        "email": data["email"],
        "password": hashed_password
    }

    # Insert to DB
    result = users_collection.insert_one(new_user)
    user_doc = users_collection.find_one({"_id": result.inserted_id})

    return jsonify({
        "message": "User registered successfully.",
        "user": format_user_document(user_doc)
    }), 201
