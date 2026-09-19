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

function updateDashboard() {
    const user = requireLogin();

    if (!user) return;

    const username = document.getElementById("usernameDisplay");
    const coins = document.getElementById("coinBalance");
    const withdraw = document.getElementById("withdrawBalance");

    if (username) {
        username.textContent = user.username;
    }

    if (coins) {
        coins.textContent = `${user.coins} 🪙`;
    }

    if (withdraw) {
        withdraw.textContent = `${user.withdrawableCoins} 🪙`;
    }
}

document.addEventListener("DOMContentLoaded", updateDashboard);
