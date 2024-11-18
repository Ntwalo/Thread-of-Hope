// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

// Fetch and display donations
async function loadDonations() {
    const donationListTable = document.getElementById('donationListTable');
    donationListTable.innerHTML = '';

    const querySnapshot = await getDocs(query(collection(db, "donations")));

    querySnapshot.forEach(doc => {
        const donation = doc.data();
        const donationRow = document.createElement('tr');
        donationRow.innerHTML = `
            <td>${donation.name}</td>
            <td>${donation.email}</td>
            <td>${donation.phone}</td>
            <td>${donation.cloth_type}</td>
            <td>${donation.size}</td>
            <td>${donation.delivery_type}</td>
            <td>${new Date(donation.drop_pick_date).toLocaleDateString()}</td>
            <td>Available</td>
        `;
        donationListTable.appendChild(donationRow);
    });
}

// Load donations when the page loads
if (document.getElementById('donationListTable')) {
    loadDonations();
}
