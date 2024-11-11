// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, doc, addDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getDatabase, ref as dbRef, set, push } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

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
const db = getFirestore(app);
const realtimeDb = getDatabase(app);
const auth = getAuth();

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  // Create message data object
  const messageData = {
    name: name,
    email: email,
    message: message,
    timestamp: serverTimestamp()
  };

  // Get the currently logged-in user
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;

      try {
        // Save message to Firestore under user's collection
        await addDoc(collection(db, `users/${uid}/messages`), messageData);
        
        // Save message to Realtime Database under user's node
        const newMessageRef = push(dbRef(realtimeDb, `users/${uid}/messages`));
        await set(newMessageRef, messageData);
        
        alert('Message sent successfully! We will get back to you soon.');
        
        // Clear form
        document.getElementById('contactForm').reset();
      } catch (error) {
        console.error("Error sending message: ", error);
        alert("Failed to send message. Please try again.");
      }
    } else {
      alert("You need to be logged in to send a message.");
      window.location.href = 'login.html'; // Redirect to login page if not logged in
    }
  });
});
