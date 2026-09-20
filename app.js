/* =========================
   CASH HALL APP.JS
========================= */

const CURRENT_USER_KEY = "cashHallCurrentUser";
const USERS_KEY = "cashHallUsers";

/* ---------- USERS ---------- */

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
    window.location.href = "landing.html";
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

  const username = username.value.trim();
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

/* ---------- WITHDRAW ---------- */

function requestWithdrawal(e) {
  e.preventDefault();

  const user = requireLogin();
  if (!user) return;

  const requests = JSON.parse(
    localStorage.getItem("cashHallWithdrawals") || "[]"
  );

  const amount = Number(document.getElementById("withdrawAmount").value);

  if (amount > user.withdrawableCoins) {
    document.getElementById("withdrawMessage").textContent =
      "Insufficient withdrawable coins.";
    return;
  }

  requests.push({
    phone: user.phone,
    username: user.username,
    accountName: document.getElementById("withdrawName").value,
    accountNumber: document.getElementById("withdrawAccount").value,
    amount,
    status: "Pending"
  });

  localStorage.setItem(
    "cashHallWithdrawals",
    JSON.stringify(requests)
  );

  document.getElementById("withdrawMessage").textContent =
    "Withdrawal request submitted.";

  document.getElementById("withdrawAmount").value = "";
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

/* ---------- PAGE LOAD ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const withdrawForm = document.getElementById("withdrawForm");

  if (registerForm) registerForm.addEventListener("submit", registerUser);
  if (loginForm) loginForm.addEventListener("submit", loginUser);
  if (withdrawForm) withdrawForm.addEventListener("submit", requestWithdrawal);

  if (document.getElementById("usernameDisplay")) updateDashboard();
  if (document.getElementById("walletCoins")) updateWallet();
  if (document.getElementById("profileName")) updateProfile();
});
/* ===== LUCKY 200 GAME (2X LUCK SYSTEM) ===== */

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

  // Deduct stake immediately
  user.coins -= stake;
  result.textContent = "";
  wheel.textContent = "🎰";

  let spins = 0;

  const spinAnimation = setInterval(() => {
    wheel.textContent = Math.floor(Math.random() * 200) + 1;
    spins++;

    if (spins >= 25) {
      clearInterval(spinAnimation);

      const luckyNumber = Math.floor(Math.random() * 200) + 1;
      wheel.textContent = luckyNumber;

      user.gamesPlayed++;

      if (luckyNumber === chosen) {
        const winnings = stake * 2;

        user.coins += winnings;
        user.withdrawableCoins += winnings;
        user.wins++;

        result.textContent = `🎉 Correct! Number ${luckyNumber}. You won ${winnings} coins.`;
      } else {
        user.losses++;

        result.textContent = `❌ Wrong! Lucky number was ${luckyNumber}. You lost ${stake} coins.`;
      }

      const users = getUsers();
      users[user.phone] = user;
      saveUsers(users);

      document.getElementById("gameCoins").textContent = user.coins + " 🪙";
    }
  }, 100);
}
