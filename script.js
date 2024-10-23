document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Hardcoded credentials (for demo purposes)
    const validUsername = "Dhananjay_03";
    const validPassword = "Patil_03";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const errorMessage = document.getElementById("errorMessage");

    // Check credentials
    if (username === validUsername && password === validPassword) {
        // Redirect to the dashboard page with the folders
        window.location.href = "dashboard.html";
    } else {
        errorMessage.textContent = "Invalid username or password.";
    }
});
