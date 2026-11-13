window.addEventListener("DOMContentLoaded", () => {
  const gauge = document.getElementById("real-gauge");
  const screen = document.getElementById("loading");

  let progress = 0;

  const timer = setInterval(() => {
    if (progress < 100) {
      progress += 1;
      gauge.style.width = progress + "%";
    } else {
      clearInterval(timer);

      setTimeout(() => {
        screen.classList.add("loaded");
      }, 500);
    }
  }, 20);
});
