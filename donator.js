// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, doc, setDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

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
const storage = getStorage(app);

// Form submission handling
document.getElementById('donatorForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Form submitted'); // Debugging log

  // Get form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const cloth_type = document.getElementById('cloth_type').value;
  const size = document.getElementById('size').value;
  const delivery_type = document.getElementById('delivery_type').value;
  const drop_pick_date = document.getElementById('drop_pick_date').value;
  const userFile = document.getElementById('userFile').files[0]; // Get the image file

  // Get the currently logged-in user
  onAuthStateChanged(auth, async (user) => {
    console.log('Auth state changed'); // Debugging log
    if (user) {
      console.log('User is logged in'); // Debugging log
      const uid = user.uid;
      const donationId = `${Date.now()}_${name}`;

      try {
        // Initialize donation data object
        let donationData = {
          uid,
          address,
          name,
          email,
          phone,
          cloth_type,
          size,
          delivery_type,
          drop_pick_date,
          timestamp: serverTimestamp()
        };

        // Upload image to Firebase Storage if a file is selected
        if (userFile) {
          const imageRef = ref(storage, `donations/${uid}/${donationId}/${userFile.name}`);
          await uploadBytes(imageRef, userFile);
          const imageUrl = await getDownloadURL(imageRef);
          donationData.imageUrl = imageUrl; // Add image URL to donation data
        }

        // Save donation data to Firestore under top-level donations collection
        await setDoc(doc(collection(db, `donations`), donationId), donationData);

        alert('Donation submitted successfully!');

        // Clear form
        document.getElementById('donatorForm').reset();
      } catch (error) {
        console.error("Error submitting donation: ", error);
        document.getElementById('error').textContent = "Failed to submit donation. Please try again.";
      }
    } else {
      alert("You need to be logged in to submit a donation.");
      window.location.href = 'index.html'; // Redirect to login page if not logged in
    }
  });
});
