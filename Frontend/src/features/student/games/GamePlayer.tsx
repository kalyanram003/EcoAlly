import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Trophy, Clock, Star } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface GamePlayerProps {
  game: {
    id: string;
    title: string;
    description: string;
    type: "quiz" | "memory" | "sorting" | "matching";
    points: number;
    timeLimit?: number;
    questions?: any[];
    content?: any;
  };
  onBack: () => void;
  onComplete: (score: number, timeSpent: number) => void;
}

// Eco-themed game data
const ECO_GAMES = {
  "waste-sorting": {
    title: "Waste Sorting Challenge",
    items: [
      { name: "Plastic Bottle", category: "recyclable", emoji: "🍼" },
      { name: "Banana Peel", category: "organic", emoji: "🍌" },
      { name: "Glass Jar", category: "recyclable", emoji: "🫙" },
      { name: "Apple Core", category: "organic", emoji: "🍎" },
      { name: "Paper", category: "recyclable", emoji: "📄" },
      { name: "Battery", category: "hazardous", emoji: "🔋" },
      { name: "Tin Can", category: "recyclable", emoji: "🥫" },
      { name: "Coffee Grounds", category: "organic", emoji: "☕" },
    ],
    bins: [
      { id: "recyclable", name: "Recyclable", color: "bg-blue-100", emoji: "♻️" },
      { id: "organic", name: "Organic", color: "bg-green-100", emoji: "🌱" },
      { id: "hazardous", name: "Hazardous", color: "bg-red-100", emoji: "⚠️" },
    ]
  },
  "carbon-memory": {
    title: "Carbon Footprint Memory",
    cards: [
      { id: 1, emoji: "🚗", text: "Car", pair: 2 },
      { id: 2, emoji: "🚴", text: "Bike", pair: 1 },
      { id: 3, emoji: "🥩", text: "Beef", pair: 4 },
      { id: 4, emoji: "🥕", text: "Vegetables", pair: 3 },
      { id: 5, emoji: "💡", text: "LED Bulb", pair: 6 },
      { id: 6, emoji: "🔆", text: "Incandescent", pair: 5 },
      { id: 7, emoji: "🛒", text: "Local Food", pair: 8 },
      { id: 8, emoji: "✈️", text: "Imported Food", pair: 7 },
    ]
  },
  "environmental-quiz": {
    title: "Environmental Knowledge Quiz",
    questions: [
      {
        question: "What percentage of plastic waste is actually recycled globally?",
        options: ["9%", "25%", "45%", "60%"],
        correct: 0,
        explanation: "Only about 9% of all plastic ever produced has been recycled. Most ends up in landfills or the environment."
      },
      {
        question: "Which transportation method has the lowest carbon footprint?",
        options: ["Electric car", "Public bus", "Bicycle", "Walking"],
        correct: 3,
        explanation: "Walking has zero carbon emissions and is the most environmentally friendly way to travel."
      },
      {
        question: "How much water does it take to produce one hamburger?",
        options: ["50 gallons", "200 gallons", "660 gallons", "1000 gallons"],
        correct: 2,
        explanation: "It takes approximately 660 gallons of water to produce one hamburger, including water for the cow, feed production, and processing."
      },
      {
        question: "What is the most effective way to reduce your carbon footprint?",
        options: ["Recycle more", "Use LED bulbs", "Eat less meat", "Drive less"],
        correct: 2,
        explanation: "Reducing meat consumption, especially beef, is one of the most impactful individual actions for reducing carbon footprint."
      },
      {
        question: "Which renewable energy source is growing fastest globally?",
        options: ["Solar", "Wind", "Hydroelectric", "Geothermal"],
        correct: 0,
        explanation: "Solar energy is the fastest-growing renewable energy source, with costs dropping dramatically in recent years."
      }
    ]
  },
  "sustainable-matching": {
    title: "Sustainable Living Matches",
    pairs: [
      { id: 1, item: "Plastic bags", match: "Reusable bags", emoji1: "🛍️", emoji2: "♻️" },
      { id: 2, item: "Paper towels", match: "Cloth towels", emoji1: "🧻", emoji2: "🧽" },
      { id: 3, item: "Disposable bottles", match: "Reusable bottles", emoji1: "🍼", emoji2: "🚰" },
      { id: 4, item: "Fast fashion", match: "Thrift shopping", emoji1: "👕", emoji2: "👔" },
      { id: 5, item: "Driving alone", match: "Public transport", emoji1: "🚗", emoji2: "🚌" },
      { id: 6, item: "Food waste", match: "Composting", emoji1: "🗑️", emoji2: "🌱" },
    ]
  }
};

export function GamePlayer({ game, onBack, onComplete }: GamePlayerProps) {
  const [gameState, setGameState] = useState<any>({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.timeLimit || 300);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (gameStarted && !gameCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      handleGameComplete();
    }
  }, [timeLeft, gameStarted, gameCompleted]);

  const startGame = () => {
    setGameStarted(true);
    initializeGame();
  };

  const initializeGame = () => {
    if (game.type === "sorting") {
      const gameData = ECO_GAMES["waste-sorting"];
      setGameState({
        items: [...gameData.items].sort(() => Math.random() - 0.5),
        bins: gameData.bins,
        sorted: {},
        correctSorts: 0
      });
    } else if (game.type === "memory") {
      const gameData = ECO_GAMES["carbon-memory"];
      const shuffledCards = [...gameData.cards, ...gameData.cards]
        .sort(() => Math.random() - 0.5)
        .map((card, index) => ({ ...card, tempId: index, flipped: false, matched: false }));
      setGameState({
        cards: shuffledCards,
        flippedCards: [],
        matchedPairs: 0,
        moves: 0
      });
    } else if (game.type === "quiz") {
      const gameData = ECO_GAMES["environmental-quiz"];
      setGameState({
        questions: [...gameData.questions].sort(() => Math.random() - 0.5),
        currentQuestion: 0,
        selectedOption: null
      });
    } else if (game.type === "matching") {
      const gameData = ECO_GAMES["sustainable-matching"];
      setGameState({
        pairs: [...gameData.pairs].sort(() => Math.random() - 0.5),
        currentPair: 0,
        selectedOption: null
      });
    }
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    const timeSpent = (game.timeLimit || 300) - timeLeft;
    onComplete(score, timeSpent);
  };

  const resetGame = () => {
    setGameState({});
    setScore(0);
    setTimeLeft(game.timeLimit || 300);
    setGameStarted(false);
    setGameCompleted(false);
  };

  const renderSortingGame = () => {
    const handleDrop = (item: any, binId: string) => {
      const isCorrect = item.category === binId;
      const newSorted = { ...gameState.sorted };
      newSorted[item.name] = binId;
      
      const newCorrectSorts = gameState.correctSorts + (isCorrect ? 1 : 0);
      const newScore = isCorrect ? score + 10 : Math.max(0, score - 5);
      
      setGameState({
        ...gameState,
        sorted: newSorted,
        correctSorts: newCorrectSorts
      });
      setScore(newScore);

      if (Object.keys(newSorted).length === gameState.items.length) {
        handleGameComplete();
      }
    };

    const unsortedItems = gameState.items?.filter((item: any) => !gameState.sorted[item.name]) || [];

    return (
      <div className="space-y-6">
        {/* Items to sort */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-medium mb-3">Items to Sort</h3>
          <div className="flex flex-wrap gap-2">
            {unsortedItems.map((item: any) => (
              <div
                key={item.name}
                className="bg-white rounded-lg p-3 border-2 border-dashed border-gray-300 cursor-move flex items-center gap-2"
                draggable
                onDragStart={(e) => e.dataTransfer.setData("item", JSON.stringify(item))}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sorting bins */}
        <div className="space-y-3">
          {gameState.bins?.map((bin: any) => (
            <div
              key={bin.id}
              className={`${bin.color} rounded-xl p-4 border-2 border-dashed border-gray-400 min-h-[80px]`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const item = JSON.parse(e.dataTransfer.getData("item"));
                handleDrop(item, bin.id);
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{bin.emoji}</span>
                <span className="font-medium">{bin.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {gameState.items?.filter((item: any) => gameState.sorted[item.name] === bin.id).map((item: any) => (
                  <div key={item.name} className="bg-white rounded-lg p-2 flex items-center gap-1">
                    <span>{item.emoji}</span>
                    <span className="text-xs">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMemoryGame = () => {
    const handleCardClick = (cardIndex: number) => {
      if (gameState.flippedCards.length === 2) return;
      if (gameState.cards[cardIndex].flipped || gameState.cards[cardIndex].matched) return;

      const newCards = [...gameState.cards];
      newCards[cardIndex].flipped = true;
      const newFlippedCards = [...gameState.flippedCards, cardIndex];
      
      setGameState({
        ...gameState,
        cards: newCards,
        flippedCards: newFlippedCards,
        moves: gameState.moves + 1
      });

      if (newFlippedCards.length === 2) {
        const [first, second] = newFlippedCards;
        const firstCard = newCards[first];
        const secondCard = newCards[second];
        
        setTimeout(() => {
          if (firstCard.pair === secondCard.id || secondCard.pair === firstCard.id) {
            // Match found
            newCards[first].matched = true;
            newCards[second].matched = true;
            const newMatchedPairs = gameState.matchedPairs + 1;
            setScore(score + 20);
            
            setGameState({
              ...gameState,
              cards: newCards,
              flippedCards: [],
              matchedPairs: newMatchedPairs
            });

            if (newMatchedPairs === gameState.cards.length / 2) {
              handleGameComplete();
            }
          } else {
            // No match
            newCards[first].flipped = false;
            newCards[second].flipped = false;
            setGameState({
              ...gameState,
              cards: newCards,
              flippedCards: []
            });
          }
        }, 1000);
      }
    };

    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Match eco-friendly alternatives with their high-carbon counterparts</p>
          <p className="text-sm font-medium">Moves: {gameState.moves} | Matches: {gameState.matchedPairs}/{(gameState.cards?.length || 0) / 2}</p>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {gameState.cards?.map((card: any, index: number) => (
            <div
              key={card.tempId}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                card.flipped || card.matched
                  ? "bg-white border-2 border-[#2ECC71]"
                  : "bg-[#2ECC71] hover:bg-[#27AE60]"
              }`}
              onClick={() => handleCardClick(index)}
            >
              {card.flipped || card.matched ? (
                <>
                  <span className="text-2xl mb-1">{card.emoji}</span>
                  <span className="text-xs text-center">{card.text}</span>
                </>
              ) : (
                <span className="text-2xl text-white">?</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuizGame = () => {
    const handleOptionSelect = (optionIndex: number) => {
      const question = gameState.questions[gameState.currentQuestion];
      const isCorrect = optionIndex === question.correct;
      const newScore = isCorrect ? score + 20 : score;
      
      setScore(newScore);
      setGameState({
        ...gameState,
        selectedOption: optionIndex
      });

      // Show explanation briefly, then move to next question
      setTimeout(() => {
        if (gameState.currentQuestion < gameState.questions.length - 1) {
          setGameState({
            ...gameState,
            currentQuestion: gameState.currentQuestion + 1,
            selectedOption: null
          });
        } else {
          handleGameComplete();
        }
      }, 2000);
    };

    const currentQuestion = gameState.questions[gameState.currentQuestion];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Question {gameState.currentQuestion + 1} of {gameState.questions.length}</p>
          <p className="text-sm font-medium">Score: {score}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6">
          <h3 className="font-semibold mb-4 text-lg">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border-2 border-transparent hover:border-[#2ECC71]"
                onClick={() => handleOptionSelect(index)}
                disabled={gameState.selectedOption !== null}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#2ECC71] text-white rounded-full flex items-center justify-center font-medium">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {gameState.selectedOption !== null && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMatchingGame = () => {
    const handleMatchSelect = (isCorrectMatch: boolean) => {
      const newScore = isCorrectMatch ? score + 15 : score;
      setScore(newScore);
      setGameState({
        ...gameState,
        selectedOption: isCorrectMatch
      });

      // Move to next pair
      setTimeout(() => {
        if (gameState.currentPair < gameState.pairs.length - 1) {
          setGameState({
            ...gameState,
            currentPair: gameState.currentPair + 1,
            selectedOption: null
          });
        } else {
          handleGameComplete();
        }
      }, 1500);
    };

    const currentPair = gameState.pairs[gameState.currentPair];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Pair {gameState.currentPair + 1} of {gameState.pairs.length}</p>
          <p className="text-sm font-medium">Score: {score}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6">
          <h3 className="font-semibold mb-2">Find the sustainable alternative for:</h3>
          
          <div className="bg-red-50 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-3xl">{currentPair.emoji1}</span>
            <div>
              <h4 className="font-medium text-red-800">{currentPair.item}</h4>
              <p className="text-sm text-red-600">Unsustainable option</p>
            </div>
          </div>

          <p className="font-medium mb-4">Choose the eco-friendly alternative:</p>
          
          <div className="space-y-3">
            <button
              className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border-2 border-transparent hover:border-[#2ECC71] flex items-center gap-3"
              onClick={() => handleMatchSelect(true)}
              disabled={gameState.selectedOption !== null}
            >
              <span className="text-3xl">{currentPair.emoji2}</span>
              <div className="text-left">
                <h4 className="font-medium text-green-800">{currentPair.match}</h4>
                <p className="text-sm text-green-600">Sustainable option</p>
              </div>
            </button>
            
            <button
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border-2 border-transparent hover:border-gray-300 flex items-center gap-3"
              onClick={() => handleMatchSelect(false)}
              disabled={gameState.selectedOption !== null}
            >
              <span className="text-3xl">❌</span>
              <div className="text-left">
                <h4 className="font-medium text-gray-700">Keep using {currentPair.item}</h4>
                <p className="text-sm text-gray-500">Not sustainable</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameCompleted) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-[#2ECC71] rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Game Complete!</h2>
          <p className="text-gray-600 mb-6">Great job learning about environmental topics!</p>
          
          <div className="bg-white rounded-xl p-6 mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <span>Final Score:</span>
              <span className="font-semibold text-[#2ECC71]">{score} points</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Time Spent:</span>
              <span className="font-semibold">{formatTime((game.timeLimit || 300) - timeLeft)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Eco Points Earned:</span>
              <span className="font-semibold text-[#2ECC71]">+{Math.floor(score / 10)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={resetGame} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={onBack} className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60]">
              Back to Challenges
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold">{game.title}</h1>
        <div className="w-9"></div>
      </div>

      {!gameStarted ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-[#2ECC71] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">🎮</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
          <p className="text-gray-600 mb-6">{game.description}</p>
          
          <div className="bg-white rounded-xl p-4 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span>Points Available:</span>
              <span className="font-semibold text-[#2ECC71]">{game.points}</span>
            </div>
            {game.timeLimit && (
              <div className="flex justify-between items-center">
                <span>Time Limit:</span>
                <span className="font-semibold">{formatTime(game.timeLimit)}</span>
              </div>
            )}
          </div>

          <Button onClick={startGame} className="w-full bg-[#2ECC71] hover:bg-[#27AE60]">
            Start Game
          </Button>
        </div>
      ) : (
        <div>
          {/* Game stats */}
          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#2ECC71]" />
              <span className="font-medium">{score}</span>
            </div>
            {game.timeLimit && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className={`font-medium ${timeLeft < 30 ? 'text-red-600' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>

          {/* Game content */}
          {game.type === "sorting" && renderSortingGame()}
          {game.type === "memory" && renderMemoryGame()}
          {game.type === "quiz" && renderQuizGame()}
          {game.type === "matching" && renderMatchingGame()}
        </div>
      )}
    </div>
  );
}