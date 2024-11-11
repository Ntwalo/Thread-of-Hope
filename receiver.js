// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, setDoc, serverTimestamp, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
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

// Form submission handling
document.getElementById('receiverForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Debugging log

    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const cloth_type = document.getElementById('cloth_type').value;
    const size = document.getElementById('size').value; // Ensure this ID matches the HTML

    // Verify form values are retrieved correctly
    console.log(`Form Values: Name=${name}, Phone=${phone}, cloth_type=${cloth_type}, size=${size}`);

    // Get the currently logged-in user
    onAuthStateChanged(auth, async (user) => {
        console.log('Auth state changed'); // Debugging log
        if (user) {
            console.log('User is logged in'); // Debugging log
            const uid = user.uid;
            const requestId = `${Date.now()}_${name}`;

            try {
                let availableClothes = [];
                const usersSnapshot = await getDocs(collection(db, "users"));

                for (const userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id;
                    const donationsRef = collection(db, `users/${userId}/donations`);
                    const q = query(donationsRef, where("cloth_type", "==", cloth_type), where("size", "==", size));
                    console.log('Query created for user: ', userId); // Debugging log

                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        console.log(`Document found in user ${userId} collection: ${JSON.stringify(doc.data())}`); // Log each document
                        availableClothes.push(doc.data());
                    });
                }

                console.log(`Available clothes: ${JSON.stringify(availableClothes)}`);

                if (availableClothes.length > 0) {
                    // Show confirmation popup
                    if (confirm("Clothes are available! Would you like to receive them?")) {
                        // Create request data object
                        const requestData = {
                            name,
                            phone,
                            cloth_type,
                            size,
                            timestamp: serverTimestamp()
                        };

                        // Save request data to Firestore under the current user's collection
                        await setDoc(doc(collection(db, `users/${uid}/receivers`), requestId), requestData);

                        alert('Request submitted successfully! We will contact you soon.');

                        // Clear form
                        document.getElementById('receiverForm').reset();
                    } else {
                        alert('Request cancelled.');
                    }
                } else {
                    alert("No matching clothes available at the moment.");
                }

            } catch (error) {
                console.error("Error checking availability: ", error);
                document.getElementById('error').textContent = "Failed to check availability. Please try again.";
            }
        } else {
            alert("You need to be logged in to submit a request.");
            window.location.href = 'index.html'; // Redirect to login page if not logged in
        }
    });
});
