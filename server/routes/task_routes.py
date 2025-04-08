from flask import Blueprint, jsonify, g
from auth_middleware import jwt_required

task_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")

@task_bp.route("/", methods=["GET"])
@jwt_required
def get_tasks():
    return jsonify({"message": f"Hello user {g.user_id}, here are your tasks!"})
