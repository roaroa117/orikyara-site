const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let current = 0;
let timerId = null; // タイマーを管理する変数

// 切り替え関数
function showSlide(index) {
  slides[current].classList.remove("active");
  dots[current].classList.remove("active");

  current = index;

  slides[current].classList.add("active");
  dots[current].classList.add("active");
}

// 自動再生を開始する関数
function startAutoPlay() {
  // すでにタイマーが動いていたら一度クリアする
  if (timerId) clearInterval(timerId);

  timerId = setInterval(() => {
    let next = current + 1;
    if (next >= slides.length) next = 0;
    showSlide(next);
  }, 7000);
}

// ●クリックで切り替え
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    startAutoPlay(); // クリックされたらタイマーをリセットして再スタート
  });
});

// 最初に自動再生を起動
startAutoPlay();
