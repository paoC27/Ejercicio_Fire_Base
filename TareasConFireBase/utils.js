import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs,  doc,  setDoc,  deleteDoc,  getDoc } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA0A736-WPzSW33mbdvtY7IUULIyNZCaqU",
    authDomain: "administradortareas-ac545.firebaseapp.com",
    projectId: "administradortareas-ac545",
    storageBucket: "administradortareas-ac545.appspot.com",
    messagingSenderId: "628060720052",
    appId: "1:628060720052:web:cd739ab994d0116f0900e1"
};

//inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//Obtener todas las tareas de Firestore y crear tarjetas en el DOM
export async function getTasks() {
    try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        querySnapshot.forEach((docSnap) => {
            createCard(docSnap.id, docSnap.data());
        });
    } catch (error) {
        console.error("Error obteniendo tareas:", error);
    }
}


function createCard(id, task) {

    const tasksContainer = document.getElementById("tasks-container");

    const principalDiv = document.createElement('div');
    principalDiv.setAttribute("class", "card bg-light mb-3");
    principalDiv.style = "max-width: 20rem;";
    principalDiv.setAttribute("id", `task-${id}`);

    const headerDiv = document.createElement('div');
    headerDiv.setAttribute("class", "card-header");
    headerDiv.textContent = `ID: ${id}`;
    principalDiv.appendChild(headerDiv);

    const bodyDiv = document.createElement('div');
    bodyDiv.setAttribute("class", "card-body");

    const pTitle = document.createElement("p");
    pTitle.classList.add("card-title");
    pTitle.textContent = `Título: ${task.title}`;
    bodyDiv.appendChild(pTitle);

    const pDesc = document.createElement("p");
    pDesc.classList.add("card-text");
    pDesc.textContent = `Descripción: ${task.description}`;
    bodyDiv.appendChild(pDesc);

    //botón para eliminar la tarea
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger", "mr-2");
    deleteButton.textContent = "Borrar Tarea";
    deleteButton.setAttribute("data-id", id);
    bodyDiv.appendChild(deleteButton);

    //botón para editar la tarea
    const editButton = document.createElement("button");
    editButton.classList.add("btn", "btn-warning");
    editButton.textContent = "Editar Tarea";
    editButton.setAttribute("data-id", id);
    bodyDiv.appendChild(editButton);

    principalDiv.appendChild(bodyDiv);

    tasksContainer.appendChild(principalDiv);

    tasksContainer.appendChild(document.createElement("br"));

    //agregar eventos a los botones
    deleteButton.addEventListener("click", async () => {
        const confirmDelete = confirm("¿Estás seguro de que deseas borrar esta tarea?");
        if (confirmDelete) {
            await deleteTask(id);
            tasksContainer.removeChild(principalDiv);
            alert(`Tarea con ID ${id} borrada correctamente.`);
        }
    });

    editButton.addEventListener("click", async () => {
        await loadTaskForEdit(id);
    });
}

function generateRandomIdTask(num) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//Insertar una nueva tarea en Firestore
export async function insertTask(task) {
    try {
        const taskId = generateRandomIdTask(20);
        await setDoc(doc(db, "tasks", taskId), task);
        alert(`Tarea "${task.title}" insertada correctamente.`);
    } catch (error) {
        console.error("Error insertando tarea:", error);
        alert("Error al insertar la tarea. Por favor, intenta nuevamente.");
    }
}

// Borrar una tarea de Firestore
export async function deleteTask(id) {
    try {
        await deleteDoc(doc(db, "tasks", id));
        console.log(`Tarea con ID ${id} borrada.`);
    } catch (error) {
        console.error("Error borrando tarea:", error);
        alert("Error al borrar la tarea. Por favor, intenta nuevamente.");
    }
}

//Cargar una tarea en el formulario para editarla
export async function loadTaskForEdit(id) {
    try {
        const taskDoc = await getDoc(doc(db, "tasks", id));
        if (taskDoc.exists()) {
            const taskData = taskDoc.data();
            const form = document.getElementById("task-form");
            form["task-title"].value = taskData.title;
            form["task-description"].value = taskData.description;
            form.setAttribute("data-id", id);  
            document.getElementById("task-button").value = "Actualizar Tarea";
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        } else {
            alert("La tarea que intentas editar no existe.");
        }
    } catch (error) {
        console.error("Error cargando tarea para editar:", error);
        alert("Error al cargar la tarea. Por favor, intenta nuevamente.");
    }
}

//actualizar una tarea existente en Firestore.
export async function updateTask(id, task) {
    try {
        await setDoc(doc(db, "tasks", id), task, { merge: true });
        alert(`Tarea "${task.title}" actualizada correctamente.`);
    } catch (error) {
        console.error("Error actualizando tarea:", error);
        alert("Error al actualizar la tarea. Por favor, intenta nuevamente.");
    }
}
