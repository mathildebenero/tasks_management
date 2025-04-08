// All the scripts concentrated in one javascript page, to ensure order and logic structure

// For each html page we have a different javascript code
document.addEventListener("DOMContentLoaded", () => {
    const isLoginPage = document.getElementById("loginForm");
    const isRegisterPage = document.getElementById("registerForm");
    const isTasksPage = document.getElementById("tasksContainer");

    // Login function
    // It validates the form inputs
    // Sends a POST request to your backend’s /api/auth/login
    // If successful:
    // Saves the JWT token to localStorage
    // Redirects to tasks.html
    // If failed, shows an alert with the error
    if (isLoginPage) {

        // saves the login form html object to loginform
        const loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // prevent the page to reload

            // clear previous errors
            document.getElementById('usernameError').textContent = '';
            document.getElementById('passwordError').textContent = '';

            // Use the HTML5 Constraint Validation API (as in the Register form)
            if (!loginForm.checkValidity()) {
                if (!loginForm.username.checkValidity()) {
                document.getElementById('usernameError').textContent =
                    'Username is required (min 3 characters).';
                }
                if (!loginForm.password.checkValidity()) {
                document.getElementById('passwordError').textContent =
                    'Password is required (min 6 characters).';
                }
                return;
            }

            // Get form values
            const formData = {
                username: loginForm.username.value.trim(),
                password: loginForm.password.value.trim(),
            };

            try {
                const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (response.ok) {
                // Save token to localStorage
                localStorage.setItem("token", result.token);

                // Save user info too
                localStorage.setItem("user", JSON.stringify(result.user));

                alert("✅ Login successful!");
                window.location.href = "tasks.html";
                } else {
                alert(`❌ Login failed: ${result.error || "Invalid credentials"}`);
                }
            } catch (err) {
                alert("❌ Network error. Please try again.");
                console.error(err);
            }
        });

    }
  
    // Select the form by its ID: registerForm
    // Attach a submit event listener
    // Prevent the default form behavior
    // Collect the form values (username, email, password)
    // Send them to http://localhost:5000/api/auth/register using fetch
    // Handle the response (success or error)
    if (isRegisterPage) {

        // getting the register form thml object from register.html
        const registerForm = document.getElementById('registerForm');

        // what happens when submit button in register page is clicked
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // stop the form from refreshing or submitting natively

            // Clear previous errors
            document.getElementById('usernameError').textContent = '';
            document.getElementById('emailError').textContent = '';
            document.getElementById('passwordError').textContent = '';

            // Use the HTML5 Constraint Validation API
            // automatically checks each form input based on the HTML attributes, each input field has its own checkValidity() method
            if (!registerForm.checkValidity()) {

                // Manually show messages for each invalid field
                if (!registerForm.username.checkValidity()) {
                document.getElementById('usernameError').textContent =
                    'Username is required (3-20 characters).';
                }
                if (!registerForm.email.checkValidity()) {
                document.getElementById('emailError').textContent =
                    'Invalid email format.';
                }
                if (!registerForm.password.checkValidity()) {
                document.getElementById('passwordError').textContent =
                    'Password is required (min 6 characters).';
                }
                return;
            }

            // Extract values from the form to send to the backend
            const formData = {
                username: registerForm.username.value.trim(),
                email: registerForm.email.value.trim(),
                password: registerForm.password.value.trim(),
            };

            try {
                const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (response.ok) {
                alert("✅ Registered successfully! Redirecting to login...");
                window.location.href = "login.html"; // Redirect to login
                } else {
                // Display error from backend (e.g., "Username already exists")
                alert(`❌ Registration failed: ${result.error || "Something went wrong"}`);
                }
            } catch (err) {
                alert("❌ Network error. Please try again later.");
                console.error(err);
            }

        });

    }
  
    // Tasks page
    if (isTasksPage) {

        // saving all the html objects fron tasks.html
        const tasksContainer = document.getElementById("tasksContainer");
        const modal = document.getElementById("taskModal");

        const closeModalBtn = document.getElementById("closeModal");
        // Close modal on button click
        closeModalBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
        });

        const openAddTaskBtn = document.getElementById("addTaskBtn");
        // Open modal when Add Task button is clicked
        openAddTaskBtn.addEventListener("click", () => {
            addTaskModal.classList.remove("hidden");
        });

        const closeAddTaskBtn = document.getElementById("closeAddTaskModal");
        // Close modal on X
        closeAddTaskBtn.addEventListener("click", () => {
            addTaskModal.classList.add("hidden");
        });

        const addTaskModal = document.getElementById("addTaskModal");

        // add task function connected to the backend
        const addTaskForm = document.getElementById("addTaskForm");
        addTaskForm.addEventListener("submit", async function (e) {
            e.preventDefault();
          
            const token = localStorage.getItem("token");
            if (!token) {
              alert("You must be logged in.");
              window.location.href = "login.html";
              return;
            }
          
            // Collect form data
            const taskData = {
              name: addTaskForm.taskName.value.trim(),
              due_date: addTaskForm.dueDate.value,
              description: addTaskForm.description.value.trim(),
              status: addTaskForm.status.value,
              category: addTaskForm.category.value,
              time_estimate: addTaskForm.timeEstimate.value.trim(),
            };
          
            // Simple client-side validation
            for (const [key, value] of Object.entries(taskData)) {
              if (!value) {
                alert(`Please fill in the ${key.replace("_", " ")} field.`);
                return;
              }
            }
          
            try {
              const res = await fetch("http://localhost:5000/api/tasks", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
              });
          
              const result = await res.json();
          
              if (!res.ok) {
                alert(result.error || "Failed to add task.");
                return;
              }
          
              // Success
              alert("Task added successfully!");
              addTaskModal.classList.add("hidden");
              addTaskForm.reset();
              loadTasks(); // Refresh tasks list
            } catch (err) {
              console.error("Error adding task:", err);
              alert("Server error. Please try again.");
            }
          });

        // Close modal if clicking outside the modal content
        window.addEventListener("click", (event) => {
            if (event.target === modal) {
            modal.classList.add("hidden");
            }
        });

        // Close modal if clicking outside content
        window.addEventListener("click", (e) => {
        if (e.target === addTaskModal) {
            addTaskModal.classList.add("hidden");
        }
        });

        // logout button logouts a user and removes its toke from the localstorage
        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            alert("Logged out successfully.");
            window.location.href = "login.html";
          });
          

        // displayind the cards
        function renderTasks(tasks) {
            tasksContainer.innerHTML = "";
            tasks.forEach(task => {
            const card = document.createElement("div");
            card.className = "task-card";
            card.innerHTML = `
                <h3>${task.name}</h3>
                <p><strong>Due:</strong> ${task.dueDate}</p>
                <p><strong>Status:</strong> ${task.status}</p>
                <p><strong>Category:</strong> ${task.category}</p>
                <p><strong>Time:</strong> ${task.timeEstimate}</p>
            `;

            // Show modal with the task's data when clicked
            card.addEventListener("click", () => openModal(task));
            tasksContainer.appendChild(card);
            });
        }

        // opens a task modal when clicked on
        function openModal(task) {
            document.getElementById("modalTaskName").textContent = task.name;
            document.getElementById("modalDueDate").textContent = task.dueDate;
            document.getElementById("modalStatus").textContent = task.status;
            document.getElementById("modalCategory").textContent = task.category;
            document.getElementById("modalTimeEstimate").textContent = task.timeEstimate;
            document.getElementById("modalDescription").textContent = task.description;
            modal.classList.remove("hidden");
        }

        // Initialize page
        loadTasks(); // Fetch real tasks from backend

        async function loadTasks() {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to see your tasks.");
            window.location.href = "login.html";
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/tasks", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
            });

            const result = await res.json();

            if (!res.ok) {
            alert(result.error || "Failed to load tasks. Redirecting to login.");
            window.location.href = "login.html";
            return;
            }

            renderTasks(result); // Renders the list of tasks
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Unable to connect to the server.");
        }
        }
    }
  });
  