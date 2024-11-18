// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

// Fetch and display all users
async function loadAllUsers() {
    const allUsersList = document.getElementById('allUsersList');
    allUsersList.innerHTML = '';

    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach(doc => {
        const user = doc.data();
        const userRow = document.createElement('tr');
        userRow.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.role}</td>
            <td>${user.lastSignInTime ? new Date(user.lastSignInTime.seconds * 1000).toLocaleString() : "Unknown"}</td>
        `;
        allUsersList.appendChild(userRow);
    });
}

// Load users when the page loads
if (document.getElementById('allUsersList')) {
    loadAllUsers();
}

// Update last sign-in time upon login
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "users", user.uid);
        const now = new Date();
        await updateDoc(docRef, { lastSignInTime: now });
    }
});
