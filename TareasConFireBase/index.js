import { getTasks, insertTask, updateTask } from "./utils.js";

async function initApp() {
    //carga de tareas
    await getTasks();

    //Obtenemos el form y capturamos el submit
    const form = document.getElementById("task-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); 

        const task = {
            title: form["task-title"].value.trim(),
            description: form["task-description"].value.trim()
        };

        //validacion de campos vacios
        if (!task.title || !task.description) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        //verificacion de si estamos actualizando una tarea existente
        const taskId = form.getAttribute("data-id");
        if (taskId) {
            //actualiza la tarea existente
            await updateTask(taskId, task);
        } else {
            //inserta una nueva tarea
            await insertTask(task);
        }

        form.reset();
        form.removeAttribute("data-id");
        document.getElementById("task-button").value = "Enviar Tarea";

        await refreshTasks();
    });
}

//función para recargar las tareas desde Firestore
async function refreshTasks() {
    //limpiar las tareas existentes en el DOM
    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.innerHTML = "";

    await getTasks();
}

//inicializar la aplicación cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", initApp);
