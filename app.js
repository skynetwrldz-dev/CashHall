/* =========================
   CASH HALL APP
   DEMO ACCOUNT SYSTEM
========================= */

const CURRENT_USER_KEY = "cashHallCurrentUser";
const USERS_KEY = "cashHallUsers";

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    const phone = localStorage.getItem(CURRENT_USER_KEY);

    if (!phone) {
        return null;
    }

    const users = getUsers();

    return users[phone] || null;
}

function requireLogin() {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = "landing.html";
        return null;
    }

    return user;
}

function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "landing.html";
}


/* =========================
   REGISTER
========================= */

function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message = document.getElementById("registerMessage");

    message.className = "form-message";

    if (username.length < 3) {
        message.textContent = "Username must be at least 3 characters.";
        message.classList.add("error");
        return;
    }

    if (!/^0\d{10}$/.test(phone)) {
        message.textContent =
            "Enter a valid Nigerian phone number.";
        message.classList.add("error");
        return;
    }

    if (password.length < 6) {
        message.textContent =
            "Password must be at least 6 characters.";
        message.classList.add("error");
        return;
    }

    if (password !== confirmPassword) {
        message.textContent =
            "Passwords do not match.";
        message.classList.add("error");
        return;
    }

    const users = getUsers();

    if (users[phone]) {
        message.textContent =
            "An account with this phone number already exists.";
        message.classList.add("error");
        return;
    }

    users[phone] = {
        username: username,
        phone: phone,

        password: password,

        coins: 0,
        withdrawableCoins: 0,

        wins: 0,
        losses: 0,
        gamesPlayed: 0,

        createdAt: new Date().toISOString()
    };

    saveUsers(users);

    localStorage.setItem(CURRENT_USER_KEY, phone);

    message.textContent =
        "Account created successfully.";

    message.classList.add("success");

    setTimeout(() => {
        window.location.href = "home.html";
    }, 700);
}


/* =========================
   LOGIN
========================= */

function loginUser(event) {
    event.preventDefault();

    const phone =
        document.getElementById("loginPhone").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const message =
        document.getElementById("loginMessage");

    message.className = "form-message";

    const users = getUsers();
    const user = users[phone];

    if (!user) {
        message.textContent =
            "No account found with this phone number.";
        message.classList.add("error");
        return;
    }

    if (user.password !== password) {
        message.textContent =
            "Incorrect password.";
        message.classList.add("error");
        return;
    }

    localStorage.setItem(CURRENT_USER_KEY, phone);

    message.textContent = "Login successful.";
    message.classList.add("success");

    setTimeout(() => {
        window.location.href = "home.html";
    }, 500);
}


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {
    const user = requireLogin();

    if (!user) return;

    const username =
        document.getElementById("usernameDisplay");

    const coins =
        document.getElementById("coinBalance");

    const withdraw =
        document.getElementById("withdrawBalance");

    if (username) {
        username.textContent = user.username;
    }

    if (coins) {
        coins.textContent = `${user.coins} 🪙`;
    }

    if (withdraw) {
        withdraw.textContent =
            `${user.withdrawableCoins} 🪙`;
    }
}


/* =========================
   PAGE INITIALIZATION
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const registerForm =
        document.getElementById("registerForm");

    const loginForm =
        document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener(
            "submit",
            registerUser
        );
    }

    if (loginForm) {
        loginForm.addEventListener(
            "submit",
            loginUser
        );
    }

    if (document.getElementById("usernameDisplay")) {
        updateDashboard();
    }

});
