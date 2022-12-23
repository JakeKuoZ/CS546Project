


const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");


loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("username", emailInput.value);
console.log("password:",passwordInput.value);
})



