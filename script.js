const urls = {
  attendance: "http://115.241.194.20/sis/Examination/Reports/StudentSearchHTMLReport_student.aspx?R=MjAyMzA5MBI2NTZ4&T=-8584723613578166740",
  exam: "https://narayanagroup.co.in/patient/EngAutonomousReport.aspx/MjAyMjA5MDI2MDgx"
};

const input = document.getElementById("inputText");
const progressBarContainer = document.getElementById("progressBarContainer");
const progressBar = document.getElementById("progressBar");
const popup = document.getElementById("accessPopup");
const clickSound = document.getElementById("clickSound");
const popupSound = document.getElementById("popupSound");
const darkModeToggle = document.getElementById("darkModeToggle");

function showPopup() {
  popup.classList.add("show");
  popupSound.currentTime = 0;
  popupSound.play();
  setTimeout(() => popup.classList.remove("show"), 2200);
}

function animateProgressBar(duration = 2000) {
  progressBar.style.width = "0%";
  progressBarContainer.style.display = "block";

  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    let progress = Math.min((elapsed / duration) * 100, 100);
    progressBar.style.width = progress + "%";

    if (progress < 100) {
      requestAnimationFrame(step);
    } else {
      progressBarContainer.style.display = "none";
      progressBar.style.width = "0%";
    }
  }
  requestAnimationFrame(step);
}

let typingTimeout;
input.addEventListener("input", () => {
  clearTimeout(typingTimeout);
  input.style.boxShadow = '0 0 15px #00ffff, 0 0 30px #00ffff, 0 0 45px #00ffff, 0 0 60px #00ffff';
  typingTimeout = setTimeout(() => {
    input.style.boxShadow = '0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff';
  }, 700);
});

function generateURL(type) {
  const regNo = input.value.trim();
  if (!regNo) {
    alert("Please enter your Registration Number!");
    return;
  }
  clickSound.currentTime = 0;
  clickSound.play();

  animateProgressBar();

  setTimeout(() => {
    const encoded = btoa(regNo);
    const newURL = urls[type].replace(/MjAyMzA5MBI2NTZ4|MjAyMjA5MDI2MDgx/g, encoded);
    window.open(newURL, "_blank");

    showPopup();
    input.value = "";
    input.style.transition = "background-color 0.5s ease";
    input.style.backgroundColor = "rgba(0,255,231,0.15)";
    setTimeout(() => {
      input.style.backgroundColor = "transparent";
    }, 800);
  }, 2100);
}

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const pressed = document.body.classList.contains("light-mode");
  darkModeToggle.setAttribute("aria-pressed", pressed);
  clickSound.currentTime = 0;
  clickSound.play();
});

// Grid canvas animation
const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");
let width, height;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let offset = 0;
let baseAlpha = 0.04;

function drawGrid() {
  ctx.clearRect(0, 0, width, height);
  for (let x = -40; x < width + 40; x += 40) {
    for (let y = -40; y < height + 40; y += 40) {
      let dynamicAlpha = baseAlpha + 0.04 * Math.sin((x + y + offset) * 0.1);
      ctx.strokeStyle = `rgba(0, 255, 231, ${dynamicAlpha.toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.strokeRect((x + (offset % 40)), (y + (offset % 40)), 40, 40);
    }
  }

  let cubeSize = 40;
  let time = offset * 0.02;
  ctx.strokeStyle = "rgba(0, 255, 231, 0.15)";
  ctx.lineWidth = 1;

  for (let x = 0; x < width; x += 80) {
    for (let y = 0; y < height; y += 80) {
      let dx = 20 * Math.sin(time + x * 0.01);
      let dy = 20 * Math.cos(time + y * 0.01);

      ctx.beginPath();
      ctx.moveTo(x + dx, y + dy);
      ctx.lineTo(x + dx + cubeSize, y + dy);
      ctx.lineTo(x + dx + cubeSize, y + dy + cubeSize);
      ctx.lineTo(x + dx, y + dy + cubeSize);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + dx, y + dy);
      ctx.lineTo(x + dx + cubeSize / 2, y + dy - cubeSize / 2);
      ctx.lineTo(x + dx + cubeSize + cubeSize / 2, y + dy - cubeSize / 2);
      ctx.lineTo(x + dx + cubeSize, y + dy);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + dx + cubeSize + cubeSize / 2, y + dy - cubeSize / 2);
      ctx.lineTo(x + dx + cubeSize + cubeSize / 2, y + dy + cubeSize - cubeSize / 2);
      ctx.lineTo(x + dx + cubeSize, y + dy + cubeSize);
      ctx.stroke();
    }
  }

  offset += 0.7;
  baseAlpha = 0.04 + 0.02 * Math.sin(offset * 0.01);
  requestAnimationFrame(drawGrid);
}
drawGrid();
