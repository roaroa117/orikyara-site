/* ==========================================

   うすピンク・パステル調 ソシャゲ風UI スクリプト

   ========================================== */

const state = {
  exp: 0,

  maxExp: 100,

  level: 1,

  favorability: 0,

  currentRoom: "living", // 'living' or 'bedroom'

  currentOutfit: "casual", // 'casual', 'roomwear', 'maid'

  unlockedImages: [1, 2],

  todos: [
    { id: 1, text: "課題の確認", completed: true },

    { id: 2, text: "整理整頓", completed: false },
  ],

  isClockMode: false,
};

// 【変更】衣装ごとにセリフを定義できるように拡張しました

const dialogues = {
  casual: {
    tap: [
      "呼んだ？",

      "どうしたの",

      "かまってほしい？",

      "今日も一緒に頑張ろうね",

      "休憩もちゃんと挟んでね",

      "元気かな？頑張りすぎないでね",
    ],

    roomChange: {
      living: "リビングに移動したよ～",

      bedroom: "ベッドルームへようこそ。もう寝る？",
    },

    change: "こんにちは。こんばんはだった？",
  },

  roomwear: {
    tap: [
      "気になる？",

      "なんですか？",

      "いい天気ですね。",

      "今は気分じゃないです。",
    ],

    roomChange: {
      living: "リビングはあんまり落ち着かない。",

      bedroom: "疲れましたね。ベッドルームは落ち着く。",
    },

    change: "私といて楽しいですか？",
  },

  maid: {
    tap: [
      "ねむたい！",

      "何かお手伝いできることあるかな。",

      "お腹すかない？",

      "スマホばっか見てちゃだめだぞ！",
    ],

    roomChange: {
      living: "リビングの模様替えとかしちゃおうかな？",

      bedroom: "ベッドルームで作業？",
    },

    change: "やっほ！元気？",
  },
};

// ギャラリーの画像データをたっぷり全12枚用意しました

const galleryData = [
  {
    id: 1,

    title: "日常のひととき",

    levelReq: 1,

    url: "neko dotto.jpg",
  },

  {
    id: 2,

    title: "静かな夜のベッドルーム",

    levelReq: 1,

    url: "neko dotto.jpg",
  },

  {
    id: 3,

    title: "夕暮れの作業部屋",

    levelReq: 2,

    url: "neko dotto.jpg",
  },

  {
    id: 4,

    title: "星空とグラデーション",

    levelReq: 3,

    url: "neko dotto.jpg",
  },

  {
    id: 5,

    title: "まったりお茶の時間",

    levelReq: 4,

    url: "neko dotto.jpg",
  },

  {
    id: 6,

    title: "朝の爽やかな光",

    levelReq: 5,

    url: "neko dotto.jpg",
  },

  {
    id: 7,

    title: "窓辺の読書",

    levelReq: 6,

    url: "neko dotto.jpg",
  },

  {
    id: 8,

    title: "カフェエプロン姿",

    levelReq: 7,

    url: "neko dotto.jpg",
  },

  {
    id: 9,

    title: "休日のお出かけ",

    levelReq: 8,

    url: "neko dotto.jpg",
  },

  {
    id: 10,

    title: "夜空を見上げて",

    levelReq: 9,

    url: "neko dotto.jpg",
  },

  {
    id: 11,

    title: "内緒の秘密基地",

    levelReq: 10,

    url: "neko dotto.jpg",
  },

  {
    id: 12,

    title: "永遠のパートナー",

    levelReq: 12,

    url: "neko dotto.jpg",
  },
];

const outfitImages = {
  casual: "otoko.png",

  roomwear: "onnna.png",

  maid: "neko dotto.jpg",
};

const elements = {
  rankBadge: document.getElementById("userRank"),

  expBar: document.getElementById("expBarFill"),

  favVal: document.getElementById("favVal"),

  timeWidget: document.getElementById("timeWidget"),

  roomToggleBtn: document.getElementById("roomToggleBtn"),

  outfitBtn: document.getElementById("outfitBtn"),

  galleryBtn: document.getElementById("galleryBtn"),

  characterContainer: document.getElementById("characterContainer"),

  characterImg: document.getElementById("characterImg"),

  dialogueText: document.getElementById("dialogueText"),

  heartContainer: document.getElementById("heartContainer"),

  locationBadge: document.getElementById("locationBadge"),

  todoInput: document.getElementById("todoInput"),

  addTodoBtn: document.getElementById("addTodoBtn"),

  todoList: document.getElementById("todoList"),

  clockOverlay: document.getElementById("clockOverlay"),

  clockBigTime: document.getElementById("clockBigTime"),

  clockBigDate: document.getElementById("clockBigDate"),

  galleryModal: document.getElementById("galleryModal"),

  closeGalleryBtn: document.getElementById("closeGalleryBtn"),

  galleryGrid: document.getElementById("galleryGrid"),

  outfitModal: document.getElementById("outfitModal"),

  closeOutfitBtn: document.getElementById("closeOutfitBtn"),

  previewModal: document.getElementById("previewModal"),

  previewImg: document.getElementById("previewImg"),

  previewCaption: document.getElementById("previewCaption"),

  previewClose: document.getElementById("previewClose"),

  lvlupModal: document.getElementById("lvlupModal"),

  lvlupLevel: document.getElementById("lvlupLevel"),

  lvlupImg: document.getElementById("lvlupImg"),

  lvlupMsg: document.getElementById("lvlupMsg"),

  closeLvlupBtn: document.getElementById("closeLvlupBtn"),
};

function init() {
  setupEventListeners();

  setupParticles();

  startClockTimer();

  renderTodos();

  updateUI();

  updateCharacterImage();
}

function setupEventListeners() {
  elements.characterContainer.addEventListener("click", handleCharacterTap);

  elements.roomToggleBtn.addEventListener("click", toggleRoom);

  elements.timeWidget.addEventListener("click", toggleClockMode);

  elements.clockOverlay.addEventListener("click", toggleClockMode);

  elements.outfitBtn.addEventListener("click", () =>
    elements.outfitModal.classList.remove("hidden"),
  );

  elements.closeOutfitBtn.addEventListener("click", () =>
    elements.outfitModal.classList.add("hidden"),
  );

  document.querySelectorAll(".outfit-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      const outfit = e.currentTarget.getAttribute("data-outfit");

      changeOutfit(outfit);
    });
  });

  elements.galleryBtn.addEventListener("click", openGallery);

  elements.closeGalleryBtn.addEventListener("click", closeGallery);

  elements.previewClose.addEventListener("click", closePreview);

  elements.closeLvlupBtn.addEventListener("click", () =>
    elements.lvlupModal.classList.add("hidden"),
  );

  elements.addTodoBtn.addEventListener("click", addTodo);

  elements.todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
  });
}

// 【変更】現在の衣装に応じたタップセリフを取得するように修正

function handleCharacterTap(e) {
  elements.characterContainer.classList.remove("tap-reaction");

  void elements.characterContainer.offsetWidth;

  elements.characterContainer.classList.add("tap-reaction");

  createHeart(e.clientX, e.clientY);

  // 現在の衣装のセリフリストを取得（見つからない場合は casual にフォールバック）

  const currentDialogues =
    dialogues[state.currentOutfit]?.tap || dialogues.casual.tap;

  const randomText =
    currentDialogues[Math.floor(Math.random() * currentDialogues.length)];

  elements.dialogueText.textContent = randomText;

  addExp(15);

  state.favorability += 1;

  updateUI();
}

function createHeart(x, y) {
  const heart = document.createElement("div");

  heart.className = "floating-heart";

  heart.textContent = ["❤", "💕"][Math.floor(Math.random() * 2)];

  const rect = elements.characterContainer.getBoundingClientRect();

  heart.style.left = `${x - rect.left}px`;

  heart.style.top = `${y - rect.top}px`;

  elements.heartContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 1200);
}

function addExp(amount) {
  state.exp += amount;

  if (state.exp >= state.maxExp) {
    state.exp -= state.maxExp;

    state.level += 1;

    state.maxExp = Math.floor(state.maxExp * 1.25);

    galleryData.forEach((item) => {
      if (
        item.levelReq <= state.level &&
        !state.unlockedImages.includes(item.id)
      ) {
        state.unlockedImages.push(item.id);
      }
    });

    triggerLevelUp();
  }

  updateUI();
}

function triggerLevelUp() {
  const currentGallery = galleryData.find((g) => g.levelReq === state.level);

  elements.lvlupLevel.textContent = `LEVEL ${state.level}`;

  elements.lvlupImg.src = currentGallery
    ? currentGallery.url
    : galleryData[0].url;

  elements.lvlupMsg.textContent = `レベル${state.level}に到達！ 新しい思い出が解放されました。`;

  elements.lvlupModal.classList.remove("hidden");
}

// 【変更】部屋移動のセリフも衣装ごとに分岐するように修正

function toggleRoom() {
  const roomDialogues =
    dialogues[state.currentOutfit]?.roomChange || dialogues.casual.roomChange;

  if (state.currentRoom === "living") {
    state.currentRoom = "bedroom";

    document.body.className = `room-bedroom outfit-${state.currentOutfit}`;

    elements.locationBadge.textContent = "ベッドルーム";

    elements.dialogueText.textContent = roomDialogues.bedroom;

    elements.roomToggleBtn.textContent = "リビングルームへ";
  } else {
    state.currentRoom = "living";

    document.body.className = `room-living outfit-${state.currentOutfit}`;

    elements.locationBadge.textContent = "リビング";

    elements.dialogueText.textContent = roomDialogues.living;

    elements.roomToggleBtn.textContent = "ベッドルームへ";
  }
}

// 【変更】着せ替えした瞬間に専用のセリフをしゃべるように修正

function changeOutfit(outfit) {
  state.currentOutfit = outfit;

  document.body.className = `room-${state.currentRoom} outfit-${outfit}`;

  updateCharacterImage();

  // 着せ替え専用のセリフがあれば吹き出しに表示する

  const changeText = dialogues[outfit]?.change;

  if (changeText) {
    elements.dialogueText.textContent = changeText;
  }

  elements.outfitModal.classList.add("hidden");
}

function updateCharacterImage() {
  elements.characterImg.src = outfitImages[state.currentOutfit];
}

function updateUI() {
  elements.rankBadge.textContent = `Lv.${state.level}`;

  const expPercent = Math.min(
    100,

    Math.floor((state.exp / state.maxExp) * 100),
  );

  elements.expBar.style.width = `${expPercent}%`;

  elements.favVal.textContent = state.favorability;
}

function startClockTimer() {
  setInterval(() => {
    const now = new Date();

    const h = String(now.getHours()).padStart(2, "0");

    const m = String(now.getMinutes()).padStart(2, "0");

    const s = String(now.getSeconds()).padStart(2, "0");

    elements.timeWidget.textContent = `${h}:${m}`;

    if (state.isClockMode) {
      elements.clockBigTime.textContent = `${h}:${m}:${s}`;

      const year = now.getFullYear();

      const month = String(now.getMonth() + 1).padStart(2, "0");

      const date = String(now.getDate()).padStart(2, "0");

      const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

      elements.clockBigDate.textContent = `${year}.${month}.${date} ${dayNames[now.getDay()]}`;
    }
  }, 1000);
}

function toggleClockMode() {
  state.isClockMode = !state.isClockMode;

  elements.clockOverlay.classList.toggle("hidden", !state.isClockMode);
}

function renderTodos() {
  elements.todoList.innerHTML = "";

  state.todos.forEach((todo) => {
    const li = document.createElement("li");

    li.className = `todo-item ${todo.completed ? "completed" : ""}`;

    const textSpan = document.createElement("span");

    textSpan.textContent = todo.text;

    textSpan.addEventListener("click", () => toggleTodo(todo.id));

    const delBtn = document.createElement("button");

    delBtn.textContent = "✕";

    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      deleteTodo(todo.id);
    });

    li.appendChild(textSpan);

    li.appendChild(delBtn);

    elements.todoList.appendChild(li);
  });
}

function addTodo() {
  const text = elements.todoInput.value.trim();

  if (!text) return;

  state.todos.push({ id: Date.now(), text, completed: false });

  elements.todoInput.value = "";

  renderTodos();

  addExp(10);
}

function toggleTodo(id) {
  const todo = state.todos.find((t) => t.id === id);

  if (todo) {
    todo.completed = !todo.completed;

    if (todo.completed) addExp(20);

    renderTodos();
  }
}

function deleteTodo(id) {
  state.todos = state.todos.filter((t) => t.id !== id);

  renderTodos();
}

function openGallery() {
  elements.galleryGrid.innerHTML = "";

  galleryData.forEach((item) => {
    const isUnlocked = state.unlockedImages.includes(item.id);

    const div = document.createElement("div");

    div.className = `gallery-item ${isUnlocked ? "" : "locked"}`;

    if (isUnlocked) {
      const img = document.createElement("img");

      img.src = item.url;

      div.appendChild(img);

      div.addEventListener("click", () => openPreview(item.url, item.title));
    } else {
      div.innerHTML = `<div class="lock-icon"><img src="かぎ.png" alt="ロック"></div><div class="lock-text">Lv.${item.levelReq} で解放</div>`;
    }

    elements.galleryGrid.appendChild(div);
  });

  elements.galleryModal.classList.remove("hidden");
}

function closeGallery() {
  elements.galleryModal.classList.add("hidden");
}

function openPreview(url, title) {
  elements.previewImg.src = url;

  elements.previewCaption.textContent = title;

  elements.previewModal.classList.remove("hidden");
}

function closePreview() {
  elements.previewModal.classList.add("hidden");
}

function setupParticles() {
  const canvas = document.getElementById("particleCanvas");

  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);

  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;

    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 35 }, () => ({
    x: Math.random() * width,

    y: Math.random() * height,

    size: Math.random() * 2.5 + 1,

    speedY: -Math.random() * 0.3 - 0.1,

    opacity: Math.random() * 0.6 + 0.2,

    pulse: Math.random() * 0.02 + 0.005,
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y += p.speedY;

      if (p.y < 0) {
        p.y = height;

        p.x = Math.random() * width;
      }

      ctx.beginPath();

      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      ctx.fillStyle = `rgba(255, 155, 187, ${p.opacity})`;

      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

const bgmAudio = document.getElementById("bgmAudio");
const playToggleBtn = document.getElementById("playToggleBtn");

if (playToggleBtn && bgmAudio) {
  playToggleBtn.addEventListener("click", () => {
    if (bgmAudio.paused) {
      bgmAudio.play();
      playToggleBtn.textContent = "⏸";
    } else {
      bgmAudio.pause();
      playToggleBtn.textContent = "▶";
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
