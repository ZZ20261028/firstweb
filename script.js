/* =====================================================
   AZoom Car Rental - Main JavaScript
   Written for a first-year undergraduate level.
   Uses basic variables, arrays, for-loops, and if/else.
   ===================================================== */

// --- Global Variables ---
var isLoggedIn = false;
var currentUser = "";
var selectedCarName = "";
var selectedCarPrice = 0;
var selectedCarImg = "";

// Array to store all bookings (Simulating a database)
var bookings = [];
var nextBookingId = 1001;

// This function runs when the webpage finishes loading
window.onload = function() {
    updateAdminTable();
    showSection('home');
};

// --- 1. Page Navigation Logic ---
// Hide all sections and show the requested one
function showSection(sectionName) {
    // Get all <section> tags and hide them
    var allSections = document.getElementsByTagName('section');
    for (var i = 0; i < allSections.length; i++) {
        allSections[i].classList.add('hidden');
    }
    
    // Show the specific section based on the name
    if (sectionName == 'home') {
        document.getElementById('home-section').classList.remove('hidden');
    } else if (sectionName == 'fleet') {
        document.getElementById('fleet-section').classList.remove('hidden');
    } else if (sectionName == 'booking') {
        document.getElementById('car-selected-booking-section').classList.remove('hidden');
    } else if (sectionName == 'renting') {
        document.getElementById('how-to-rent-section').classList.remove('hidden');
    } else if (sectionName == 'admin') {
        document.getElementById('admin-section').classList.remove('hidden');
    } else if (sectionName == 'myBookings') {
        document.getElementById('my-bookings-section').classList.remove('hidden');
    }
    
    // Scroll to top of the page
    window.scrollTo(0, 0);
}

// Navbar Click Events
document.getElementById('nav-home').onclick = function(event) {
    event.preventDefault(); // Stop the page from jumping
    showSection('home');
};

document.getElementById('nav-fleet').onclick = function(event) {
    event.preventDefault();
    showSection('fleet');
};

document.getElementById('nav-renting').onclick = function(event) {
    event.preventDefault();
    showSection('renting');
};

document.getElementById('home-logo').onclick = function(event) {
    event.preventDefault();
    showSection('home');
};

// Staff Portal requires Login
document.getElementById('nav-admin').onclick = function(event) {
    event.preventDefault();
    if (isLoggedIn == true) {
        showSection('admin');
    } else {
        alert("Please log in first to access the Staff Portal.");
        document.getElementById('authBtn').click(); // Auto open login modal
    }
};

// Toggle mobile menu
function toggleMenu() {
    var links = document.getElementById('myLinks');
    if (links.classList.contains('show')) {
        links.classList.remove('show');
    } else {
        links.classList.add('show');
    }
}

// --- 2. Fleet Filter Logic ---
// Shows or hides HTML cards based on the type (all, ev, petrol)
function filterCars(type, btnElement) {
    // 1. Reset all buttons to inactive
    var btns = document.querySelectorAll('.filter-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }
    
    // 2. Set the clicked button to active
    if (btnElement) {
        btnElement.classList.add('active');
    }

    // 3. Loop through all car cards
    var items = document.querySelectorAll('.fleetItem');
    for (var j = 0; j < items.length; j++) {
        var itemType = items[j].getAttribute('data-type');
        
        // If "all" is selected, or if the type matches, show it
        if (type == "all" || itemType == type) {
            items[j].style.display = "block"; // Show
        } else {
            items[j].style.display = "none";  // Hide
        }
    }
}

// Check login before going to Fleet from Home Page
function checkLoginAndGo(type) {
    if (isLoggedIn == true) {
        showSection('fleet');
        // Auto-click the specific filter button
        if (type == 'ev') {
            document.querySelectorAll('.filter-btn')[1].click();
        } else {
            document.querySelectorAll('.filter-btn')[2].click();
        }
    } else {
        alert("Please log in first to rent a car.");
        document.getElementById('authBtn').click();
    }
}

// When a user clicks "Rent car" on a specific vehicle
function selectCar(name, price, img) {
    if (isLoggedIn == false) {
        alert("Please log in first to select a car.");
        document.getElementById('authBtn').click();
        return;
    }
    
    // Save selected car details to global variables
    selectedCarName = name;
    selectedCarPrice = price;
    selectedCarImg = img;

    // Update the Booking Form with the selected car's info
    document.getElementById('selected-car-image').src = img;
    document.getElementById('selected-car-name').innerText = name;
    document.getElementById('selected-car-price').innerText = "$" + price + " / day";
    
    showSection('booking');
}

// --- 3. Login / Register Logic ---
var authModal = document.getElementById('authModal');
var authForm = document.getElementById('authForm');
var formTitle = document.getElementById('formTitle');
var confirmBox = document.getElementById('confirm-password-box');
var switchToRegister = document.getElementById('switchToRegister');
var isRegisterMode = false;

function closeModal() {
    authModal.classList.add('hidden');
}

document.getElementById('authBtn').onclick = function() {
    isRegisterMode = false;
    formTitle.innerText = "Log In";
    confirmBox.style.display = "none";
    authForm.querySelector('button[type="submit"]').innerText = "Log In";
    authModal.classList.remove('hidden');
};

switchToRegister.onclick = function(event) {
    event.preventDefault();
    isRegisterMode = !isRegisterMode; // Toggle true/false

    if (isRegisterMode == true) {
        formTitle.innerText = "Sign Up";
        confirmBox.style.display = "block";
        authForm.querySelector('button[type="submit"]').innerText = "Sign Up";
        document.getElementById('switchForm').innerHTML = 'Already have an account? <a href="#" id="switchToLogin">Log In</a>';
        document.getElementById('switchToLogin').onclick = function(e) { e.preventDefault(); switchToRegister.click(); };
    } else {
        formTitle.innerText = "Log In";
        confirmBox.style.display = "none";
        authForm.querySelector('button[type="submit"]').innerText = "Log In";
        document.getElementById('switchForm').innerHTML = 'Don\'t have an account? <a href="#" id="switchToRegister">Sign up</a>';
        document.getElementById('switchToRegister').onclick = switchToRegister.onclick;
    }
};

authForm.onsubmit = function(event) {
    event.preventDefault(); // Stop page reload
    currentUser = document.getElementById('username').value;
    isLoggedIn = true;

    authModal.classList.add('hidden');
    document.getElementById('authBtn').style.display = "none";
    document.getElementById('profile-icon').style.display = "flex";
    document.querySelector('.welcomeMsg').innerText = "Welcome, " + currentUser;
};

document.getElementById('logoutBtn').onclick = function() {
    isLoggedIn = false;
    currentUser = "";
    
    // Reset UI
    document.getElementById('profile-icon').style.display = "none";
    document.getElementById('authBtn').style.display = "block";
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    
    showSection('home');
    alert("You have been logged out.");
};

// --- 4. User Bookings Page ---
document.getElementById('myBookingsBtn').onclick = function() {
    renderMyBookings();
    showSection('myBookings');
};

function renderMyBookings() {
    var tbody = document.getElementById('my-bookings-tbody');
    tbody.innerHTML = ""; // Clear table
    var count = 0;

    // Loop through all bookings in the array
    for (var i = 0; i < bookings.length; i++) {
        var b = bookings[i];
        
        // Only show bookings made by the current user
        if (b.username == currentUser) {
            count++;
            
            // Determine status color
            var statusColor = "#fed7d7"; // Red (Default)
            if (b.status == "Completed") { statusColor = "#c6f6d5"; } // Green
            if (b.status == "Reserved") { statusColor = "#fefcbf"; }  // Yellow

            var totalDisplay = "Pending";
            if (b.totalPaid > 0) {
                totalDisplay = "$" + b.totalPaid;
            }

            // Create HTML table row
            var html = "<tr>";
            html += "<td><strong>" + b.id + "</strong></td>";
            html += "<td>" + b.carName + "</td>";
            html += "<td>" + b.pickupDate + " to " + b.returnDate + "</td>";
            html += "<td><span style='padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: bold; background: " + statusColor + ";'>" + b.status + "</span></td>";
            html += "<td>" + totalDisplay + "</td>";
            html += "</tr>";
            
            tbody.innerHTML += html;
        }
    }

    // If no bookings found, show a message
    if (count == 0) {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>You have no bookings yet.</td></tr>";
    }
}

// --- 5. Booking Form Logic ---
document.getElementById('bookingCar-form').onsubmit = function(event) {
    event.preventDefault(); // Stop page reload

    var pickupDate = document.getElementById('pickupDate').value;
    var returnDate = document.getElementById('returnDate').value;

    // Validation
    if (pickupDate == "" || returnDate == "") {
        alert("Please select both dates.");
        return;
    }
    if (new Date(returnDate) <= new Date(pickupDate)) {
        alert("Return date must be after pickup date.");
        return;
    }

    // Calculate days and cost
    var timeDiff = new Date(returnDate) - new Date(pickupDate);
    var days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var rentalCost = days * selectedCarPrice;

    // Generate Booking ID
    var bookingId = "AZ-" + nextBookingId;
    nextBookingId++; // Increment for the next user

    // Create a new booking object
    var newBooking = {
        id: bookingId,
        carName: selectedCarName,
        price: selectedCarPrice,
        customerName: document.getElementById('name').value,
        username: currentUser,
        pickupDate: pickupDate,
        returnDate: returnDate,
        days: days,
        rentalCost: rentalCost,
        damageFee: 0, // Default to 0
        status: "Reserved",
        totalPaid: 0
    };

    // Save to our "database" array
    bookings.push(newBooking);

    // Show success modal
    document.getElementById('successModalTitle').innerText = "Booking Successful";
    document.querySelector('.confirmation-box').innerHTML = 
        "<p>Thank you for booking with us.</p>" +
        "<p><strong>Booking ID: " + bookingId + "</strong></p>" +
        "<p>Car: " + selectedCarName + " | " + days + " day(s) | $" + rentalCost + "</p>";
    
    document.getElementById('successModal').classList.remove('hidden');
    
    // Clear form
    document.getElementById('bookingCar-form').reset();
    updateAdminTable();
};

document.getElementById('redirectBtn').onclick = function() {
    document.getElementById('successModal').classList.add('hidden');
    showSection('home');
};

// --- 6. Staff Admin Logic ---
function updateAdminTable() {
    var tbody = document.getElementById('bookings-tbody');
    tbody.innerHTML = "";

    for (var i = 0; i < bookings.length; i++) {
        var b = bookings[i];
        
        var totalDisplay = "-";
        if (b.totalPaid > 0) {
            totalDisplay = "$" + b.totalPaid;
        }

        var html = "<tr>";
        html += "<td>" + b.id + "</td>";
        html += "<td>" + b.carName + "</td>";
        html += "<td>" + b.customerName + "</td>";
        html += "<td>" + b.status + "</td>";
        html += "<td>" + totalDisplay + "</td>";
        html += "</tr>";
        
        tbody.innerHTML += html;
    }
}

// Helper function to find a booking by ID and check status
function findBookingForAdmin(inputId, expectedStatus) {
    var id = document.getElementById(inputId).value;
    
    for (var i = 0; i < bookings.length; i++) {
        if (bookings[i].id == id) {
            if (bookings[i].status == expectedStatus) {
                return bookings[i]; // Found and correct status
            } else {
                alert("Booking found, but current status is: " + bookings[i].status);
                return null;
            }
        }
    }
    
    alert("Booking ID not found.");
    return null;
}

// Step 2: Pick Up
function confirmPickup() {
    var b = findBookingForAdmin("pickup-booking-id", "Reserved");
    if (b != null) {
        b.status = "Picked Up";
        document.getElementById('admin-log-message').innerText = "Booking " + b.id + " picked up.";
        document.getElementById('pickup-booking-id').value = "";
        updateAdminTable();
    }
}

// Step 3: Return
function confirmReturn() {
    var b = findBookingForAdmin("return-booking-id", "Picked Up");
    if (b != null) {
        b.status = "Returned";
        document.getElementById('admin-log-message').innerText = "Booking " + b.id + " returned.";
        document.getElementById('return-booking-id').value = "";
        updateAdminTable();
    }
}

// Step 4: Inspect
function inspectCar() {
    var b = findBookingForAdmin("inspect-booking-id", "Returned");
    if (b != null) {
        var hasDamage = document.getElementById('damage-checkbox').checked;
        
        if (hasDamage == true) {
            b.damageFee = 150;
        } else {
            b.damageFee = 0;
        }
        
        b.status = "Inspected";
        document.getElementById('admin-log-message').innerText = "Booking " + b.id + " inspected. Damage fee: $" + b.damageFee;
        
        document.getElementById('inspect-booking-id').value = "";
        document.getElementById('damage-checkbox').checked = false;
        updateAdminTable();
    }
}

// Step 5: Final Billing
function payFinalBill() {
    var b = findBookingForAdmin("billing-booking-id", "Inspected");
    if (b != null) {
        var total = b.rentalCost + b.damageFee;
        b.totalPaid = total;
        b.status = "Completed";
        
        alert("Payment Successful!\n\nRental: $" + b.rentalCost + "\nDamage: $" + b.damageFee + "\nTotal Paid: $" + total);
        
        document.getElementById('admin-log-message').innerText = "Booking " + b.id + " completed.";
        document.getElementById('billing-booking-id').value = "";
        updateAdminTable();
    }
}