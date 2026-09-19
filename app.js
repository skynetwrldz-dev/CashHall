const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
  document.body.style.opacity = "0";

  setTimeout(() => {
    window.location.href = "landing.html";
  }, 700);
});
