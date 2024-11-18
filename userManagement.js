// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCE6Zv2pHOit2uoCRlgcQacWwgfbVAoaW0",
    authDomain: "threadsofhopeteameloquate.firebaseapp.com",
    databaseURL: "https://threadsofhopeteameloquate-default-rtdb.firebaseio.com",
    projectId: "threadsofhopeteameloquate",
    storageBucket: "threadsofhopeteameloquate.firebasestorage.app",
    messagingSenderId: "929851073222",
    appId: "1:929851073222:web:24dce5402aa63ae22fedc7",
    measurementId: "G-0ZSZCX9N31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Ensure admin is logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'index.html'; // Redirect to login if not logged in
    }
});

// Handle logout
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html'; // Redirect to login page after logout
    }).catch((error) => {
        console.error("Error logging out: ", error);
    });
});

// Fetch and display users
async function loadUsers() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';

    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach(doc => {
        const user = doc.data();
        const userItem = document.createElement('div');
        userItem.classList.add('user-item');
        userItem.innerHTML = `
            <span>${user.name} (${user.email})</span>
            <button class="delete-button" data-id="${doc.id}">Delete</button>
        `;

        usersList.appendChild(userItem);
    });

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.getAttribute('data-id');
            await deleteDoc(doc(db, "users", userId));
            loadUsers(); // Reload users after deletion
        });
    });
}

// Load users when the page loads
if (document.getElementById('usersList')) {
    loadUsers();
}
