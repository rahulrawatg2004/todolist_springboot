const taskForm = document.getElementById("task-form");
const taskIdInput = document.getElementById("task-id");
const taskNameInput = document.getElementById("task-name");
const taskDescriptionInput = document.getElementById("task-description");
const taskStatusInput = document.getElementById("task-status");
const saveButton = document.getElementById("save-btn");
const cancelButton = document.getElementById("cancel-btn");
const refreshButton = document.getElementById("refresh-btn");
const taskList = document.getElementById("task-list");
const formMessage = document.getElementById("form-message");
const listMessage = document.getElementById("list-message");
const API_BASE = "/api/tasks";

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(trimmed);
  }

  return text;
}

function setFormMessage(text, isError = false) {
  formMessage.textContent = text;
  formMessage.style.color = isError ? "#b42318" : "#0f766e";
}

function setListMessage(text, isError = false) {
  listMessage.textContent = text;
  listMessage.style.color = isError ? "#b42318" : "#475569";
}

function clearForm() {
  taskIdInput.value = "";
  taskNameInput.value = "";
  taskDescriptionInput.value = "";
  taskStatusInput.value = "NOT_DONE";
  saveButton.textContent = "Add Task";
  cancelButton.classList.add("hidden");
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (!tasks.length) {
    setListMessage("No tasks yet.");
    return;
  }

  setListMessage("");

  tasks.forEach((task) => {
    const card = document.createElement("article");
    card.className = "task-card";

    const statusClass = `status-${task.status || "NOT_DONE"}`;
    card.innerHTML = `
      <h3 class="task-title">${task.name || ""}</h3>
      <p class="task-desc">${task.description || ""}</p>
      <span class="task-status ${statusClass}">${task.status || "NOT_DONE"}</span>
      <div class="task-actions">
        <button type="button" class="secondary edit-btn">Edit</button>
        <button type="button" class="danger delete-btn">Delete</button>
      </div>
    `;

    card.querySelector(".edit-btn").addEventListener("click", () => {
      taskIdInput.value = task.id;
      taskNameInput.value = task.name || "";
      taskDescriptionInput.value = task.description || "";
      taskStatusInput.value = task.status || "NOT_DONE";
      saveButton.textContent = "Update Task";
      cancelButton.classList.remove("hidden");
      setFormMessage("");
      taskNameInput.focus();
    });

    card.querySelector(".delete-btn").addEventListener("click", async () => {
      const shouldDelete = window.confirm(`Delete "${task.name}"?`);
      if (!shouldDelete) {
        return;
      }

      try {
        await requestJson(`${API_BASE}/${task.id}`, { method: "DELETE" });
        setFormMessage("Task deleted.");
        if (taskIdInput.value === task.id) {
          clearForm();
        }
        await loadTasks();
      } catch (error) {
        setListMessage(error.message, true);
      }
    });

    taskList.appendChild(card);
  });
}

async function loadTasks() {
  setListMessage("Loading tasks...");
  try {
    const tasks = await requestJson(API_BASE);
    renderTasks(Array.isArray(tasks) ? tasks : []);
  } catch (error) {
    setListMessage(error.message, true);
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setFormMessage("");

  const payload = {
    name: taskNameInput.value.trim(),
    description: taskDescriptionInput.value.trim(),
    status: taskStatusInput.value
  };

  if (!payload.name || !payload.description) {
    setFormMessage("Name and description are required.", true);
    return;
  }

  const editingId = taskIdInput.value.trim();
  const isEdit = Boolean(editingId);
  const endpoint = isEdit ? `${API_BASE}/${editingId}` : API_BASE;

  try {
    await requestJson(endpoint, {
      method: isEdit ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    setFormMessage(isEdit ? "Task updated." : "Task added.");
    clearForm();
    await loadTasks();
  } catch (error) {
    setFormMessage(error.message, true);
  }
});

cancelButton.addEventListener("click", () => {
  clearForm();
  setFormMessage("Edit canceled.");
});

refreshButton.addEventListener("click", async () => {
  await loadTasks();
});

clearForm();
loadTasks();
