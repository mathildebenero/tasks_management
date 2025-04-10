# app.py is the main entry point of the Flask server.
# Creates the Flask app
# Enables CORS (to allow your frontend to talk to the backend)
# Registers all blueprints
# Starts the server when running python app.py

# Blueprint: A logical group of related routes (like all /auth or /tasks routes)
# Route: A specific function (like register, login, get tasks) that handles a request
# URL prefix: The part of the URL prepended to every route in the blueprint (e.g. /api/auth)


from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.task_routes import task_bp
from dotenv import load_dotenv
import os
import openai

# Load API key from .env first
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
openai.api_key = OPENROUTER_API_KEY
openai.base_url = "https://openrouter.ai/api/v1"  # Required for OpenRouter


app = Flask(__name__)

# allow frontend to connect (important for localhost)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://127.0.0.1:5500"}})

# Register auth and task routes
app.register_blueprint(auth_bp)
app.register_blueprint(task_bp)

if __name__ == "__main__":
    app.run(debug=True)
