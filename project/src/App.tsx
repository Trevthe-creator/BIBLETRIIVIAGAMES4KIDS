import React, { useState, useEffect } from 'react';
import { Clock, Star, Heart, Trophy, Sun, Moon } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  ageGroup: 'lower' | 'upper';
}

const questions: Question[] = [
  // Lower class (1-7 years)
  {
    id: 1,
    question: "Who built the big boat when it rained for many days?",
    options: ["Noah", "Moses", "David", "Jesus"],
    correct: 0,
    ageGroup: 'lower'
  },
  {
    id: 2,
    question: "What did God create on the first day?",
    options: ["Animals", "Trees", "Light", "Water"],
    correct: 2,
    ageGroup: 'lower'
  },
  {
    id: 3,
    question: "Who was swallowed by a big fish?",
    options: ["Peter", "Jonah", "Paul", "John"],
    correct: 1,
    ageGroup: 'lower'
  },
  {
    id: 4,
    question: "How many days was Jesus in the tomb?",
    options: ["One day", "Two days", "Three days", "Four days"],
    correct: 2,
    ageGroup: 'lower'
  },
  {
    id: 5,
    question: "What did Jesus use to feed 5,000 people?",
    options: ["Bread and fish", "Apples and honey", "Rice and beans", "Cookies and milk"],
    correct: 0,
    ageGroup: 'lower'
  },
  
  // Upper class (8-10 years)
  {
    id: 6,
    question: "In which city was Jesus born?",
    options: ["Jerusalem", "Nazareth", "Bethlehem", "Capernaum"],
    correct: 2,
    ageGroup: 'upper'
  },
  {
    id: 7,
    question: "How many disciples did Jesus choose?",
    options: ["Ten", "Eleven", "Twelve", "Thirteen"],
    correct: 2,
    ageGroup: 'upper'
  },
  {
    id: 8,
    question: "What was the first plague in Egypt?",
    options: ["Frogs", "Water turned to blood", "Locusts", "Darkness"],
    correct: 1,
    ageGroup: 'upper'
  },
  {
    id: 9,
    question: "Who was the strongest man in the Bible?",
    options: ["David", "Goliath", "Samson", "Solomon"],
    correct: 2,
    ageGroup: 'upper'
  },
  {
    id: 10,
    question: "How many books are in the New Testament?",
    options: ["25", "26", "27", "28"],
    correct: 2,
    ageGroup: 'upper'
  }
];

type GameState = 'ageSelection' | 'timerSetup' | 'playing' | 'feedback';

function App() {
  const [gameState, setGameState] = useState<GameState>('ageSelection');
  const [selectedAge, setSelectedAge] = useState<'lower' | 'upper' | null>(null);
  const [timeLimit, setTimeLimit] = useState(30);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (selectedAge) {
      const filteredQuestions = questions.filter(q => q.ageGroup === selectedAge);
      setGameQuestions(filteredQuestions);
    }
  }, [selectedAge]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const handleAgeSelection = (age: 'lower' | 'upper') => {
    setSelectedAge(age);
    setGameState('timerSetup');
  };

  const handleTimerSetup = () => {
    setTimeLeft(timeLimit);
    setGameState('playing');
  };

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === gameQuestions[currentQuestionIndex].correct;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        nextQuestion();
      }, 2000);
    } else {
      setTimeout(() => {
        nextQuestion();
      }, 5000);
    }
    
    setGameState('feedback');
  };

  const handleTimeUp = () => {
    setSelectedAnswer(-1);
    setIsCorrect(false);
    setGameState('feedback');
    setTimeout(() => {
      nextQuestion();
    }, 5000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(timeLimit);
      setGameState('playing');
    } else {
      // Game finished
      alert(`Game Over! Your final score: ${score}/${gameQuestions.length}`);
      restartGame();
    }
  };

  const restartGame = () => {
    setGameState('ageSelection');
    setSelectedAge(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setTimeLeft(30);
    setTimeLimit(30);
  };

  const currentQuestion = gameQuestions[currentQuestionIndex];

  if (gameState === 'ageSelection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-300 via-blue-400 to-purple-500 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">☁️</div>
          <div className="absolute top-20 right-20 text-4xl animate-pulse">⭐</div>
          <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-1000">🌈</div>
          <div className="absolute bottom-10 right-10 text-6xl animate-pulse delay-500">☀️</div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10 border-8 border-yellow-400">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-purple-800 mb-2">📖 Bible Trivia 📖</h1>
            <p className="text-lg text-gray-600">Choose your age group to start!</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => handleAgeSelection('lower')}
              className="w-full bg-gradient-to-r from-pink-400 to-red-400 text-white text-xl font-bold py-4 px-6 rounded-2xl hover:from-pink-500 hover:to-red-500 transform hover:scale-105 transition-all duration-200 shadow-lg border-4 border-pink-300"
            >
              🧸 Ages 1-7 🧸
              <div className="text-sm font-normal mt-1">Fun & Simple Questions</div>
            </button>
            
            <button
              onClick={() => handleAgeSelection('upper')}
              className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl font-bold py-4 px-6 rounded-2xl hover:from-green-500 hover:to-blue-500 transform hover:scale-105 transition-all duration-200 shadow-lg border-4 border-green-300"
            >
              🎓 Ages 8-10 🎓
              <div className="text-sm font-normal mt-1">Challenge Questions</div>
            </button>
          </div>
          
          <div className="mt-6 text-6xl animate-bounce">
            ✝️
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'timerSetup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-300 via-yellow-400 to-pink-400 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-16 left-16 text-4xl animate-spin">⭐</div>
          <div className="absolute top-32 right-24 text-5xl animate-bounce">🎵</div>
          <div className="absolute bottom-32 left-24 text-4xl animate-pulse">💫</div>
          <div className="absolute bottom-16 right-16 text-5xl animate-bounce delay-700">🌟</div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10 border-8 border-orange-400">
          <div className="mb-6">
            <Clock className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-orange-800 mb-2">⏰ Set Timer ⏰</h2>
            <p className="text-gray-600">How much time per question?</p>
          </div>

          <div className="mb-6">
            <div className="text-6xl font-bold text-purple-600 mb-4">{timeLimit}s</div>
            <input
              type="range"
              min="10"
              max="300"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>10s</span>
              <span>5min</span>
            </div>
          </div>

          <button
            onClick={handleTimerSetup}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold py-4 px-6 rounded-2xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg border-4 border-purple-300"
          >
            🚀 Start Playing! 🚀
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-400 to-pink-400 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 left-8 text-4xl animate-bounce">🕊️</div>
        <div className="absolute top-16 right-16 text-3xl animate-pulse">✨</div>
        <div className="absolute bottom-16 left-12 text-4xl animate-bounce delay-500">🌈</div>
        <div className="absolute bottom-8 right-8 text-3xl animate-pulse delay-1000">⭐</div>
        <div className="absolute top-1/2 left-4 text-2xl animate-bounce delay-300">🌟</div>
        <div className="absolute top-1/3 right-4 text-2xl animate-pulse delay-700">💫</div>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-6xl font-bold text-yellow-300 mb-4">CORRECT!</h2>
            <div className="text-4xl">⭐ 🌟 ✨ 💫 🌈</div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border-6 border-yellow-400">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-purple-800">Score: {score}</span>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">✝️</div>
              <div className="text-lg font-semibold text-gray-700">
                Question {currentQuestionIndex + 1} of {gameQuestions.length}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-red-500" />
              <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 border-6 border-blue-400 text-center">
          <div className="text-4xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "w-full p-6 text-lg font-bold rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg border-4 ";
            
            if (gameState === 'feedback') {
              if (index === currentQuestion.correct) {
                buttonClass += "bg-green-500 text-white border-green-400 animate-pulse";
              } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correct) {
                buttonClass += "bg-red-500 text-white border-red-400";
              } else {
                buttonClass += "bg-gray-300 text-gray-600 border-gray-300";
              }
            } else {
              const colors = [
                "bg-gradient-to-r from-red-400 to-pink-400 text-white border-red-300 hover:from-red-500 hover:to-pink-500",
                "bg-gradient-to-r from-blue-400 to-cyan-400 text-white border-blue-300 hover:from-blue-500 hover:to-cyan-500",
                "bg-gradient-to-r from-green-400 to-emerald-400 text-white border-green-300 hover:from-green-500 hover:to-emerald-500",
                "bg-gradient-to-r from-purple-400 to-indigo-400 text-white border-purple-300 hover:from-purple-500 hover:to-indigo-500"
              ];
              buttonClass += colors[index];
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={gameState === 'feedback'}
                className={buttonClass}
              >
                <div className="text-2xl mb-2">
                  {['🅰️', '🅱️', '🅲️', '🅳️'][index]}
                </div>
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {gameState === 'feedback' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center border-6 border-yellow-400">
            {isCorrect ? (
              <div className="text-green-600">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold mb-2">AMAZING!</h3>
                <p className="text-xl">You got it right! Great job! 🌟</p>
              </div>
            ) : (
              <div className="text-orange-600">
                <div className="text-6xl mb-4">🤗</div>
                <h3 className="text-3xl font-bold mb-2">Not quite!</h3>
                <p className="text-xl mb-4">The correct answer is:</p>
                <p className="text-2xl font-bold text-green-600">
                  {currentQuestion.options[currentQuestion.correct]} ✨
                </p>
                <p className="text-lg mt-4 text-gray-600">Keep learning and having fun! 📖</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Restart button */}
      <button
        onClick={restartGame}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-110 transition-all duration-200 border-4 border-purple-300"
        title="Restart Game"
      >
        🔄
      </button>
    </div>
  );
}

export default App;