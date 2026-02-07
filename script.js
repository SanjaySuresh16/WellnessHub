console.log("WellnessHub initialized successfully");
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});

// Frontend auth handlers
const API_BASE = 'http://localhost:3000/api/auth';

function showAlert(message, type = 'info') {
  // simple alert - can be replaced with UI alerts
  console.log(type.toUpperCase(), message);
}

// Login form
const loginForm = document.querySelector('.login-form');
if (loginForm && document.body.classList.contains('login-page')) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username || data.user.email);
      showAlert('Login successful', 'success');
      // redirect to user dashboard or homepage
      window.location.href = '/pages/user-dashboard.html' || '/pages/user-dashboard.html';
    } catch (err) {
      showAlert(err.message || 'Login error', 'error');
    }
  });
}

// Register form
const registerForm = document.getElementById('register-form');
if (registerForm && document.body.classList.contains('signup-page')) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      showAlert('Passwords do not match', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('token', data.token);
      showAlert('Registration successful', 'success');
      window.location.href = '/pages/login.html';
    } catch (err) {
      showAlert(err.message || 'Registration error', 'error');
    }
  });
}
