# the Register and Login functions, both part of authentication logic

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import validate_user_data, format_user_document
from db import users_collection
from bson import ObjectId
import jwt
import datetime
import os

# creates a Flask Blueprint, which is a modular way to organize routes in large applications (like a folder for APIs)
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Secret key for JWT, corresponds to the one in .env
# the fallback_key enables the app not to crash during development (it is not secure and is not for production)
JWT_SECRET = os.getenv("JWT_SECRET", "fallback_key")
JWT_EXPIRATION_MINUTES = 60

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


# When the user logs in:
# Check credentials
# If valid → create a JWT token
# Return that token in the response
# The frontend will store the token in localStorage and use it in future requests

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    # Validate input
    if "username" not in data or "password" not in data:
        return jsonify({"error": "Username and password are required."}), 400

    user = users_collection.find_one({"username": data["username"]})
    if not user:
        return jsonify({"error": "Invalid username or password."}), 401

    # Check password
    if not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid username or password."}), 401

    # Generate JWT token
    payload = {
        "user_id": str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=JWT_EXPIRATION_MINUTES)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "message": "Login successful.",
        "token": token,
        "user": format_user_document(user)
    }), 200