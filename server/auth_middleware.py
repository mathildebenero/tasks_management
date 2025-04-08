# defines a reusable `@jwt_required` decorator.
# @jwt_required	is a decorator that protects routes with JWT authentication
# extracts and validates a JWT from the `Authorization` header.
# If valid, attaches the `user_id` to Flask's request context (`g`) so secure routes know who's logged in.

import os
import jwt
from functools import wraps
from flask import request, jsonify, g
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

JWT_SECRET = os.getenv("JWT_SECRET", "fallback_key")

def jwt_required(f):
    @wraps(f) # Preserves the original function name & docs (for debugging)
    def decorated_function(*args, **kwargs):

        # Looks for the JWT in the request header
        auth_header = request.headers.get("Authorization")

        # preventing unlogged users to access
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization token is missing."}), 401

        # extracts the token from the request header that includes a JWT
        token = auth_header.split(" ")[1]

        try:
            # Validates the token and extracts payload (the part of the token that includes the data)
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

            # Saves the authenticated user's ID in Flask’s global context for later use
            g.user_id = payload["user_id"]
        except ExpiredSignatureError:
            return jsonify({"error": "Token has expired."}), 401
        except InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 401

        return f(*args, **kwargs)
    return decorated_function
