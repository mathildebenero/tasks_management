// All the scripts concentrated in one javascript page, to ensure order and logic structure

// For each html page we have a different javascript code
document.addEventListener("DOMContentLoaded", () => {
    const isLoginPage = document.getElementById("loginForm");
    const isRegisterPage = document.getElementById("registerForm");
    const isTasksPage = document.getElementById("tasksContainer");
  
    if (isLoginPage) {
        // login validation logic code for showing error message if inputs are invalid

        const loginForm = document.getElementById('loginForm');

        // no errors at first
        loginForm.addEventListener('submit', function(event) {
        document.getElementById('usernameError').textContent = '';
        document.getElementById('passwordError').textContent = '';

        // Use the HTML5 Constraint Validation API (as in the Register form)
        if (!loginForm.checkValidity()) {
            event.preventDefault();

            if (!loginForm.username.checkValidity()) {
            document.getElementById('usernameError').textContent =
                'Username is required (min 3 characters).';
            }

            if (!loginForm.password.checkValidity()) {
            document.getElementById('passwordError').textContent =
                'Password is required (min 6 characters).';
            }
        }
        });

    }
  
    if (isRegisterPage) {
        // register validation logic code for showing error message if inputs are invalid
        const registerForm = document.getElementById('registerForm');

        //JavaScript listens for the submit event and checks for invalid inputs, then displays custom error messages. -->
        registerForm.addEventListener('submit', function(event) {

        // Clear previous errors
        document.getElementById('usernameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';

        // Use the HTML5 Constraint Validation API
        if (!registerForm.checkValidity()) {
            // automatically checks each form input based on the HTML attributes, each input field has its own checkValidity() method
            event.preventDefault(); // Prevent form from submitting
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
        }
        });

    }
  
    if (isTasksPage) {
      // script of the tasks page

        // Mock Task Data
        const mockTasks = [
            {
            id: 1,
            name: "Finish frontend layout",
            dueDate: "2024-04-12",
            status: "undone",
            description: "Implement the full HTML structure for tasks page.",
            category: "Work",
            timeEstimate: "2 hours"
            },
            {
            id: 2,
            name: "Grocery Shopping",
            dueDate: "2024-04-10",
            status: "done",
            description: "Buy veggies, fruits, and cleaning supplies.",
            category: "Errands",
            timeEstimate: "45 minutes"
            }
        ];

        const tasksContainer = document.getElementById("tasksContainer");
        const modal = document.getElementById("taskModal");
        const closeModalBtn = document.getElementById("closeModal");
        // Add Task Modal
        const addTaskModal = document.getElementById("addTaskModal");
        const openAddTaskBtn = document.getElementById("addTaskBtn");
        const closeAddTaskBtn = document.getElementById("closeAddTaskModal");
        const addTaskForm = document.getElementById("addTaskForm");

        // Open modal when Add Task button is clicked
        openAddTaskBtn.addEventListener("click", () => {
        addTaskModal.classList.remove("hidden");
        });

        // Close modal on X
        closeAddTaskBtn.addEventListener("click", () => {
        addTaskModal.classList.add("hidden");
        });

        // Close modal if clicking outside content
        window.addEventListener("click", (e) => {
        if (e.target === addTaskModal) {
            addTaskModal.classList.add("hidden");
        }
        });

        // Temporary behavior: close modal on form submit
        addTaskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Task saved! (This is a mock placeholder.)");
        addTaskModal.classList.add("hidden");
        addTaskForm.reset();
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

        function openModal(task) {
            document.getElementById("modalTaskName").textContent = task.name;
            document.getElementById("modalDueDate").textContent = task.dueDate;
            document.getElementById("modalStatus").textContent = task.status;
            document.getElementById("modalCategory").textContent = task.category;
            document.getElementById("modalTimeEstimate").textContent = task.timeEstimate;
            document.getElementById("modalDescription").textContent = task.description;
            modal.classList.remove("hidden");
        }

        // Close modal on button click
        closeModalBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
        });

        // Optional: Close modal if clicking outside the modal content
        window.addEventListener("click", (event) => {
            if (event.target === modal) {
            modal.classList.add("hidden");
            }
        });

        // Initialize page
        renderTasks(mockTasks);

    }
  });
  