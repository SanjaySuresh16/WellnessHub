document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    emailError.textContent = "";
    passwordError.textContent = "";
    email.classList.remove("input-error");
    password.classList.remove("input-error");

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (email.value.trim() === "") {
      emailError.textContent = "Email is required";
      email.classList.add("input-error");
      valid = false;
    } else if (!email.value.match(emailPattern)) {
      emailError.textContent = "Invalid email format";
      email.classList.add("input-error");
      valid = false;
    }

    if (password.value.trim() === "") {
      passwordError.textContent = "Password is required";
      password.classList.add("input-error");
      valid = false;
    } else if (password.value.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters";
      password.classList.add("input-error");
      valid = false;
    }

    if (!valid) return;

    alert("Login Successful (Frontend only)");
  });

});
