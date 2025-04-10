Description of the process of building the app:
-	initialize project folder named tasks_management, created 2 empty folders in it: client and server.
-	Initialized a git repository of the project with a gitignore file for pyhton.
-	Started with the frontend. Created the html files: register.html, login.html, tasks.html. Created style files: style.css for register and login and tasks_style.css for tasks_management. Created a javascript file app.js to include all scripts for all html pages.
-	When finished with the frontend, started with the backend.
-	Started with MongoDB set up both for user and task items
-	Created user and task schema in the /server/modals folder
-	Created an auth_routes.py file and added register and login functions
-	Added JWT for login
-	Securing routes with JWT (unlogged users cant access to /api/tasks and users can access only to their tasks)
-	Created task_routes.py to add, update and delete tasks from database
-	All the endpoint APIs suggested in the PDF file were added to the tas_routes.py
-	At this point the backend includes:
  Feature	-	Status
  POST /api/auth/register	- Register new user
  POST /api/auth/login	-	Login & receive JWT
  @jwt_required decorator	- Secures all protected routes
  GET /api/tasks	-	Get all tasks for logged-in user
  POST /api/tasks	-	Create a task for that user
  GET /api/tasks/<id>	- Get task by ID (with ownership check)
  PUT /api/tasks/<id>	- Update any task field except user
  DELETE /api/tasks/<id> - Delete task with ownership check
- -	Proceeded with connecting this backend to the frontend
-	connected Register Page to Flask API
-	connected login frontend to login backend
-	connected task functions frontend to backend (create, update, delete)
-	added filter and order by time options for managing tasks
