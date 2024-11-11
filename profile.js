// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
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
const db = getFirestore();
const auth = getAuth();

// Display user information
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const userDocRef = doc(db, "users", uid);
    
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        document.getElementById('displayName').textContent = `${userData.firstName} ${userData.lastName}`;
        document.getElementById('displayEmail').textContent = userData.email;
        document.getElementById('displayPhone').textContent = userData.phone || 'N/A'; // Show 'N/A' if phone number is not available
      }
      
      // Get donated items count
      const donationsSnapshot = await getDocs(collection(db, `users/${uid}/donations`));
      document.getElementById('itemsDonated').textContent = donationsSnapshot.size;
      
      // Get received/requested items count
      const receivedSnapshot = await getDocs(collection(db, `users/${uid}/receive`));
      document.getElementById('itemsReceived').textContent = receivedSnapshot.size;
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  } else {
    alert("You need to be logged in to view your profile.");
    window.location.href = 'index.html'; // Redirect to login page if not logged in
  }
});

// Show edit form on icon click
document.getElementById('editName').addEventListener('click', () => {
  document.getElementById('profileForm').style.display = 'block';
  document.getElementById('editNameInput').value = document.getElementById('displayName').textContent;
});
document.getElementById('editPhone').addEventListener('click', () => {
  document.getElementById('profileForm').style.display = 'block';
  document.getElementById('editPhoneInput').value = document.getElementById('displayPhone').textContent;
});

// Update profile
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get form values
  const newName = document.getElementById('editNameInput').value;
  const newPhone = document.getElementById('editPhoneInput').value;
  
  // Get the currently logged-in user
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const userDocRef = doc(db, "users", uid);
      
      try {
        // Update user profile
        await updateDoc(userDocRef, { 
          firstName: newName.split(' ')[0], 
          lastName: newName.split(' ')[1] || '', 
          phone: newPhone 
        });
        
        alert('Profile updated successfully!');
        document.getElementById('displayName').textContent = newName;
        document.getElementById('displayPhone').textContent = newPhone;
        document.getElementById('profileForm').style.display = 'none';
      } catch (error) {
        console.error("Error updating profile: ", error);
        document.getElementById('error').textContent = "Failed to update profile. Please try again.";
      }
    } else {
      alert("You need to be logged in to update your profile.");
      window.location.href = 'index.html'; // Redirect to login page if not logged in
    }
  });
});
