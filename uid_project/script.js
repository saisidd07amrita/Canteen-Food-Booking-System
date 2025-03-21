
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const registerBox = document.querySelector('.form-box.register');
const loginBox = document.querySelector('.form-box.login');

registerBtn.addEventListener('click', () => {
    registerBtn.classList.add('active');
    loginBtn.classList.remove('active');
    registerBox.classList.add('active-form');
    loginBox.classList.remove('active-form');
});

loginBtn.addEventListener('click', () => {
    loginBtn.classList.add('active');
    registerBtn.classList.remove('active');
    loginBox.classList.add('active-form');
    registerBox.classList.remove('active-form');
});

// Simulated user database (in a real app, this would be server-side)
let users = [
    {
        username: 'demo',
        email: 'demo@example.com',
        password: 'password123'
    }
];

// Registration form handling
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    
    // Reset error messages
    document.getElementById('regUsernameError').textContent = '';
    document.getElementById('regEmailError').textContent = '';
    document.getElementById('regPasswordError').textContent = '';
    
    // Validate inputs
    let isValid = true;
    
    // Check username
    if (username.length < 3) {
        document.getElementById('regUsernameError').textContent = 'Username must be at least 3 characters';
        isValid = false;
    } else if (users.some(user => user.username === username)) {
        document.getElementById('regUsernameError').textContent = 'Username already exists';
        isValid = false;
    }
    
    // Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('regEmailError').textContent = 'Please enter a valid email';
        isValid = false;
    } else if (users.some(user => user.email === email)) {
        document.getElementById('regEmailError').textContent = 'Email already in use';
        isValid = false;
    }
    
    // Check password
    if (password.length < 6) {
        document.getElementById('regPasswordError').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }
    
    // If form is valid, register user
    if (isValid) {
        // Add user to our "database"
        users.push({
            username: username,
            email: email,
            password: password
        });
        
        // Save to localStorage (for demo purposes)
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message (could use an alert or a more elegant notification)
        alert('Registration successful! You can now log in.');
        
        // Clear form
        registerForm.reset();
        
        // Switch to login form
        loginBtn.click();
    }
});

// Login form handling
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Reset error messages
    document.getElementById('loginUsernameError').textContent = '';
    document.getElementById('loginPasswordError').textContent = '';
    
    // Try to find user
    const user = users.find(u => u.username === username);
    
    if (!user) {
        document.getElementById('loginUsernameError').textContent = 'Username not found';
        return;
    }
    
    if (user.password !== password) {
        document.getElementById('loginPasswordError').textContent = 'Incorrect password';
        return;
    }
    
    // Login successful
    alert('Login successful!');
    
    // Store logged in user info (in a real app, you'd use a session or token)
    localStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        email: user.email
    }));
    
    // Redirect to main page
    window.location.href = 'mainfile.html';
});

// Load existing users from localStorage on page load (for demo persistence)
window.addEventListener('load', function() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
}); 
async function fetchMenu() {
    try {
        let response = await fetch("http://127.0.0.1:5000/menu"); // Fetch from Flask
        let menuItems = await response.json();

        let menuTable = document.querySelector("table"); // Find the table
        menuTable.innerHTML = `
            <tr>
                <th>Item</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
            </tr>
        `; // Reset table

        menuItems.forEach((item, index) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button> 
                    <span id="q${index}">0</span> 
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </td>
            `;
            menuTable.appendChild(row);
        });

        // Update price array
        window.prices = menuItems.map(item => item.price);
        window.quantities = new Array(menuItems.length).fill(0);
    } catch (error) {
        console.error("❌ Error fetching menu:", error);
    }
}

window.onload = fetchMenu; // Load menu when page opens
