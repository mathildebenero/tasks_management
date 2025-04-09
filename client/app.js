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

        // update button
        const updateTaskBtn = document.getElementById("updateTaskBtn");
        const saveTaskBtn = document.getElementById("saveTaskBtn");

        if (updateTaskBtn) updateTaskBtn.classList.remove("hidden");
        if (saveTaskBtn) saveTaskBtn.classList.add("hidden");

        // tracking the id of the selected task
        let currentTaskId = null; // Store the task id of the opened modal in currentTaskId (initialized to null when no opened task modal)
        // Open task modal and store the current task ID
        function openModal(task) {
            currentTaskId = task.id;
          
            // Fill in the values
            document.getElementById("modalTaskName").value = task.name;
            document.getElementById("modalDueDate").value = task.due_date;
            document.getElementById("modalStatus").value = task.status;
            document.getElementById("modalCategory").value = task.category;
            document.getElementById("modalTimeEstimate").value = task.time_estimate;
            document.getElementById("modalDescription").value = task.description;
          
            // Always disable inputs by default
            ["modalTaskName", "modalDueDate", "modalStatus", "modalCategory", "modalTimeEstimate", "modalDescription"]
              .forEach(id => document.getElementById(id).disabled = true);
          
            // Reset buttons
            document.getElementById("updateTaskBtn").classList.remove("hidden");
            document.getElementById("saveTaskBtn").classList.add("hidden");
          
            modal.classList.remove("hidden");
          }
          
  

        // delete task function connected to the backend
        const deleteTaskBtn = document.getElementById("deleteTaskBtn");
        deleteTaskBtn.addEventListener("click", async () => {
            if (!currentTaskId) return;
          
            const confirmed = confirm("Are you sure you want to delete this task?");
            if (!confirmed) return;
          
            const token = localStorage.getItem("token");
          
            try {
              const res = await fetch(`http://localhost:5000/api/tasks/${currentTaskId}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
              });
          
              const result = await res.json();
          
              if (!res.ok) {
                alert(result.error || "Failed to delete task.");
                return;
              }
          
              alert("Task deleted successfully.");
              modal.classList.add("hidden");
              currentTaskId = null;
              loadTasks(); // Refresh task list
            } catch (err) {
              console.error("Delete error:", err);
              alert("Server error while deleting.");
            }
          });          

          updateTaskBtn.addEventListener("click", () => {
            // Hide update, show save
            updateTaskBtn.classList.add("hidden");
            saveTaskBtn.classList.remove("hidden");
          
            // Enable all fields for editing
            ["modalTaskName", "modalDueDate", "modalStatus", "modalCategory", "modalTimeEstimate", "modalDescription"]
              .forEach(id => document.getElementById(id).disabled = false);
          });          


        // update method submit
        saveTaskBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");
            if (!token || !currentTaskId) return;
          
            const taskData = {
              name: document.getElementById("modalTaskName").value.trim(),
              due_date: document.getElementById("modalDueDate").value,
              status: document.getElementById("modalStatus").value,
              category: document.getElementById("modalCategory").value,
              time_estimate: document.getElementById("modalTimeEstimate").value.trim(),
              description: document.getElementById("modalDescription").value.trim(),
            };
          
            // Validate
            for (const [key, value] of Object.entries(taskData)) {
              if (!value) {
                alert(`Please fill in the ${key.replace("_", " ")} field.`);
                return;
              }
            }
          
            try {
              const res = await fetch(`http://localhost:5000/api/tasks/${currentTaskId}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
              });
          
              const result = await res.json();
          
              if (!res.ok) {
                alert(result.error || "Failed to update task.");
                return;
              }
          
              alert("✅ Task updated!");
              modal.classList.add("hidden");
              updateTaskBtn.classList.remove("hidden");
              saveTaskBtn.classList.add("hidden");
              loadTasks();
            } catch (err) {
              console.error("Update error:", err);
              alert("Something went wrong.");
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
                <p><strong>Due:</strong> ${task.due_date}</p>
                <p><strong>Status:</strong> ${task.status}</p>
                <p><strong>Category:</strong> ${task.category}</p>
                <p><strong>Time:</strong> ${task.time_estimate}</p>
            `;

            // Show modal with the task's data when clicked
            card.addEventListener("click", () => openModal(task));
            tasksContainer.appendChild(card);
            });
        }

        // Initialize page

        // Filter functions

        // category filter
        const filterCategorySelect = document.getElementById("filterCategory");
        // order time
        const orderTimeSelect = document.getElementById("orderTime");
        // order by date
        const orderByDateSelect = document.getElementById("orderByDate");
        // the search task by name input
        const searchInput = document.getElementById("searchTask");

        // when the user inputs a task name, it listens to this event and keep the name in searchQuery
        let searchQuery = "";
        searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value.trim().toLowerCase(); // normalize
        const selectedCategory = filterCategorySelect.value;
        const selectedOrder = orderTimeSelect.value;
        const selectedOrderByDate = orderByDateSelect.value;
        loadTasks(selectedCategory, selectedOrder, selectedOrderByDate);
        });


        // When category changes, include the current selected time order
        filterCategorySelect.addEventListener("change", () => {
          const selectedCategory = filterCategorySelect.value;
          const selectedOrder = orderTimeSelect.value;
          const selectedOrderByDate = orderByDateSelect.value;
          loadTasks(selectedCategory, selectedOrder, selectedOrderByDate);
        });
        
        // When time order changes, include the current selected category
        orderTimeSelect.addEventListener("change", () => {
          const selectedOrder = orderTimeSelect.value;
          const selectedCategory = filterCategorySelect.value;
          const selectedOrderByDate = orderByDateSelect.value;
          loadTasks(selectedCategory, selectedOrder, selectedOrderByDate);
        });
        
        // When date order changes, include the current selected category
        orderByDateSelect.addEventListener("change", () => {
            const selectedOrder = orderTimeSelect.value;
            const selectedCategory = filterCategorySelect.value;
            const selectedOrderByDate = orderByDateSelect.value;
            loadTasks(selectedCategory, selectedOrder, selectedOrderByDate);
          });


        // Help function to extract the number of hours from time_estimate field
        function parseHours(timeEstimate) {
            const match = timeEstimate.match(/\d+/); // Finds the first number
            return match ? parseInt(match[0], 10) : 0; // Default to 0 if not found
        }

        // Help function to sort tasks by their time_estimate
        function sortTasksByTime(tasks, order) {
            return tasks.sort((a, b) => {
              const hoursA = parseHours(a.time_estimate);
              const hoursB = parseHours(b.time_estimate);
          
              return order === "shortest"
                ? hoursA - hoursB // Ascending
                : hoursB - hoursA; // Descending
            });
        }  
        
        // Help function to sort tasks by their due_date
        function sortTasksByDate(tasks, order) {
            return tasks.sort((a, b) => {
              const dateA = new Date(a.due_date);
              const dateB = new Date(b.due_date);
          
              return order === "soonest"
                ? dateA - dateB  // Earlier dates first
                : dateB - dateA; // Later dates first
            });
        }

        loadTasks(); // Fetch real tasks from backend

        async function loadTasks(selectedCategory = "", selectedOrder = "", selectedOrderByDate = "", query = searchQuery) {
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

                let tasks = result;
                if (selectedCategory) {
                    tasks = tasks.filter(task => task.category === selectedCategory);
                }
                
                if (selectedOrder) {
                    tasks = sortTasksByTime(tasks, selectedOrder);
                }

                if (selectedOrderByDate) {
                    tasks = sortTasksByDate(tasks, selectedOrderByDate);
                }
                // Filter by task name
                if (query) {
                    tasks = tasks.filter(task =>
                    task.name.toLowerCase().includes(query)
                    );
                }
                
                renderTasks(tasks);

            } catch (err) {
                console.error("Fetch error:", err);
                alert("Unable to connect to the server.");
            }
        }
        }
  });
  