function enableImageFallback(image) {
  image.addEventListener(
    "error",
    () => {
      if (image.src.endsWith(".webp")) {
        image.src = image.src.replace(".webp", ".jpg");
      }
    },
    { once: true }
  );
}

document.querySelectorAll('img[src$=".webp"]').forEach(enableImageFallback);

function pauseMarqueeOffscreen(container) {
  if (!container || !("IntersectionObserver" in window)) return;

  container.classList.add("is-paused");
  const observer = new IntersectionObserver(
    ([entry]) => {
      container.classList.toggle("is-paused", !entry.isIntersecting);
    },
    { rootMargin: "120px 0px" }
  );

  observer.observe(container);
}

const comfortQuotes = [
  "先别急着责怪自己，今天已经走到这里，就已经很了不起。",
  "你不是因为顺利才值得被爱，你本来就值得。",
  "结果还没来之前，不要提前用坏消息惩罚自己。",
  "可以紧张，可以害怕，也可以把手伸给我。",
  "慢慢来，不用每一步都漂亮，只要继续照顾好自己。",
  "你认真生活的样子，已经很珍贵了。"
];

const quoteEl = document.querySelector("#comfortQuote");
const quoteButton = document.querySelector("#quoteButton");
let quoteIndex = 0;

quoteButton.addEventListener("click", () => {
  quoteIndex = (quoteIndex + 1) % comfortQuotes.length;
  quoteEl.textContent = comfortQuotes[quoteIndex];
});

const effortTrack = document.querySelector("#effortTrack");
const effortSlides = Array.from(document.querySelectorAll(".effort-slide"));
const effortPrev = document.querySelector("#effortPrev");
const effortNext = document.querySelector("#effortNext");
const effortDots = document.querySelector("#effortDots");
let effortIndex = 0;
let effortAutoPlay = null;

function showEffortSlide(index) {
  effortIndex = (index + effortSlides.length) % effortSlides.length;
  effortTrack.style.transform = `translateX(-${effortIndex * 100}%)`;

  effortSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === effortIndex);
  });

  Array.from(effortDots.children).forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === effortIndex);
    dot.setAttribute("aria-current", dotIndex === effortIndex ? "true" : "false");
  });
}

function startEffortAutoPlay() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  clearInterval(effortAutoPlay);
  effortAutoPlay = setInterval(() => {
    showEffortSlide(effortIndex + 1);
  }, 4200);
}

function stopEffortAutoPlay() {
  clearInterval(effortAutoPlay);
}

effortSlides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "carousel-dot";
  dot.setAttribute("aria-label", `第 ${index + 1} 张`);
  dot.addEventListener("click", () => {
    showEffortSlide(index);
    startEffortAutoPlay();
  });
  effortDots.appendChild(dot);
});

effortPrev.addEventListener("click", () => {
  showEffortSlide(effortIndex - 1);
  startEffortAutoPlay();
});

effortNext.addEventListener("click", () => {
  showEffortSlide(effortIndex + 1);
  startEffortAutoPlay();
});

document.querySelector(".effort-carousel").addEventListener("mouseenter", stopEffortAutoPlay);
document.querySelector(".effort-carousel").addEventListener("mouseleave", startEffortAutoPlay);
document.querySelector(".effort-carousel").addEventListener("focusin", stopEffortAutoPlay);
document.querySelector(".effort-carousel").addEventListener("focusout", startEffortAutoPlay);
showEffortSlide(0);
startEffortAutoPlay();

const breathButton = document.querySelector("#breathButton");
const breathWord = document.querySelector("#breathWord");
const breathTimer = document.querySelector("#breathTimer");
const breathVisual = document.querySelector(".breath-visual");
const breathSteps = ["吸气", "停一停", "呼气", "放松"];
let breathInterval = null;
let remainingSeconds = 60;
let stepIndex = 0;

function setBreathStep(index) {
  breathVisual.className = `breath-visual phase-${index}`;
  breathWord.textContent = breathSteps[index];
}

function resetBreath() {
  clearInterval(breathInterval);
  breathInterval = null;
  remainingSeconds = 60;
  stepIndex = 0;
  breathVisual.className = "breath-visual";
  breathWord.textContent = "准备";
  breathTimer.textContent = remainingSeconds;
  breathButton.textContent = "开始";
}

breathButton.addEventListener("click", () => {
  if (breathInterval) {
    resetBreath();
    return;
  }

  breathButton.textContent = "重新开始";
  setBreathStep(stepIndex);

  breathInterval = setInterval(() => {
    remainingSeconds -= 1;
    breathTimer.textContent = remainingSeconds;

    if (remainingSeconds % 4 === 0) {
      stepIndex = (stepIndex + 1) % breathSteps.length;
      setBreathStep(stepIndex);
    }

    if (remainingSeconds <= 0) {
      clearInterval(breathInterval);
      breathInterval = null;
      breathVisual.className = "breath-visual";
      breathWord.textContent = "很棒";
      breathButton.textContent = "再来一次";
    }
  }, 1000);
});

const luckCardMarquee = document.querySelector("#luckCardMarquee");
const luckCardRows = [
  [1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23, 24]
];

if (luckCardMarquee) {
  luckCardRows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "luck-marquee-row";

    const track = document.createElement("div");
    track.className = "luck-marquee-track";

    [...row, ...row].forEach((cardNumber) => {
      const image = document.createElement("img");
      image.className = "luck-card-image";
      image.src = `assets/luck-cards/card-${String(cardNumber).padStart(2, "0")}.webp`;
      enableImageFallback(image);
      image.alt = `好运卡片 ${cardNumber}`;
      image.loading = "lazy";
      image.decoding = "async";
      track.appendChild(image);
    });

    rowEl.appendChild(track);
    luckCardMarquee.appendChild(rowEl);
  });

  pauseMarqueeOffscreen(luckCardMarquee);
}

const couplePhotoMarquee = document.querySelector("#couplePhotoMarquee");
const couplePhotoNumbers = Array.from({ length: 24 }, (_, index) => index + 1);

if (couplePhotoMarquee) {
  const track = document.createElement("div");
  track.className = "couple-photo-track";

  [...couplePhotoNumbers, ...couplePhotoNumbers].forEach((photoNumber) => {
    const image = document.createElement("img");
    image.className = "couple-photo-image";
    image.src = `assets/couple-marquee/couple-${String(photoNumber).padStart(2, "0")}.webp`;
    enableImageFallback(image);
    image.alt = `我们的合照 ${photoNumber}`;
    image.loading = "lazy";
    image.decoding = "async";
    track.appendChild(image);
  });

  couplePhotoMarquee.appendChild(track);
  pauseMarqueeOffscreen(couplePhotoMarquee);
}
