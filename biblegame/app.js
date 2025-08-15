/* Joyful Bible Trivia Logic */

// --- Simple cartoon SVGs in /assets are referenced from HTML/CSS ---

// Questions per age group
const QUESTIONS = {
  lower: [
    {
      q: "Who built a big boat to save animals from the flood?",
      choices: ["Noah", "Moses", "David", "Paul"],
      answer: "Noah",
      img: "assets/cartoon-ark.svg"
    },
    {
      q: "What did God create on the first day?",
      choices: ["Light", "Animals", "People", "Rainbows"],
      answer: "Light",
      img: "assets/cartoon-creation.svg"
    },
    {
      q: "Who was swallowed by a big fish?",
      choices: ["Jonah", "Peter", "Joshua", "Joseph"],
      answer: "Jonah",
      img: "assets/cartoon-fish.svg"
    },
    {
      q: "Where was baby Jesus born?",
      choices: ["Bethlehem", "Nazareth", "Jerusalem", "Rome"],
      answer: "Bethlehem",
      img: "assets/cartoon-manger.svg"
    },
    {
      q: "What is the special book about God called?",
      choices: ["The Bible", "A Cookbook", "A Map", "A Storybook"],
      answer: "The Bible",
      img: "assets/cartoon-bible.svg"
    }
  ],
  upper: [
    {
      q: "Who led the Israelites out of Egypt?",
      choices: ["Moses", "Abraham", "Samuel", "Solomon"],
      answer: "Moses",
      img: "assets/cartoon-redsea.svg"
    },
    {
      q: "How many days did God take to create the world?",
      choices: ["6 days, resting on the 7th", "4 days", "7 days of work", "10 days"],
      answer: "6 days, resting on the 7th",
      img: "assets/cartoon-creation.svg"
    },
    {
      q: "Which boy defeated a giant named Goliath?",
      choices: ["David", "Jacob", "Elijah", "Nehemiah"],
      answer: "David",
      img: "assets/cartoon-sling.svg"
    },
    {
      q: "Who was thrown into the lions’ den and God protected him?",
      choices: ["Daniel", "Job", "Ezra", "Caleb"],
      answer: "Daniel",
      img: "assets/cartoon-lion.svg"
    },
    {
      q: "What is the first book of the Bible?",
      choices: ["Genesis", "Exodus", "Psalms", "Matthew"],
      answer: "Genesis",
      img: "assets/cartoon-bible.svg"
    }
  ]
};

// Screens
const screens = {
  welcome: document.getElementById("screen-welcome"),
  settings: document.getElementById("screen-settings"),
  quiz: document.getElementById("screen-quiz"),
  results: document.getElementById("screen-results"),
};

// Elements
const btnStart = document.getElementById("btn-start");
const btnBack = document.getElementById("btn-back");
const btnReplay = document.getElementById("btn-replay");
const btnHome = document.getElementById("btn-home");

const timeValueInput = document.getElementById("time-value");
const timeUnitSelect = document.getElementById("time-unit");

const hudAge = document.getElementById("hud-age");
const hudQ = document.getElementById("hud-q");
const hudTotal = document.getElementById("hud-total");
const hudTime = document.getElementById("hud-time");
const hudScore = document.getElementById("hud-score");

const qText = document.getElementById("question-text");
const qImg = document.getElementById("q-illustration");
const choicesWrap = document.getElementById("choices");
const feedback = document.getElementById("feedback");

const finalScore = document.getElementById("final-score");
const finalTotal = document.getElementById("final-total");

// State
let ageGroup = null; // "lower" or "upper"
let pool = [];
let idx = 0;
let score = 0;
let perQuestionTime = 20; // seconds
let timerId = null;
let revealTimeout = null;

// Navigation helpers
function show(screenName){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[screenName].classList.add("active");
}

function secondsFromSettings(){
  const v = Number(timeValueInput.value || 0);
  const unit = timeUnitSelect.value;
  if(unit === "minutes") return Math.max(5, Math.min(300, v * 60));
  return Math.max(5, Math.min(300, v));
}

// Wire age selection
document.querySelectorAll(".age-card").forEach(btn => {
  btn.addEventListener("click", () => {
    ageGroup = btn.dataset.age; // lower / upper
    show("settings");
  });
});

btnBack.addEventListener("click", () => {
  show("welcome");
});

btnStart.addEventListener("click", () => {
  perQuestionTime = secondsFromSettings();
  startGame();
});

btnReplay.addEventListener("click", () => {
  show("welcome");
});

btnHome?.addEventListener("click", () => {
  show("welcome");
});

function startGame(){
  // Prepare the question pool for the selected age group
  pool = shuffle([...QUESTIONS[ageGroup]]);
  idx = 0;
  score = 0;
  hudScore.textContent = "0";
  hudAge.textContent = ageGroup === "lower" ? "1–7" : "8–10";
  hudTotal.textContent = pool.length;
  feedback.textContent = "";
  feedback.className = "feedback";
  show("quiz");
  nextQuestion();
}

function nextQuestion(){
  clearTimeout(revealTimeout);
  clearInterval(timerId);
  if(idx >= pool.length){
    // End
    finalScore.textContent = String(score);
    finalTotal.textContent = String(pool.length);
    show("results");
    return;
  }
  const q = pool[idx];
  hudQ.textContent = String(idx + 1);
  qText.textContent = q.q;
  qImg.src = q.img;
  // build choices
  const options = shuffle([...q.choices]);
  choicesWrap.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => onChoose(opt, q.answer, btn));
    choicesWrap.appendChild(btn);
  });

  // start timer
  startTimer(perQuestionTime, () => {
    // time up -> mark incorrect and reveal after 5s
    setButtonsDisabled(true);
    feedback.textContent = "Time’s up! The correct answer will appear…";
    feedback.className = "feedback bad";
    revealTimeout = setTimeout(() => {
      highlightCorrect(q.answer);
      idx++;
      nextQuestion();
    }, 5000);
  });
}

function onChoose(choice, answer, btnEl){
  clearInterval(timerId);
  setButtonsDisabled(true);
  if(choice === answer){
    btnEl.classList.add("correct");
    feedback.textContent = "Correct! Great job! 🎉";
    feedback.className = "feedback ok";
    score++;
    hudScore.textContent = String(score);
    celebrate();
    setTimeout(() => {
      idx++;
      nextQuestion();
    }, 1400);
  } else {
    btnEl.classList.add("incorrect");
    feedback.textContent = "Incorrect. Revealing the answer…";
    feedback.className = "feedback bad";
    revealTimeout = setTimeout(() => {
      highlightCorrect(answer);
      idx++;
      nextQuestion();
    }, 5000);
  }
}

function setButtonsDisabled(disabled){
  document.querySelectorAll(".choice-btn").forEach(b => b.disabled = disabled);
}

function highlightCorrect(answer){
  document.querySelectorAll(".choice-btn").forEach(b => {
    if(b.textContent === answer){
      b.classList.add("correct");
    }
  });
}

// Timer
function startTimer(seconds, onEnd){
  let remaining = seconds;
  renderTime(remaining);
  timerId = setInterval(() => {
    remaining--;
    renderTime(remaining);
    if(remaining <= 0){
      clearInterval(timerId);
      onEnd?.();
    }
  }, 1000);
}

function renderTime(sec){
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  hudTime.textContent = mm === "00" ? ss : `${mm}:${ss}`;
}

// Shuffle helper
function shuffle(arr){
  for(let i=arr.length-1; i>0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- Confetti celebration ---
const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");
let confettiPieces = [];
let confettiAnimationId = null;

function resizeCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createConfetti(){
  const colors = ["#ff7ac6","#6ad1ff","#ffd166","#95f9c3","#b28dff","#ff9f9f"];
  for(let i=0;i<140;i++){
    confettiPieces.push({
      x: Math.random()*confettiCanvas.width,
      y: Math.random()*-confettiCanvas.height,
      r: Math.random()*6+2,
      c: colors[Math.floor(Math.random()*colors.length)],
      s: Math.random()*2+1,
      a: Math.random()*360
    });
  }
}

function drawConfetti(){
  ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  confettiPieces.forEach(p=>{
    ctx.save();
    ctx.fillStyle = p.c;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.a*Math.PI)/180);
    ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*1.6);
    ctx.restore();
    p.y += p.s*2;
    p.x += Math.sin(p.y/20);
    p.a += p.s;
  });
  confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 20);
  if(confettiPieces.length > 0){
    confettiAnimationId = requestAnimationFrame(drawConfetti);
  } else {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }
}

function celebrate(){
  createConfetti();
  if(!confettiAnimationId){
    drawConfetti();
  }
}

// --- Minimal kid-cartoon SVG assets ---
const SVGs = {
  "bible-kids.svg": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 140'><rect width='140' height='140' rx='24' fill='#fff4fb'/><rect x='20' y='20' width='100' height='100' rx='14' fill='#ffd6ea' stroke='#ff7ac6' stroke-width='4'/><path d='M70 45 v50 M45 70 h50' stroke='#fff' stroke-width='10' stroke-linecap='round'/></svg>`,
  "jesus-kids.svg": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 140'><rect width='140' height='140' rx='24' fill='#f0fbff'/><circle cx='70' cy='55' r='20' fill='#ffd6b3'/><rect x='40' y='72' width='60' height='36' rx='12' fill='#c9f2ff'/><path d='M70 30 a20 20 0 0 1 0 40' fill='none' stroke='#6ad1ff' stroke-width='6'/></svg>`,
  "cartoon-bible.svg": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' rx='20' fill='#fff'/><rect x='20' y='20' width='80' height='80' rx='12' fill='#7c3aed'/><path d='M60 38 v44 M38 60 h44' stroke='#fff' stroke-width='10' stroke-linecap='round'/></svg>`,
  "cartoon-ark.svg": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' rx='20' fill='#e0f7ff'/><path d='M20 70 h80 l-10 20 h-60 z' fill='#b08968'/><rect x='35' y='45' width='50' height='25' rx='6' fill='#d2b48c'/></svg>`,
  "cartoon-creation.svg": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' rx='20' fill='#fff7ec'/><circle cx='40' cy='40' r='18' fill='#ffd166'/><circle cx='80' cy='80' r='18' fill='#6ad1ff'/></svg>`,
  "cartoon-fish.svg": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' rx='20' fill='#e6fffb'/><path d='M30 60 q20 -20 40 0 q-20 20 -40 0 z' fill='#34d399'/><circle cx='40' cy='58' r='3' fill='#111827'/></svg>`,
  "cartoon-manger.svg": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' rx='20' fill='#fff8e1'/><path d='M30 70 h60 l-10 15 h-40 z' fill='#d4a373'/><circle cx='60' cy='55' r='10' fill='#ffd6b3'/></svg>`,
  "cartoon-redsea.svg": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' rx='20' fill='#e0f2fe'/><path d='M20 90 q20 -40 40 0 q20 -40 40 0' stroke='#3b82f6' stroke-width='8' fill='none'/></svg>`,
  "cartoon-sling.svg": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' rx='20' fill='#f5f3ff'/><path d='M40 80 q20 -20 40 0' stroke='#7c3aed' stroke-width='8' fill='none'/><circle cx='60' cy='70' r='6' fill='#7c3aed'/></svg>`,
  "cartoon-lion.svg": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' rx='20' fill='#fff7ed'/><circle cx='60' cy='60' r='20' fill='#f59e0b'/><circle cx='52' cy='58' r='3' fill='#111827'/><circle cx='68' cy='58' r='3' fill='#111827'/></svg>`
};

// Write SVG assets to /assets (first run only)
(function ensureAssets(){
  const a = document.createElement("a");
  a.href = "#";
})();

// Because we're running as static files, populate the SVGs by fetching via data URL trick:
Object.entries(SVGs).forEach(([name, svg]) => {
  const blob = new Blob([svg], {type:"image/svg+xml"});
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => URL.revokeObjectURL(url);
  img.src = url;
  // also assign to any <img> that matches later by name via swap when needed
  // we map the name to an object URL for quick use
  SVGs[name] = url;
});

// swap placeholder paths to object URLs on load & when changing questions
const originalSetSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
Object.defineProperty(HTMLImageElement.prototype, 'src', {
  set: function(value){
    const key = (value||"").split("/").pop();
    if(SVGs[key]){
      originalSetSrc.call(this, SVGs[key]);
    }else{
      originalSetSrc.call(this, value);
    }
  }
});

