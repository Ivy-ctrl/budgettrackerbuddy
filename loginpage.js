let isLogin = true; 

function toggleForm() {
    isLogin = !isLogin;
    document.getElementById("title").textContent = isLogin ? "Login" : "Create Account";
    const form = document.getElementById('login-form');
    form.reset(); // Reset form fields
}

// Handle form submission (login or create account)
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }
  
    const storedUsers = JSON.parse(localStorage.getItem('users')) || {}; // Retrieve users from localStorage
    if (isLogin) {
        // Login functionality
        if (storedUsers[username]) {
          if (storedUsers[username] === password) {
            // Save the logged-in user's username
            localStorage.setItem('currentUser', username);
            alert("Login successful!");
            window.location.href = "home.html"; // Redirect to home page (calendar page)
          } else {
            alert("Wrong password! Please try again.");
          }
        } else {
          alert("Username does not exist. Please create an account.");
        }
      } else {
        // Create account functionality
        if (storedUsers[username]) {
          alert("Username already exists. Please choose a different one.");
        } else {
          storedUsers[username] = password; // Store the new username and password
          localStorage.setItem('users', JSON.stringify(storedUsers)); // Save updated users in localStorage
          alert("Account created successfully! You can now log in.");
          toggleForm(); // Switch to login form
        }
      }
    });