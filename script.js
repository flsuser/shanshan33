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

const luckCards = [
  { number: 1, title: "给等消息的你", text: "消息还没来，不代表你不够好。只是生活还在整理它要送给你的答案。", image: "assets/luck-cards/card-01.webp" },
  { number: 2, title: "给睡不着的你", text: "今天已经很辛苦了。现在最重要的任务，是让明天的你醒来时轻一点。", image: "assets/luck-cards/card-02.webp" },
  { number: 3, title: "给怀疑自己的你", text: "你一路走到这里，靠的不是运气。你的认真，本来就有重量。", image: "assets/luck-cards/card-03.webp" },
  { number: 4, title: "给收到好消息的你", text: "我就知道你可以。今天不许谦虚太多，我们要好好庆祝。", image: "assets/luck-cards/card-04.webp" },
  { number: 5, title: "给突然紧张的你", text: "先把肩膀放下来，深深呼一口气。你不用在这一秒解决整个人生。", image: "assets/luck-cards/card-05.webp" },
  { number: 6, title: "给认真准备的你", text: "那些看不见的努力没有白费，它们都在悄悄托住现在的你。", image: "assets/luck-cards/card-06.webp" },
  { number: 7, title: "给想哭的你", text: "想哭也没关系，眼泪不是失败，是身体在帮你把压力放出来一点。", image: "assets/luck-cards/card-07.webp" },
  { number: 8, title: "给不敢期待的你", text: "可以先不逼自己乐观。只要留一点点缝，让好事情有机会走进来。", image: "assets/luck-cards/card-08.webp" },
  { number: 9, title: "给觉得累的你", text: "累了就靠一会儿。不是所有勇敢都要站得笔直，有时候休息也是勇敢。", image: "assets/luck-cards/card-09.webp" },
  { number: 10, title: "给反复刷新消息的你", text: "屏幕不会因为多看一眼就更快。先把自己照顾好，答案会来的。", image: "assets/luck-cards/card-10.webp" },
  { number: 11, title: "给害怕落空的你", text: "就算结果没有按想象出现，你也不会一个人掉下去。我会接住你。", image: "assets/luck-cards/card-11.webp" },
  { number: 12, title: "给已经很棒的你", text: "你不需要再多证明一点才值得被喜欢。现在的你，就已经很好。", image: "assets/luck-cards/card-12.webp" },
  { number: 13, title: "给想要答案的你", text: "等待最折磨人的地方，是它假装一切都由你负责。其实不是的。", image: "assets/luck-cards/card-13.webp" },
  { number: 14, title: "给努力撑住的你", text: "撑了这么久，辛苦了。今天可以少一点苛责，多一点热水和拥抱。", image: "assets/luck-cards/card-14.webp" },
  { number: 15, title: "给怕麻烦别人的你", text: "你不是麻烦。你被爱的时候，不需要先把自己整理得很体面。", image: "assets/luck-cards/card-15.webp" },
  { number: 16, title: "给心跳很快的你", text: "这只是紧张在经过，不是危险真的来了。我们慢慢数到十。", image: "assets/luck-cards/card-16.webp" },
  { number: 17, title: "给想逃开的你", text: "可以先躲进一杯热饮、一首歌、一个拥抱里。缓一缓再继续。", image: "assets/luck-cards/card-17.webp" },
  { number: 18, title: "给觉得自己不够好的你", text: "你不是一份待批改的试卷。你是一个一直认真生活的人。", image: "assets/luck-cards/card-18.webp" },
  { number: 19, title: "给快要放弃的你", text: "先别急着给自己下结论。今天只要过完今天，就已经很厉害了。", image: "assets/luck-cards/card-19.webp" },
  { number: 20, title: "给需要好运的你", text: "好运不是只给完美的人。它也会偏爱认真、善良、偶尔慌张的你。", image: "assets/luck-cards/card-20.webp" },
  { number: 21, title: "给想被肯定的你", text: "我看见了，你真的走了很远很远。那些坚持，都值得被认真夸奖。", image: "assets/luck-cards/card-21.webp" },
  { number: 22, title: "给开始胡思乱想的你", text: "脑袋里的坏剧本不等于现实。先暂停播放，回到眼前这一分钟。", image: "assets/luck-cards/card-22.webp" },
  { number: 23, title: "给今天也坚持的你", text: "你不必每一天都闪闪发光。能继续往前一点点，就很了不起。", image: "assets/luck-cards/card-23.webp" },
  { number: 24, title: "给被爱着的你", text: "不管消息怎样来，我都在你这一边。你不是一个人在等。", image: "assets/luck-cards/card-24.webp" },
  { number: 25, title: "给未来突然变亮的你", text: "也许某个普通瞬间，答案会轻轻落下。那时你会发现：这段等待没有偷走你的光。" }
];

const luckCardMarquee = document.querySelector("#luckCardMarquee");
const luckCardPicker = document.querySelector("#luckCardPicker");
const luckDrawButton = document.querySelector("#luckDrawButton");
const selectedLuckTitle = document.querySelector("#selectedLuckTitle");
const selectedLuckText = document.querySelector("#selectedLuckText");
const luckCardRows = [
  luckCards.slice(0, 8),
  luckCards.slice(8, 16),
  luckCards.slice(16, 25)
];
let selectedLuckNumber = 1;

function selectLuckCard(card) {
  selectedLuckNumber = card.number;
  selectedLuckTitle.textContent = card.title;
  selectedLuckText.textContent = card.text;

  document.querySelectorAll(".luck-card-button").forEach((button) => {
    const isSelected = Number(button.dataset.cardNumber) === selectedLuckNumber;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });

  document.querySelectorAll(".luck-picker-card").forEach((button) => {
    const isSelected = Number(button.dataset.cardNumber) === selectedLuckNumber;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
}

function createLuckCardButton(card) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = card.image ? "luck-card-button" : "luck-card-button luck-card-note";
  button.dataset.cardNumber = card.number;
  button.setAttribute("aria-label", `打开第 ${card.number} 封好运小信：${card.title}`);
  button.setAttribute("aria-pressed", "false");

  if (card.image) {
    const image = document.createElement("img");
    image.className = "luck-card-image";
    image.src = card.image;
    enableImageFallback(image);
    image.alt = `好运卡片 ${card.number}`;
    image.loading = "lazy";
    image.decoding = "async";
    button.appendChild(image);
  } else {
    const number = document.createElement("span");
    number.className = "luck-note-number";
    number.textContent = "25";

    const title = document.createElement("strong");
    title.textContent = card.title;

    const text = document.createElement("span");
    text.textContent = card.text;

    button.append(number, title, text);
  }

  button.addEventListener("click", () => selectLuckCard(card));
  return button;
}

function createLuckPickerCard(card) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "luck-picker-card";
  button.dataset.cardNumber = card.number;
  button.setAttribute("aria-label", `抽取第 ${card.number} 封：${card.title}`);
  button.setAttribute("aria-pressed", "false");

  const number = document.createElement("span");
  number.textContent = String(card.number).padStart(2, "0");

  const title = document.createElement("strong");
  title.textContent = card.title;

  button.append(number, title);
  button.addEventListener("click", () => selectLuckCard(card));
  return button;
}

if (luckCardPicker) {
  luckCards.forEach((card) => {
    luckCardPicker.appendChild(createLuckPickerCard(card));
  });
}

if (luckCardMarquee) {
  luckCardRows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "luck-marquee-row";

    const track = document.createElement("div");
    track.className = "luck-marquee-track";

    [...row, ...row].forEach((card) => {
      track.appendChild(createLuckCardButton(card));
    });

    rowEl.appendChild(track);
    luckCardMarquee.appendChild(rowEl);
  });

  selectLuckCard(luckCards[0]);
  pauseMarqueeOffscreen(luckCardMarquee);
}

if (luckDrawButton) {
  luckDrawButton.addEventListener("click", () => {
    const nextCards = luckCards.filter((card) => card.number !== selectedLuckNumber);
    const randomCard = nextCards[Math.floor(Math.random() * nextCards.length)];
    selectLuckCard(randomCard);
  });
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
