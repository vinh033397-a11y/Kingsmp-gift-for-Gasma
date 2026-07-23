(() => {
  "use strict";

  const titles = [
    "The Beginning",
    "Roots and Growth",
    "Crystal Clear",
    "Frozen Path",
    "Engineering Day",
    "Treasure Day",
    "Power of the Mace",
    "The Warrior’s Gift",
    "The End Is Not the End",
    "Inspiration",
    "Alchemy of Fire",
    "From Bones to Builds",
    "Experience and Order",
    "Almost Netherite",
    "Knowledge Is Power",
    "The Final Legend"
  ];

  const colors = [
    "#7a4e2f", "#3f8d4f", "#2d9fad", "#65b9db",
    "#b63d3d", "#d7aa24", "#dc7b26", "#2d9fad",
    "#666b73", "#8449a8", "#b83faf", "#e8e8e8",
    "#73c83d", "#b8bdc4", "#3867c4", "#25252b"
  ];

  const firstUnlock = new Date(GIFT_CONFIG.firstUnlockDate);
  const dayMs = 24 * 60 * 60 * 1000;
  const grid = document.getElementById("giftGrid");
  const countdown = document.getElementById("countdown");
  const statusLabel = document.getElementById("statusLabel");
  const recipientName = document.getElementById("recipientName");
  const ownerName = document.getElementById("ownerName");
  const viewer = document.getElementById("viewer");
  const viewerImage = document.getElementById("viewerImage");
  const viewerCaption = document.getElementById("viewerCaption");
  const closeButton = document.getElementById("closeButton");
  const previousButton = document.getElementById("previousButton");
  const nextButton = document.getElementById("nextButton");

  let currentTime = new Date();
  let selectedDay = 1;

  recipientName.textContent = GIFT_CONFIG.recipient;
  ownerName.textContent = GIFT_CONFIG.owner;

  function unlockDateFor(day) {
    return new Date(firstUnlock.getTime() + (day - 1) * dayMs);
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function isUnlocked(day) {
    return currentTime >= unlockDateFor(day);
  }

  async function getTrustedTime() {
    if (location.protocol !== "http:" && location.protocol !== "https:") {
      return new Date();
    }

    try {
      const response = await fetch(`${location.pathname}?time=${Date.now()}`, {
        method: "HEAD",
        cache: "no-store"
      });
      const serverDate = response.headers.get("date");
      if (serverDate) return new Date(serverDate);
    } catch (error) {
      console.info("Không lấy được giờ máy chủ; dùng giờ thiết bị.");
    }
    return new Date();
  }

  function createCard(day) {
    const unlocked = isUnlocked(day);
    const unlockDate = unlockDateFor(day);
    const card = document.createElement("article");
    card.className = `gift-card ${unlocked ? "unlocked" : "locked"}`;
    card.style.setProperty("--card-color", colors[day - 1]);

    const content = unlocked
      ? `
        <div class="open-area">
          <div class="thumbnail-frame">
            <img src="images/day${day}.png" alt="Ảnh xem trước Day ${day}" loading="lazy">
          </div>
          <button class="open-button" type="button" data-day="${day}">Mở trang quà</button>
        </div>`
      : `
        <div class="lock-area">
          <div class="pixel-lock" aria-hidden="true"></div>
          <p class="lock-message">Chưa đến ngày mở khóa</p>
          <p class="unlock-date">Mở lúc ${formatDate(unlockDate)}</p>
        </div>`;

    card.innerHTML = `
      <div class="card-inner">
        <div class="day-row">
          <span class="day-badge">DAY ${day}/16</span>
          <span class="card-state">${unlocked ? "Đã mở khóa" : "Đang khóa"}</span>
        </div>
        <h2>${titles[day - 1]}</h2>
        ${content}
      </div>`;

    return card;
  }

  function renderGrid() {
    grid.replaceChildren();
    for (let day = 1; day <= GIFT_CONFIG.totalDays; day += 1) {
      grid.appendChild(createCard(day));
    }

    grid.querySelectorAll(".open-button").forEach((button) => {
      button.addEventListener("click", () => openViewer(Number(button.dataset.day)));
    });
  }

  function latestUnlockedDay() {
    let latest = 0;
    for (let day = 1; day <= GIFT_CONFIG.totalDays; day += 1) {
      if (isUnlocked(day)) latest = day;
    }
    return latest;
  }

  function openViewer(day) {
    if (!isUnlocked(day)) return;
    selectedDay = day;
    viewerImage.src = `images/day${day}.png`;
    viewerImage.alt = `Trang quà Day ${day}: ${titles[day - 1]}`;
    viewerCaption.textContent = `DAY ${day}/16 — ${titles[day - 1]}`;
    updateViewerNavigation();
    if (typeof viewer.showModal === "function") viewer.showModal();
    else viewer.setAttribute("open", "");
  }

  function updateViewerNavigation() {
    const latest = latestUnlockedDay();
    previousButton.disabled = selectedDay <= 1;
    nextButton.disabled = selectedDay >= latest;
  }

  function changeViewer(direction) {
    const target = selectedDay + direction;
    if (target < 1 || !isUnlocked(target)) return;
    openViewer(target);
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateCountdown() {
    currentTime = new Date(currentTime.getTime() + 1000);
    let nextDay = null;
    for (let day = 1; day <= GIFT_CONFIG.totalDays; day += 1) {
      if (!isUnlocked(day)) {
        nextDay = day;
        break;
      }
    }

    if (nextDay === null) {
      statusLabel.textContent = "Tất cả 16 món quà đã được mở khóa";
      countdown.textContent = "Hành trình hoàn thành";
      return;
    }

    const difference = Math.max(0, unlockDateFor(nextDay) - currentTime);
    const days = Math.floor(difference / dayMs);
    const hours = Math.floor((difference % dayMs) / 3_600_000);
    const minutes = Math.floor((difference % 3_600_000) / 60_000);
    const seconds = Math.floor((difference % 60_000) / 1000);

    statusLabel.textContent = `Day ${nextDay} sẽ mở khóa sau`;
    countdown.textContent = `${days} ngày ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function closeViewer() {
    if (typeof viewer.close === "function") viewer.close();
    else viewer.removeAttribute("open");
    viewerImage.src = "";
  }

  closeButton.addEventListener("click", closeViewer);
  previousButton.addEventListener("click", () => changeViewer(-1));
  nextButton.addEventListener("click", () => changeViewer(1));

  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) closeViewer();
  });

  document.addEventListener("keydown", (event) => {
    if (!viewer.open) return;
    if (event.key === "ArrowLeft") changeViewer(-1);
    if (event.key === "ArrowRight") changeViewer(1);
  });

  async function start() {
    currentTime = await getTrustedTime();
    renderGrid();
    updateCountdown();

    setInterval(() => {
      const previouslyUnlocked = latestUnlockedDay();
      updateCountdown();
      if (latestUnlockedDay() !== previouslyUnlocked) renderGrid();
    }, 1000);
  }

  start();
})();
