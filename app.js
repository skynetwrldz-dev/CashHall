/* ================= CASH HALL APP.JS ================= */

const USERS_KEY = "cashHallUsers";
const CURRENT_USER_KEY = "cashHallCurrentUser";

/* ---------- STORAGE ---------- */
function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  const phone = localStorage.getItem(CURRENT_USER_KEY);
  if (!phone) return null;
  return getUsers()[phone] || null;
}

function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = "landing.html";
}

/* ---------- REGISTER ---------- */
function registerUser(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;
  const msg = document.getElementById("registerMessage");

  const users = getUsers();

  if (users[phone]) {
    msg.textContent = "Phone number already exists.";
    return;
  }

  if (password !== confirm) {
    msg.textContent = "Passwords do not match.";
    return;
  }

  users[phone] = {
    username,
    phone,
    password,
    coins: 0,
    withdrawableCoins: 0,
    wins: 0,
    losses: 0,
    gamesPlayed: 0
  };

  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, phone);
  window.location.href = "home.html";
}

/* ---------- LOGIN ---------- */
function loginUser(e) {
  e.preventDefault();

  const phone = document.getElementById("loginPhone").value.trim();
  const password = document.getElementById("loginPassword").value;
  const msg = document.getElementById("loginMessage");

  const user = getUsers()[phone];

  if (!user || user.password !== password) {
    msg.textContent = "Invalid phone number or password.";
    return;
  }

  localStorage.setItem(CURRENT_USER_KEY, phone);
  window.location.href = "home.html";
}

/* ---------- DASHBOARD ---------- */
function updateDashboard() {
  const user = requireLogin();
  if (!user) return;

  document.getElementById("usernameDisplay").textContent = user.username;
  document.getElementById("coinBalance").textContent = user.coins + " 🪙";
  document.getElementById("withdrawBalance").textContent =
    user.withdrawableCoins + " 🪙";
}

/* ---------- WALLET ---------- */
function updateWallet() {
  const user = requireLogin();
  if (!user) return;

  document.getElementById("walletCoins").textContent = user.coins + " 🪙";
  document.getElementById("walletWithdrawable").textContent =
    user.withdrawableCoins + " 🪙";

  const nameInput = document.getElementById("withdrawName");
  if (nameInput) nameInput.value = user.username;
}

/* ---------- PROFILE ---------- */
function updateProfile() {
  const user = requireLogin();
  if (!user) return;

  document.getElementById("profileName").textContent = user.username;
  document.getElementById("profilePhone").textContent = user.phone;
  document.getElementById("profileCoins").textContent = user.coins + " 🪙";
  document.getElementById("profileWithdraw").textContent =
    user.withdrawableCoins + " 🪙";
  document.getElementById("profileGames").textContent = user.gamesPlayed;
  document.getElementById("profileWins").textContent = user.wins;
  document.getElementById("profileLosses").textContent = user.losses;
}

/* ---------- LUCKY 200 GAME ---------- */
function playLucky200() {
  const user = requireLogin();
  if (!user) return;

  const stake = Number(document.getElementById("stake").value);
  const chosen = Number(document.getElementById("chosenNumber").value);
  const result = document.getElementById("luckyResult");
  const wheel = document.getElementById("wheel");

  if (stake < 500) {
    result.textContent = "Minimum stake is 500 coins.";
    return;
  }

  if (chosen < 1 || chosen > 200) {
    result.textContent = "Choose a number between 1 and 200.";
    return;
  }

  if (user.coins < stake) {
    result.textContent = "Not enough coins.";
    return;
  }

  user.coins -= stake;
  document.getElementById("gameCoins").textContent = user.coins + " 🪙";

  let spins = 0;
  const animation = setInterval(() => {
    wheel.textContent = Math.floor(Math.random() * 200) + 1;
    spins++;

    if (spins >= 25) {
      clearInterval(animation);

      const luckyNumber = Math.floor(Math.random() * 200) + 1;
      wheel.textContent = luckyNumber;

      user.gamesPlayed++;

      if (luckyNumber === chosen) {
        const win = stake * 2;
        user.coins += win;
        user.withdrawableCoins += win;
        user.wins++;
        result.textContent = `🎉 Correct! You won ${win} coins.`;
      } else {
        user.losses++;
        result.textContent = `❌ Wrong! Lucky number was ${luckyNumber}.`;
      }

      const users = getUsers();
      users[user.phone] = user;
      saveUsers(users);

      document.getElementById("gameCoins").textContent = user.coins + " 🪙";
    }
  }, 100);
}

/* Make Lucky200 callable from HTML button */
window.playLucky200 = playLucky200;

/* ---------- PAGE LOAD ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) registerForm.addEventListener("submit", registerUser);
  if (loginForm) loginForm.addEventListener("submit", loginUser);

  if (document.getElementById("usernameDisplay")) updateDashboard();
  if (document.getElementById("walletCoins")) updateWallet();
  if (document.getElementById("profileName")) updateProfile();
});
