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

  const journals = [
    "Hôm nay là ngày đầu tiên tớ đi. Đừng làm mất hai cây cuốc đấy nhé =))",
    "Ngày thứ hai rồi. Cậu đã bắt đầu dự án riêng nào trên server chưa?",
    "Kính dùng để xây, nhưng nhớ nhìn rõ đường trước khi lao xuống vực nhé.",
    "Đi nhanh thì được, nhưng cầm xô nước cho chắc. Tớ không muốn nghe tin cậu lại chết vì độ cao đâu.",
    "Hôm nay là ngày của máy móc. Mong rằng mọi thứ cậu xây đều chạy ngay từ lần đầu tiên.",
    "Một kho báu nhỏ cho ngày thứ sáu. Dùng cẩn thận nhé, Phong.",
    "Đã tròn một tuần rồi. Cảm ơn cậu vì vẫn tiếp tục mở từng món quà.",
    "Đi được nửa chặng đường rồi. Cây kiếm này phải sống lâu hơn chủ nhân của nó nhé =))",
    "The End không phải là kết thúc. Chỉ là một phần khác của hành trình thôi.",
    "Mười ngày rồi đấy. Hôm nay cứ vui vẻ và tưởng tượng mình là Wemmbu nhé.",
    "Một chút khoa học, một chút lửa và rất nhiều chuyện 0.1 điểm không được phép lặp lại.",
    "Nếu cậu đang AFK farm thì nhớ đừng quên quay lại kiểm tra túi đồ.",
    "Hôm nay là ngày may rủi. Mong cậu không bị những chiếc Bundle lừa =))",
    "Chỉ còn hai món quà nữa thôi. Hành trình sắp đến đoạn đặc biệt nhất rồi.",
    "Ngày mai là hộp cuối cùng. Tớ hơi hồi hộp không biết cậu sẽ nghĩ gì.",
    "Nếu cậu đang đọc đến đây, nghĩa là cậu đã đồng hành cùng tớ suốt 16 ngày. Cảm ơn cậu."
  ];

  const colors = [
    "#7a4e2f", "#3f8d4f", "#2d9fad", "#65b9db",
    "#b63d3d", "#d7aa24", "#dc7b26", "#2d9fad",
    "#666b73", "#8449a8", "#b83faf", "#e8e8e8",
    "#73c83d", "#b8bdc4", "#3867c4", "#25252b"
  ];

  const milestones = {
    7: {
      eyebrow: "MỐC ĐẶC BIỆT • 1 TUẦN",
      title: "One Week Complete!",
      text: "Cậu đã đi được một tuần trong hành trình 16 ngày."
    },
    10: {
      eyebrow: "MỐC ĐẶC BIỆT • 10 NGÀY",
      title: "10 Days Reached!",
      text: "Mười ngày đã trôi qua. Chỉ còn sáu món quà nữa thôi."
    },
    14: {
      eyebrow: "MỐC ĐẶC BIỆT • 2 TUẦN",
      title: "Only Two Gifts Remain…",
      text: "Hai tuần đã hoàn thành. Phần kết đang ở rất gần."
    }
  };

  const firstUnlock = new Date(GIFT_CONFIG.firstUnlockDate);
  const dayMs = 24 * 60 * 60 * 1000;

  const grid = document.getElementById("giftGrid");
  const statusLabel = document.getElementById("statusLabel");
  const countdownGrid = document.getElementById("countdownGrid");
  const countdownComplete = document.getElementById("countdownComplete");
  const countDays = document.getElementById("countDays");
  const countHours = document.getElementById("countHours");
  const countMinutes = document.getElementById("countMinutes");
  const countSeconds = document.getElementById("countSeconds");
  const recipientName = document.getElementById("recipientName");
  const ownerName = document.getElementById("ownerName");
  const previewBadge = document.getElementById("previewBadge");
  const logoBox = document.getElementById("logoBox");

  const viewer = document.getElementById("viewer");
  const viewerImage = document.getElementById("viewerImage");
  const viewerCaption = document.getElementById("viewerCaption");
  const viewerJournal = document.getElementById("viewerJournal");
  const closeButton = document.getElementById("closeButton");
  const previousButton = document.getElementById("previousButton");
  const nextButton = document.getElementById("nextButton");

  const memoriesButton = document.getElementById("memoriesButton");
  const memoriesDialog = document.getElementById("memoriesDialog");
  const closeMemoriesButton = document.getElementById("closeMemoriesButton");
  const memoriesList = document.getElementById("memoriesList");
  const memoriesOwner = document.getElementById("memoriesOwner");

  const openingOverlay = document.getElementById("openingOverlay");
  const openingText = document.getElementById("openingText");
  const achievement = document.getElementById("achievement");
  const achievementTitle = document.getElementById("achievementTitle");

  const milestoneOverlay = document.getElementById("milestoneOverlay");
  const milestoneEyebrow = document.getElementById("milestoneEyebrow");
  const milestoneTitle = document.getElementById("milestoneTitle");
  const milestoneText = document.getElementById("milestoneText");
  const milestoneContinue = document.getElementById("milestoneContinue");
  const confettiCanvas = document.getElementById("confettiCanvas");

  const cinematic = document.getElementById("cinematic");
  const cinematicCopy = document.getElementById("cinematicCopy");
  const skipCinematic = document.getElementById("skipCinematic");
  const fireworksCanvas = document.getElementById("fireworksCanvas");
  const completionScreen = document.getElementById("completionScreen");
  const returnButton = document.getElementById("returnButton");
  const easterEgg = document.getElementById("easterEgg");

  const params = new URLSearchParams(location.search);
  const previewAllowed = params.get("preview") === GIFT_CONFIG.previewKey;
  const previewDayRaw = Number(params.get("day"));
  const previewDay = Number.isInteger(previewDayRaw)
    ? Math.min(Math.max(previewDayRaw, 1), GIFT_CONFIG.totalDays)
    : GIFT_CONFIG.totalDays;

  let currentTime = new Date();
  let selectedDay = 1;
  let pendingDay = null;
  let audioContext = null;
  let audioEnabled = false;
  let achievementTimer = null;
  let logoClicks = 0;
  let cinematicCancelled = false;

  recipientName.textContent = GIFT_CONFIG.recipient;
  ownerName.textContent = GIFT_CONFIG.owner;
  memoriesOwner.textContent = GIFT_CONFIG.owner;

  if (previewAllowed) {
    previewBadge.hidden = false;
    document.body.classList.add("preview-mode");
  }

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
    if (previewAllowed) return day <= previewDay;
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
    card.dataset.day = String(day);

    const content = unlocked
      ? `
        <div class="open-area">
          <div class="thumbnail-frame">
            <img src="images/day${day}.png" alt="Ảnh xem trước Day ${day}" loading="lazy">
          </div>
          <button class="open-button" type="button" data-day="${day}">
            <span class="mini-shulker" aria-hidden="true"><i></i></span>
            Mở Shulker
          </button>
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
      button.addEventListener("click", () => beginOpening(Number(button.dataset.day)));
      button.addEventListener("pointerenter", () => playHoverSound());
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
    viewerJournal.textContent = journals[day - 1];
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
    if (!previewAllowed) currentTime = new Date(currentTime.getTime() + 1000);

    let nextDay = null;
    for (let day = 1; day <= GIFT_CONFIG.totalDays; day += 1) {
      if (!isUnlocked(day)) {
        nextDay = day;
        break;
      }
    }

    if (previewAllowed) {
      statusLabel.textContent = `Đang xem thử đến Day ${previewDay}`;
      countdownGrid.hidden = true;
      countdownComplete.hidden = false;
      countdownComplete.textContent = "Preview Mode";
      return;
    }

    if (nextDay === null) {
      statusLabel.textContent = "Tất cả 16 món quà đã được mở khóa";
      countdownGrid.hidden = true;
      countdownComplete.hidden = false;
      countdownComplete.textContent = "Hành trình hoàn thành";
      return;
    }

    const difference = Math.max(0, unlockDateFor(nextDay) - currentTime);
    const days = Math.floor(difference / dayMs);
    const hours = Math.floor((difference % dayMs) / 3_600_000);
    const minutes = Math.floor((difference % 3_600_000) / 60_000);
    const seconds = Math.floor((difference % 60_000) / 1000);

    statusLabel.textContent = `Day ${nextDay} sẽ mở khóa sau`;
    countdownGrid.hidden = false;
    countdownComplete.hidden = true;
    countDays.textContent = pad(days);
    countHours.textContent = pad(hours);
    countMinutes.textContent = pad(minutes);
    countSeconds.textContent = pad(seconds);
  }

  function closeViewer() {
    const wasDay16 = selectedDay === 16;
    if (typeof viewer.close === "function") viewer.close();
    else viewer.removeAttribute("open");
    viewerImage.src = "";

    if (wasDay16 && isUnlocked(16)) {
      setTimeout(() => {
        completionScreen.hidden = false;
        completionScreen.classList.add("show");
        playCompletionSound();
      }, 280);
    }
  }

  function initAudio() {
    if (audioContext) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext = new AudioContextClass();
    audioEnabled = true;
  }

  function tone(frequency, duration, type = "square", volume = 0.05, delay = 0) {
    if (!audioEnabled || !audioContext) return;
    const start = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  function playClickSound() {
    initAudio();
    tone(220, 0.08, "square", 0.04);
    tone(150, 0.12, "square", 0.035, 0.07);
  }

  function playOpenSound() {
    initAudio();
    tone(180, 0.12, "square", 0.04);
    tone(260, 0.16, "square", 0.045, 0.08);
    tone(390, 0.22, "triangle", 0.04, 0.17);
  }

  function playAchievementSound() {
    initAudio();
    [523, 659, 784].forEach((frequency, index) => {
      tone(frequency, 0.3, "triangle", 0.045, index * 0.11);
    });
  }

  function playCompletionSound() {
    initAudio();
    [392, 523, 659, 784].forEach((frequency, index) => {
      tone(frequency, 0.45, "sine", 0.04, index * 0.17);
    });
  }

  function playHoverSound() {
    if (!audioEnabled) return;
    tone(280, 0.045, "square", 0.012);
  }

  function showAchievement(day) {
    clearTimeout(achievementTimer);
    achievementTitle.textContent = titles[day - 1];
    achievement.hidden = false;
    requestAnimationFrame(() => achievement.classList.add("show"));
    playAchievementSound();
    achievementTimer = setTimeout(() => {
      achievement.classList.remove("show");
      setTimeout(() => { achievement.hidden = true; }, 420);
    }, 3500);
  }

  function beginOpening(day) {
    if (!isUnlocked(day)) return;
    initAudio();
    pendingDay = day;
    playClickSound();

    openingText.textContent = `Đang mở Day ${day}…`;
    openingOverlay.hidden = false;
    openingOverlay.classList.remove("open");
    requestAnimationFrame(() => openingOverlay.classList.add("open"));

    setTimeout(() => playOpenSound(), 420);

    setTimeout(() => {
      openingOverlay.classList.remove("open");
      setTimeout(() => { openingOverlay.hidden = true; }, 250);

      if (day === 16) {
        runDay16Cinematic();
      } else if (milestones[day]) {
        showMilestone(day);
      } else {
        openViewer(day);
        showAchievement(day);
      }
    }, 1250);
  }

  function showMilestone(day) {
    const data = milestones[day];
    milestoneEyebrow.textContent = data.eyebrow;
    milestoneTitle.textContent = data.title;
    milestoneText.textContent = data.text;
    milestoneOverlay.hidden = false;
    requestAnimationFrame(() => milestoneOverlay.classList.add("show"));
    startConfetti(confettiCanvas, 2600);
    playAchievementSound();
  }

  function finishMilestone() {
    milestoneOverlay.classList.remove("show");
    const day = pendingDay;
    setTimeout(() => {
      milestoneOverlay.hidden = true;
      openViewer(day);
      showAchievement(day);
    }, 280);
  }

  function runDay16Cinematic() {
    cinematicCancelled = false;
    cinematicCopy.replaceChildren();
    cinematic.hidden = false;
    requestAnimationFrame(() => cinematic.classList.add("show"));
    startFireworks(fireworksCanvas, 9000);
    playCompletionSound();

    const lines = [
      { text: "Thank you.", delay: 500, className: "small-line" },
      { text: "Thank you for opening all 16 gifts.", delay: 1900, className: "main-line" },
      { text: "16 Days", delay: 3600, className: "count-line" },
      { text: "16 Memories", delay: 4400, className: "count-line" },
      { text: "1 Friendship", delay: 5200, className: "count-line highlight" },
      { text: "See you soon, Phong.", delay: 6700, className: "final-line" }
    ];

    lines.forEach((line) => {
      setTimeout(() => {
        if (cinematicCancelled) return;
        const element = document.createElement("p");
        element.className = line.className;
        element.textContent = line.text;
        cinematicCopy.appendChild(element);
        requestAnimationFrame(() => element.classList.add("visible"));
      }, line.delay);
    });

    setTimeout(() => {
      if (!cinematicCancelled) finishCinematic();
    }, 8600);
  }

  function finishCinematic() {
    cinematicCancelled = true;
    cinematic.classList.remove("show");
    setTimeout(() => {
      cinematic.hidden = true;
      openViewer(16);
      showAchievement(16);
    }, 450);
  }

  function populateMemories() {
    memoriesList.replaceChildren();
    GIFT_CONFIG.memories.forEach((memory) => {
      const item = document.createElement("li");
      item.innerHTML = `<span>✓</span>${memory}`;
      memoriesList.appendChild(item);
    });
  }

  function openMemories() {
    initAudio();
    playClickSound();
    if (typeof memoriesDialog.showModal === "function") memoriesDialog.showModal();
    else memoriesDialog.setAttribute("open", "");
  }

  function closeMemories() {
    if (typeof memoriesDialog.close === "function") memoriesDialog.close();
    else memoriesDialog.removeAttribute("open");
  }

  function showEasterEgg(message) {
    easterEgg.textContent = message;
    easterEgg.hidden = false;
    easterEgg.classList.add("show");
    playAchievementSound();
    setTimeout(() => {
      easterEgg.classList.remove("show");
      setTimeout(() => { easterEgg.hidden = true; }, 300);
    }, 2600);
  }

  function handleLogoClick() {
    initAudio();
    logoClicks += 1;
    logoBox.classList.remove("bounce");
    void logoBox.offsetWidth;
    logoBox.classList.add("bounce");
    playClickSound();

    if (logoClicks === 5) showEasterEgg("Nếu cậu tìm được cái này thì chúc mừng nhé =))");
    if (logoClicks === 8) showEasterEgg("ChuDiepAnh vẫn đẹp nhất.");
    if (logoClicks === 11) {
      showEasterEgg("Phong đã chết quá nhiều lần để đếm.");
      logoClicks = 0;
    }
  }

  function resizeCanvas(canvas) {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return context;
  }

  function startConfetti(canvas, duration) {
    const context = resizeCanvas(canvas);
    const pieces = Array.from({ length: 130 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.5,
      size: 5 + Math.random() * 8,
      speed: 2 + Math.random() * 4,
      drift: -1.5 + Math.random() * 3,
      rotation: Math.random() * Math.PI,
      spin: -0.12 + Math.random() * 0.24,
      hue: Math.random() * 360
    }));
    const start = performance.now();

    function frame(now) {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pieces.forEach((piece) => {
        piece.y += piece.speed;
        piece.x += piece.drift;
        piece.rotation += piece.spin;
        if (piece.y > window.innerHeight + 30) piece.y = -30;
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.fillStyle = `hsl(${piece.hue} 85% 65%)`;
        context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.65);
        context.restore();
      });
      if (now - start < duration) requestAnimationFrame(frame);
      else context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    requestAnimationFrame(frame);
  }

  function startFireworks(canvas, duration) {
    const context = resizeCanvas(canvas);
    const particles = [];
    const start = performance.now();
    let lastBurst = 0;

    function burst() {
      const x = window.innerWidth * (0.18 + Math.random() * 0.64);
      const y = window.innerHeight * (0.18 + Math.random() * 0.48);
      const hue = Math.random() * 360;
      for (let i = 0; i < 70; i += 1) {
        const angle = (Math.PI * 2 * i) / 70 + Math.random() * 0.08;
        const speed = 1.6 + Math.random() * 4.4;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.009 + Math.random() * 0.012,
          hue,
          size: 1.2 + Math.random() * 2.2
        });
      }
    }

    function frame(now) {
      context.fillStyle = "rgba(4, 2, 8, 0.18)";
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      if (now - lastBurst > 650) {
        burst();
        lastBurst = now;
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.025;
        particle.vx *= 0.993;
        particle.life -= particle.decay;
        context.beginPath();
        context.fillStyle = `hsla(${particle.hue} 95% 70% / ${Math.max(particle.life, 0)})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
        if (particle.life <= 0) particles.splice(i, 1);
      }

      if (now - start < duration && !cinematicCancelled) requestAnimationFrame(frame);
      else context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    burst();
    requestAnimationFrame(frame);
  }

  closeButton.addEventListener("click", closeViewer);
  previousButton.addEventListener("click", () => changeViewer(-1));
  nextButton.addEventListener("click", () => changeViewer(1));
  milestoneContinue.addEventListener("click", finishMilestone);
  skipCinematic.addEventListener("click", finishCinematic);
  memoriesButton.addEventListener("click", openMemories);
  closeMemoriesButton.addEventListener("click", closeMemories);
  logoBox.addEventListener("click", handleLogoClick);
  returnButton.addEventListener("click", () => {
    completionScreen.classList.remove("show");
    setTimeout(() => { completionScreen.hidden = true; }, 350);
  });

  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) closeViewer();
  });

  memoriesDialog.addEventListener("click", (event) => {
    if (event.target === memoriesDialog) closeMemories();
  });

  document.addEventListener("pointerdown", initAudio, { once: true });

  document.addEventListener("keydown", (event) => {
    if (viewer.open) {
      if (event.key === "ArrowLeft") changeViewer(-1);
      if (event.key === "ArrowRight") changeViewer(1);
    }
  });

  async function start() {
    currentTime = await getTrustedTime();
    populateMemories();
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
