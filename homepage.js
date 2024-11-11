// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userDocRef = doc(db, "users", uid);
    
    // Fetch user data from Firestore
    getDoc(userDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById('loggedUsername').textContent = userData.name;
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.error("Error fetching user document:", error);
      });
  } else {
    window.location.href = 'index.html'; // Redirect to login page if not logged in
  }
});

// Sign out user
document.querySelector('.btnSignOut-popup').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = 'index.html'; // Redirect to login page after sign out
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
});
