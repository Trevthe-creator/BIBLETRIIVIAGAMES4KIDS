let questions = {
    lower: [
        { q: "Who built the ark?", a: ["Moses", "Noah", "David", "Abraham"], correct: 1 },
        { q: "What is the first book of the Bible?", a: ["Matthew", "Exodus", "Genesis", "Psalms"], correct: 2 },
        { q: "Who was swallowed by a big fish?", a: ["Jonah", "Peter", "Paul", "John"], correct: 0 }
    ],
    upper: [
        { q: "How many days did God take to create the world?", a: ["5", "6", "7", "8"], correct: 1 },
        { q: "Who led the Israelites out of Egypt?", a: ["Moses", "Aaron", "Joshua", "Joseph"], correct: 0 },
        { q: "Where was Jesus born?", a: ["Nazareth", "Bethlehem", "Jerusalem", "Capernaum"], correct: 1 }
    ]
};

let selectedAge = "lower";
let currentQIndex = 0;
let score = 0;
let timer;
let timePerQuestion = 30;
let currentQuestionSet = [];

window.selectAge = function (ageGroup) {
    selectedAge = ageGroup;
    document.getElementById("ageSelection").classList.remove("active");
    document.getElementById("timerSetup").classList.add("active");
};

document.getElementById("timeSlider").addEventListener("input", function () {
    timePerQuestion = parseInt(this.value);
    document.getElementById("timeDisplay").textContent = timePerQuestion + "s";
});

window.startGame = function () {
    currentQuestionSet = [...questions[selectedAge]];
    currentQIndex = 0;
    score = 0;
    document.getElementById("scoreValue").textContent = score;
    document.getElementById("totalQ").textContent = currentQuestionSet.length;

    document.getElementById("timerSetup").classList.remove("active");
    document.getElementById("gameScreen").classList.add("active");

    loadQuestion();
};

function loadQuestion() {
    if (currentQIndex >= currentQuestionSet.length) {
        endGame();
        return;
    }

    let qData = currentQuestionSet[currentQIndex];
    document.getElementById("questionText").textContent = qData.q;
    document.getElementById("currentQ").textContent = currentQIndex + 1;

    let answerButtons = document.querySelectorAll("#answersGrid button");
    answerButtons.forEach((btn, idx) => {
        btn.textContent = qData.a[idx];
        btn.disabled = false;
    });

    startTimer();
}

function startTimer() {
    let timeLeft = timePerQuestion;
    document.getElementById("timerDisplay").textContent = timeLeft + "s";

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timerDisplay").textContent = timeLeft + "s";
        if (timeLeft <= 0) {
            clearInterval(timer);
            showFeedback(false);
        }
    }, 1000);
}

window.selectAnswer = function (index) {
    clearInterval(timer);
    let qData = currentQuestionSet[currentQIndex];
    let isCorrect = index === qData.correct;
    if (isCorrect) score++;
    document.getElementById("scoreValue").textContent = score;
    showFeedback(isCorrect);
};

function showFeedback(correct) {
    let feedback = document.getElementById("feedback");
    let content = document.getElementById("feedbackContent");
    let celebration = document.getElementById("celebration");

    feedback.classList.remove("hidden");
    if (correct) {
        content.textContent = "✅ Correct!";
        celebration.classList.remove("hidden");
        setTimeout(() => celebration.classList.add("hidden"), 1000);
    } else {
        let correctAnswer = currentQuestionSet[currentQIndex].a[currentQuestionSet[currentQIndex].correct];
        content.textContent = "❌ Oops! Correct answer: " + correctAnswer;
    }

    setTimeout(() => {
        feedback.classList.add("hidden");
        currentQIndex++;
        loadQuestion();
    }, 1500);
}

function endGame() {
    alert(`Game Over! Your score: ${score}/${currentQuestionSet.length}`);
    restartGame();
}

window.restartGame = function () {
    clearInterval(timer);
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("ageSelection").classList.add("active");
};