import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Trophy, Clock, Star } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface KidsGamesProps {
  game: {
    id: string;
    title: string;
    description: string;
    type: "puzzle" | "snake" | "connect" | "word";
    points: number;
    timeLimit?: number;
  };
  onBack: () => void;
  onComplete: (score: number, timeSpent: number) => void;
}

export function KidsGames({ game, onBack, onComplete }: KidsGamesProps) {
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

  // Snake game logic
  useEffect(() => {
    if (game.type === "snake" && gameStarted && !gameCompleted) {
      const gameTimer = setInterval(() => {
        moveSnake();
      }, 300);
      return () => clearInterval(gameTimer);
    }
  }, [gameState.snake, gameState.direction, gameStarted, gameCompleted]);

  const startGame = () => {
    setGameStarted(true);
    initializeGame();
  };

  const initializeGame = () => {
    if (game.type === "puzzle") {
      const pieces = [
        { id: 1, emoji: "🌍", color: "bg-blue-200", placed: false, correctPos: 0 },
        { id: 2, emoji: "🌳", color: "bg-green-200", placed: false, correctPos: 1 },
        { id: 3, emoji: "☀️", color: "bg-yellow-200", placed: false, correctPos: 2 },
        { id: 4, emoji: "🌊", color: "bg-blue-300", placed: false, correctPos: 3 },
        { id: 5, emoji: "🦋", color: "bg-purple-200", placed: false, correctPos: 4 },
        { id: 6, emoji: "🌸", color: "bg-pink-200", placed: false, correctPos: 5 },
      ];
      setGameState({
        pieces: pieces.sort(() => Math.random() - 0.5),
        board: new Array(6).fill(null),
        completed: 0
      });
    } else if (game.type === "snake") {
      setGameState({
        snake: [{ x: 5, y: 5 }],
        direction: "right",
        food: generateFood(),
        badFood: generateBadFood(),
        gridSize: 10,
        gameOver: false
      });
    } else if (game.type === "connect") {
      setGameState({
        currentPattern: 0,
        patterns: [
          { 
            name: "Flower", 
            emoji: "🌸",
            dots: [
              { x: 1, y: 0, connected: false },
              { x: 0, y: 1, connected: false },
              { x: 1, y: 1, connected: false },
              { x: 2, y: 1, connected: false },
              { x: 1, y: 2, connected: false }
            ],
            connections: [[0, 2], [1, 2], [2, 3], [2, 4]],
            currentConnection: 0
          },
          {
            name: "Tree",
            emoji: "🌳", 
            dots: [
              { x: 1, y: 0, connected: false },
              { x: 0, y: 1, connected: false },
              { x: 1, y: 1, connected: false },
              { x: 2, y: 1, connected: false },
              { x: 1, y: 2, connected: false },
              { x: 1, y: 3, connected: false }
            ],
            connections: [[0, 2], [1, 2], [2, 3], [2, 4], [4, 5]],
            currentConnection: 0
          }
        ]
      });
    } else if (game.type === "word") {
      const words = [
        { word: "TREE", clue: "It grows tall and gives us oxygen", emoji: "🌳", letters: [], guessed: [] },
        { word: "SUN", clue: "Bright star that gives us energy", emoji: "☀️", letters: [], guessed: [] },
        { word: "FISH", clue: "Lives in water and swims", emoji: "🐠", letters: [], guessed: [] },
        { word: "BIRD", clue: "Flies in the sky with wings", emoji: "🐦", letters: [], guessed: [] },
      ];
      const currentWord = words[Math.floor(Math.random() * words.length)];
      currentWord.letters = currentWord.word.split('').map((letter, index) => ({
        letter,
        revealed: false,
        index
      }));
      setGameState({
        currentWord,
        availableLetters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').sort(() => Math.random() - 0.5),
        wrongGuesses: 0,
        maxWrongGuesses: 6
      });
    }
  };

  const generateFood = () => {
    const foods = [
      { emoji: "🍎", points: 10, name: "Apple" },
      { emoji: "🥕", points: 15, name: "Carrot" },
      { emoji: "🌱", points: 20, name: "Sprout" },
      { emoji: "♻️", points: 25, name: "Recycle" },
    ];
    const food = foods[Math.floor(Math.random() * foods.length)];
    return {
      ...food,
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10)
    };
  };

  const generateBadFood = () => {
    const badFoods = [
      { emoji: "🗑️", points: -5, name: "Trash" },
      { emoji: "💨", points: -10, name: "Pollution" },
    ];
    const badFood = badFoods[Math.floor(Math.random() * badFoods.length)];
    return {
      ...badFood,
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10)
    };
  };

  const moveSnake = () => {
    if (!gameState.snake || gameState.gameOver) return;

    const newSnake = [...gameState.snake];
    const head = { ...newSnake[newSnake.length - 1] };

    switch (gameState.direction) {
      case "up":
        head.y -= 1;
        break;
      case "down":
        head.y += 1;
        break;
      case "left":
        head.x -= 1;
        break;
      case "right":
        head.x += 1;
        break;
    }

    // Check boundaries
    if (head.x < 0 || head.x >= gameState.gridSize || head.y < 0 || head.y >= gameState.gridSize) {
      setGameState(prev => ({ ...prev, gameOver: true }));
      handleGameComplete();
      return;
    }

    // Check self collision
    for (let segment of newSnake) {
      if (head.x === segment.x && head.y === segment.y) {
        setGameState(prev => ({ ...prev, gameOver: true }));
        handleGameComplete();
        return;
      }
    }

    newSnake.push(head);

    // Check food collision
    let ate = false;
    if (gameState.food && head.x === gameState.food.x && head.y === gameState.food.y) {
      setScore(prev => prev + gameState.food.points);
      ate = true;
      setGameState(prev => ({
        ...prev,
        snake: newSnake,
        food: generateFood(),
        badFood: prev.badFood
      }));
    } else if (gameState.badFood && head.x === gameState.badFood.x && head.y === gameState.badFood.y) {
      setScore(prev => Math.max(0, prev + gameState.badFood.points));
      ate = true;
      setGameState(prev => ({
        ...prev,
        snake: newSnake,
        badFood: generateBadFood(),
        food: prev.food
      }));
    }

    if (!ate) {
      newSnake.shift(); // Remove tail only if didn't eat
      setGameState(prev => ({
        ...prev,
        snake: newSnake
      }));
    }
  };

  const handleKeyPress = (direction: string) => {
    if (!gameStarted || gameCompleted || gameState.gameOver) return;
    if (gameState.direction === direction) return;
    
    // Prevent reverse direction
    const opposites = {
      "up": "down",
      "down": "up", 
      "left": "right",
      "right": "left"
    };
    
    if (gameState.direction === opposites[direction as keyof typeof opposites]) return;
    
    setGameState(prev => ({
      ...prev,
      direction
    }));
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

  const renderPuzzleGame = () => {
    const handlePieceClick = (piece: any) => {
      if (piece.placed) return;
      
      // Find next empty spot
      const nextEmptySpot = gameState.board.findIndex((spot: any) => spot === null);
      if (nextEmptySpot === -1) return;

      const newBoard = [...gameState.board];
      const newPieces = gameState.pieces.map((p: any) => 
        p.id === piece.id ? { ...p, placed: true } : p
      );

      newBoard[nextEmptySpot] = piece;
      
      const isCorrect = nextEmptySpot === piece.correctPos;
      const newScore = isCorrect ? score + 20 : score;
      const newCompleted = isCorrect ? gameState.completed + 1 : gameState.completed;
      
      setScore(newScore);
      setGameState({
        ...gameState,
        board: newBoard,
        pieces: newPieces,
        completed: newCompleted
      });

      if (newCompleted === 6) {
        setTimeout(() => handleGameComplete(), 1000);
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">🧩 Earth Puzzle Adventure</h3>
          <p className="text-sm text-gray-600">Tap pieces to place them in order!</p>
          <p className="text-sm font-medium text-[#2ECC71]">{gameState.completed}/6 completed</p>
        </div>

        {/* Puzzle board */}
        <div className="bg-white rounded-xl p-4">
          <h4 className="font-medium mb-3">Puzzle Board</h4>
          <div className="grid grid-cols-3 gap-2">
            {gameState.board.map((piece: any, index: number) => (
              <div
                key={index}
                className={`aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center ${
                  piece ? piece.color : "bg-gray-50"
                }`}
              >
                {piece && (
                  <span className="text-3xl">{piece.emoji}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Available pieces */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium mb-3">Available Pieces</h4>
          <div className="flex flex-wrap gap-2">
            {gameState.pieces.filter((piece: any) => !piece.placed).map((piece: any) => (
              <button
                key={piece.id}
                onClick={() => handlePieceClick(piece)}
                className={`${piece.color} rounded-lg p-4 border-2 border-gray-300 hover:border-[#2ECC71] transition-colors`}
              >
                <span className="text-2xl">{piece.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSnakeGame = () => {
    const renderGrid = () => {
      const grid = [];
      for (let y = 0; y < gameState.gridSize; y++) {
        for (let x = 0; x < gameState.gridSize; x++) {
          let cellContent = "";
          let cellColor = "bg-green-50";

          // Check if snake segment
          const isSnake = gameState.snake.some((segment: any) => segment.x === x && segment.y === y);
          if (isSnake) {
            cellContent = "🐍";
            cellColor = "bg-green-200";
          }

          // Check if food
          if (gameState.food && gameState.food.x === x && gameState.food.y === y) {
            cellContent = gameState.food.emoji;
            cellColor = "bg-yellow-200";
          }

          // Check if bad food
          if (gameState.badFood && gameState.badFood.x === x && gameState.badFood.y === y) {
            cellContent = gameState.badFood.emoji;
            cellColor = "bg-red-200";
          }

          grid.push(
            <div
              key={`${x}-${y}`}
              className={`aspect-square rounded border ${cellColor} flex items-center justify-center text-lg`}
            >
              {cellContent}
            </div>
          );
        }
      }
      return grid;
    };

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">🐍 Green Snake Adventure</h3>
          <p className="text-sm text-gray-600">Eat good food 🍎, avoid pollution! 🗑️</p>
          <p className="text-sm font-medium text-[#2ECC71]">Length: {gameState.snake?.length || 0}</p>
        </div>

        {/* Game grid */}
        <div className="bg-white rounded-xl p-4">
          <div className="grid grid-cols-10 gap-1">
            {renderGrid()}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium mb-3 text-center">Controls</h4>
          <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
            <div></div>
            <Button
              onClick={() => handleKeyPress("up")}
              className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
            >
              ↑
            </Button>
            <div></div>
            <Button
              onClick={() => handleKeyPress("left")}
              className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
            >
              ←
            </Button>
            <div></div>
            <Button
              onClick={() => handleKeyPress("right")}
              className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
            >
              →
            </Button>
            <div></div>
            <Button
              onClick={() => handleKeyPress("down")}
              className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
            >
              ↓
            </Button>
            <div></div>
          </div>
        </div>
      </div>
    );
  };

  const renderConnectGame = () => {
    const currentPattern = gameState.patterns[gameState.currentPattern];

    const handleDotClick = (dotIndex: number) => {
      if (!currentPattern.connections[currentPattern.currentConnection]) {
        handleGameComplete();
        return;
      }

      const connection = currentPattern.connections[currentPattern.currentConnection];
      
      if (connection[0] === dotIndex || connection[1] === dotIndex) {
        const newPatterns = [...gameState.patterns];
        newPatterns[gameState.currentPattern].dots[dotIndex].connected = true;
        
        // Check if connection is complete
        const dot1Connected = newPatterns[gameState.currentPattern].dots[connection[0]].connected;
        const dot2Connected = newPatterns[gameState.currentPattern].dots[connection[1]].connected;
        
        if (dot1Connected && dot2Connected) {
          newPatterns[gameState.currentPattern].currentConnection += 1;
          setScore(prev => prev + 10);
        }

        setGameState(prev => ({
          ...prev,
          patterns: newPatterns
        }));

        // Check if pattern is complete
        if (newPatterns[gameState.currentPattern].currentConnection >= currentPattern.connections.length) {
          if (gameState.currentPattern < gameState.patterns.length - 1) {
            setTimeout(() => {
              setGameState(prev => ({
                ...prev,
                patterns: newPatterns,
                currentPattern: prev.currentPattern + 1
              }));
            }, 500);
          } else {
            setTimeout(() => handleGameComplete(), 1000);
          }
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">🔗 Connect the Eco Dots</h3>
          <p className="text-sm text-gray-600">Connect dots to draw a {currentPattern.name}!</p>
          <p className="text-sm font-medium text-[#2ECC71]">
            Pattern {gameState.currentPattern + 1} of {gameState.patterns.length}
          </p>
        </div>

        {/* Pattern preview */}
        <div className="bg-white rounded-xl p-4 text-center">
          <div className="text-4xl mb-2">{currentPattern.emoji}</div>
          <h4 className="font-medium">{currentPattern.name}</h4>
        </div>

        {/* Dots grid */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-3 gap-4 max-w-48 mx-auto">
            {currentPattern.dots.map((dot: any, index: number) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`aspect-square rounded-full border-4 flex items-center justify-center text-2xl transition-all ${
                  dot.connected
                    ? "bg-[#2ECC71] border-[#27AE60] text-white"
                    : "bg-white border-gray-300 hover:border-[#2ECC71]"
                }`}
              >
                {dot.connected ? "✓" : "○"}
              </button>
            ))}
          </div>
        </div>

        {/* Connection hint */}
        {currentPattern.connections[currentPattern.currentConnection] && (
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-800 mb-2">
              <span className="font-medium">Next Connection:</span>
            </p>
            <p className="text-sm text-blue-800">
              Connect dot {currentPattern.connections[currentPattern.currentConnection][0] + 1} to dot{" "}
              {currentPattern.connections[currentPattern.currentConnection][1] + 1}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Connection {currentPattern.currentConnection + 1} of {currentPattern.connections.length}
            </p>
          </div>
        )}
        
        {!currentPattern.connections[currentPattern.currentConnection] && (
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-sm text-green-800 font-medium">
              🎉 Pattern Complete! 
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderWordGame = () => {
    const handleLetterClick = (letter: string) => {
      const currentWord = gameState.currentWord;
      const newGuessed = [...currentWord.guessed, letter];
      
      let newWrongGuesses = gameState.wrongGuesses;
      let correctGuess = false;

      // Check if letter is in word
      const newLetters = currentWord.letters.map((l: any) => {
        if (l.letter === letter) {
          correctGuess = true;
          return { ...l, revealed: true };
        }
        return l;
      });

      if (!correctGuess) {
        newWrongGuesses += 1;
      } else {
        setScore(score + 10);
      }

      const newCurrentWord = {
        ...currentWord,
        letters: newLetters,
        guessed: newGuessed
      };

      setGameState({
        ...gameState,
        currentWord: newCurrentWord,
        wrongGuesses: newWrongGuesses
      });

      // Check if word is complete
      if (newLetters.every((l: any) => l.revealed)) {
        setTimeout(() => handleGameComplete(), 1000);
      }

      // Check if game over
      if (newWrongGuesses >= gameState.maxWrongGuesses) {
        setTimeout(() => handleGameComplete(), 1000);
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">📝 Eco Word Builder</h3>
          <p className="text-sm text-gray-600">Guess the letters to spell the word!</p>
          <p className="text-sm font-medium text-red-500">
            Wrong guesses: {gameState.wrongGuesses}/{gameState.maxWrongGuesses}
          </p>
        </div>

        {/* Word clue */}
        <div className="bg-white rounded-xl p-4 text-center">
          <div className="text-4xl mb-2">{gameState.currentWord.emoji}</div>
          <p className="text-sm text-gray-600">{gameState.currentWord.clue}</p>
        </div>

        {/* Word display */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-center gap-2">
            {gameState.currentWord.letters.map((letter: any, index: number) => (
              <div
                key={index}
                className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-bold"
              >
                {letter.revealed ? letter.letter : "_"}
              </div>
            ))}
          </div>
        </div>

        {/* Letter selection */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium mb-3 text-center">Choose a letter:</h4>
          <div className="grid grid-cols-6 gap-2">
            {gameState.availableLetters.slice(0, 18).map((letter: string) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                disabled={gameState.currentWord.guessed.includes(letter)}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center font-bold transition-colors ${
                  gameState.currentWord.guessed.includes(letter)
                    ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white border-gray-300 hover:border-[#2ECC71] hover:bg-green-50"
                }`}
              >
                {letter}
              </button>
            ))}
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
          <h2 className="text-2xl font-semibold mb-2">Awesome Job! 🎉</h2>
          <p className="text-gray-600 mb-6">You're becoming an eco-champion!</p>
          
          <div className="bg-white rounded-xl p-6 mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <span>Your Score:</span>
              <span className="font-semibold text-[#2ECC71] text-xl">{score} points</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Time Played:</span>
              <span className="font-semibold">{formatTime((game.timeLimit || 300) - timeLeft)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Eco Points Earned:</span>
              <span className="font-semibold text-[#2ECC71] text-xl">+{Math.floor(score / 5)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={resetGame} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={onBack} className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60]">
              Back to Games
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
              <span>Points to Earn:</span>
              <span className="font-semibold text-[#2ECC71]">{game.points}+</span>
            </div>
            {game.timeLimit && (
              <div className="flex justify-between items-center">
                <span>Time to Play:</span>
                <span className="font-semibold">{formatTime(game.timeLimit)}</span>
              </div>
            )}
          </div>

          <Button onClick={startGame} className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-lg py-4">
            🚀 Start Playing!
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
          {game.type === "puzzle" && renderPuzzleGame()}
          {game.type === "snake" && renderSnakeGame()}
          {game.type === "connect" && renderConnectGame()}
          {game.type === "word" && renderWordGame()}
        </div>
      )}
    </div>
  );
}