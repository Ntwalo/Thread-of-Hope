// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const db = getFirestore(app);

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

const submitRecovery = document.getElementById('submitRecovery');
submitRecovery.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('recoveryEmail').value;
    const auth = getAuth();

    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                showMessage('Recovery email sent successfully', 'recoveryMessage');
            })
            .catch((error) => {
                const errorCode = error.code;
                switch (errorCode) {
                    case 'auth/invalid-email':
                        showMessage('Invalid Email Address', 'recoveryMessage');
                        break;
                    case 'auth/user-not-found':
                        showMessage('No user found with this email', 'recoveryMessage');
                        break;
                    default:
                        showMessage('Error sending recovery email', 'recoveryMessage');
                }
            });
    } else {
        showMessage('No user found with this email', 'recoveryMessage');
    }
});

const backToSignIn = document.getElementById('backToSignIn');
backToSignIn.addEventListener('click', () => {
    window.location.href = 'index.html';
});
