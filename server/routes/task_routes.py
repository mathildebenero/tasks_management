# the server side to add, update and delete tasks to the database
# @jwt_required ensure that only authenticated users will be able to those functions

from flask import Blueprint, jsonify, request, g
from bson import ObjectId
from auth_middleware import jwt_required
from db import tasks_collection
from models.task import validate_task_data, format_task_document

task_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


# GET /api/tasks — Get all tasks for the logged in and authenticated user
@task_bp.route("/", methods=["GET"])
@jwt_required
def get_tasks():

    # g.user_id was set in the request by @jwt_required
    # each task in MongoDB has a user_id field when created by a user
    # so tasks include only the tasks where user_id == logged in user (only the user's logged in tasks)
    tasks = tasks_collection.find({ "user_id": ObjectId(g.user_id) })

    # makes sure each task from MongoDB is properly formatted as JSON
    formatted_tasks = [format_task_document(task) for task in tasks]

    return jsonify(formatted_tasks), 200


# POST /api/tasks — Create new task
@task_bp.route("/", methods=["POST"])
@jwt_required
def create_task():
    data = request.json

    # Add user ID to associate task with current user
    data["user_id"] = ObjectId(g.user_id)

    # Validate task data
    is_valid, error = validate_task_data(data)
    if not is_valid:
        return jsonify({ "error": error }), 400

    # Insert into DB
    result = tasks_collection.insert_one(data)
    task = tasks_collection.find_one({ "_id": result.inserted_id })

    return jsonify({
        "message": "Task created successfully.",
        "task": format_task_document(task)
    }), 201

# GET /api/tasks/<task_id> - get task by id
@task_bp.route("/<task_id>", methods=["GET"])
@jwt_required
def get_task(task_id):
    try:
        task = tasks_collection.find_one({
            "_id": ObjectId(task_id),
            "user_id": ObjectId(g.user_id)
        })

        if not task:
            return jsonify({"error": "Task not found or not authorized."}), 404

        return jsonify(format_task_document(task)), 200

    except Exception:
        return jsonify({"error": "Invalid task ID format."}), 400

# PUT /api/tasks/<task_id> - update a specific task
@task_bp.route("/<task_id>", methods=["PUT"])
@jwt_required
def update_task(task_id):
    data = request.json

    # Remove any attempt to change user_id
    data.pop("user_id", None)

    try:
        result = tasks_collection.update_one(
            { "_id": ObjectId(task_id), "user_id": ObjectId(g.user_id) },
            { "$set": data }
        )

        if result.matched_count == 0:
            return jsonify({ "error": "Task not found or not authorized." }), 404

        updated_task = tasks_collection.find_one({ "_id": ObjectId(task_id) })
        return jsonify({
            "message": "Task updated successfully.",
            "task": format_task_document(updated_task)
        }), 200

    except Exception:
        return jsonify({"error": "Invalid task ID format."}), 400

# DELETE /api/tasks/<task_id> - delete a specific task
@task_bp.route("/<task_id>", methods=["DELETE"])
@jwt_required
def delete_task(task_id):
    try:
        result = tasks_collection.delete_one({
            "_id": ObjectId(task_id),
            "user_id": ObjectId(g.user_id)
        })

        if result.deleted_count == 0:
            return jsonify({ "error": "Task not found or not authorized." }), 404

        return jsonify({ "message": "Task deleted successfully." }), 200

    except Exception:
        return jsonify({"error": "Invalid task ID format."}), 400
