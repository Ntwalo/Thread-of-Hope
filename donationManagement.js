// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
    const donationsList = document.getElementById('donationsList');
    donationsList.innerHTML = '';

    try {
        const donationsCollection = collection(db, "users");
        const usersSnapshot = await getDocs(donationsCollection);
        const donationsByType = {};

        for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;
            const userDonationsCollection = collection(db, `users/${userId}/donations`);
            const donationsSnapshot = await getDocs(userDonationsCollection);

            donationsSnapshot.forEach((doc) => {
                const donation = doc.data();
                if (!donationsByType[donation.cloth_type]) {
                    donationsByType[donation.cloth_type] = [];
                }
                donationsByType[donation.cloth_type].push(donation);
            });
        }

        for (const [clothType, donations] of Object.entries(donationsByType)) {
            const typeSection = document.createElement('section');
            typeSection.innerHTML = `<h3>${clothType}</h3>`;
            
            const donationTable = document.createElement('table');
            donationTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Size</th>
                        <th>Delivery Type</th>
                        <th>Drop/Pick Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${donations.map(donation => `
                        <tr>
                            <td>${donation.name}</td>
                            <td>${donation.email}</td>
                            <td>${donation.phone}</td>
                            <td>${donation.size}</td>
                            <td>${donation.delivery_type}</td>
                            <td>${new Date(donation.drop_pick_date).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            
            typeSection.appendChild(donationTable);
            donationsList.appendChild(typeSection);
        }
    } catch (error) {
        console.error("Error fetching donations: ", error);
        donationsList.innerHTML = '<p>Error fetching donations. Please try again later.</p>';
    }
}

// Load donations when the page loads
if (document.getElementById('donationsList')) {
    loadDonations();
}
