import { useState } from "react";
import { ChallengesList } from "./ChallengesList";
import { ChallengeDetails } from "./ChallengeDetails";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "photo" | "action" | "social" | "learning" | "game";
  duration: string;
  completed: boolean;
  participants: number;
  icon: string;
  color: string;
  requirements: string[];
  tips: string[];
  learningTopic?: string; // Links to learning materials
  gameConfig?: {
    gameType: "quiz" | "memory" | "sorting" | "matching" | "puzzle" | "snake" | "connect" | "word";
    timeLimit?: number;
    minScore?: number;
  };
}

export function ChallengesTab() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const challenges: Challenge[] = [
    {
      id: "waste-recycling",
      title: "Waste Recycling Challenge",
      description: "Document and properly sort your recyclable waste for a week",
      points: 100,
      difficulty: "Medium",
      type: "photo",
      duration: "1 Week",
      completed: false,
      participants: 847,
      icon: "♻️",
      color: "bg-green-100",
      requirements: [
        "Separate recyclables into correct categories daily",
        "Take photos of your sorted waste bins",
        "Document at least 5 different recyclable materials",
        "Share before and after photos of your recycling system"
      ],
      tips: [
        "Learn your local recycling guidelines",
        "Rinse containers before recycling",
        "Flatten cardboard boxes to save space",
        "Keep separate bins for paper, plastic, glass, and metal"
      ]
    },
    {
      id: "energy-audit",
      title: "Home Energy Audit",
      description: "Conduct a complete energy efficiency check of your home",
      points: 80,
      difficulty: "Easy",
      type: "action",
      duration: "2 Hours",
      completed: true,
      participants: 1203,
      icon: "⚡",
      color: "bg-yellow-100",
      requirements: [
        "Check all light bulbs and replace with LEDs",
        "Inspect windows and doors for air leaks",
        "Document energy-wasting appliances",
        "Create an improvement plan"
      ],
      tips: [
        "Use a flashlight to check for light leaks around doors",
        "Feel for drafts near windows",
        "Check thermostat settings",
        "Unplug devices not in use"
      ]
    },
    {
      id: "plant-tree",
      title: "Plant a Tree",
      description: "Plant and commit to caring for a tree or start a garden",
      points: 150,
      difficulty: "Hard",
      type: "photo",
      duration: "3 Hours",
      completed: false,
      participants: 592,
      icon: "🌳",
      color: "bg-green-100",
      requirements: [
        "Plant a tree or start a small garden",
        "Take before, during, and after photos",
        "Create a care plan for 6 months",
        "Research native plants for your area"
      ],
      tips: [
        "Choose native species for your climate",
        "Dig hole twice as wide as root ball",
        "Water regularly for first few weeks",
        "Add mulch around the base"
      ]
    },
    {
      id: "water-conservation",
      title: "Water Warrior Week",
      description: "Reduce water usage by 30% for one week",
      points: 120,
      difficulty: "Medium",
      type: "action",
      duration: "1 Week",
      completed: false,
      participants: 756,
      icon: "💧",
      color: "bg-blue-100",
      requirements: [
        "Track daily water usage",
        "Implement 3+ water-saving techniques",
        "Document your water meter readings",
        "Calculate percentage reduction"
      ],
      tips: [
        "Take shorter showers (under 5 minutes)",
        "Fix any leaky faucets",
        "Collect rainwater for plants",
        "Run dishwasher only when full"
      ]
    },
    {
      id: "eco-education",
      title: "Teach Someone Green",
      description: "Educate a friend or family member about environmental issues",
      points: 90,
      difficulty: "Easy",
      type: "social",
      duration: "1 Hour",
      completed: false,
      participants: 324,
      icon: "🎓",
      color: "bg-purple-100",
      requirements: [
        "Choose an environmental topic to teach",
        "Prepare educational materials",
        "Spend at least 30 minutes teaching",
        "Get feedback from your student"
      ],
      tips: [
        "Use visuals and real examples",
        "Make it interactive and fun",
        "Focus on actionable steps",
        "Share your own experiences"
      ]
    },
    {
      id: "feed-street-animals",
      title: "Feeding Street Animals Challenge",
      description: "Help homeless animals by providing food and water with proper care",
      points: 75,
      difficulty: "Easy",
      type: "photo",
      duration: "1 Day",
      completed: false,
      participants: 445,
      icon: "🐾",
      color: "bg-orange-100",
      requirements: [
        "Prepare safe, appropriate food for street animals",
        "Set up clean water stations in safe locations",
        "Document your feeding efforts with photos",
        "Share information about local animal welfare organizations"
      ],
      tips: [
        "Research safe foods for dogs and cats",
        "Use clean containers for food and water",
        "Choose safe, accessible locations",
        "Never force animals to approach, let them come naturally",
        "Consider contacting local animal rescue groups"
      ]
    },
    {
      id: "waste-sorting-game",
      title: "Waste Sorting Master",
      description: "Learn proper waste sorting through an interactive game",
      points: 60,
      difficulty: "Easy", 
      type: "game",
      duration: "15 Minutes",
      completed: false,
      participants: 1156,
      icon: "🗂️",
      color: "bg-green-100",
      learningTopic: "waste-management",
      requirements: [
        "Sort at least 8 items correctly",
        "Complete the game within time limit",
        "Learn about different waste categories"
      ],
      tips: [
        "Read the item descriptions carefully",
        "Remember: when in doubt, throw it out",
        "Clean containers go in recycling",
        "Batteries are hazardous waste"
      ],
      gameConfig: {
        gameType: "sorting",
        timeLimit: 300,
        minScore: 80
      }
    },
    {
      id: "carbon-memory-game", 
      title: "Carbon Footprint Memory",
      description: "Match eco-friendly alternatives with their high-carbon counterparts",
      points: 70,
      difficulty: "Medium",
      type: "game", 
      duration: "20 Minutes",
      completed: false,
      participants: 892,
      icon: "🧠",
      color: "bg-blue-100",
      learningTopic: "carbon-footprint",
      requirements: [
        "Match all eco-friendly pairs",
        "Complete within 20 moves",
        "Learn about carbon impact differences"
      ],
      tips: [
        "Remember the positions of cards",
        "Think about environmental impact",
        "Low-carbon options are usually local and simple",
        "Transportation adds significant carbon footprint"
      ],
      gameConfig: {
        gameType: "memory",
        timeLimit: 600,
        minScore: 70
      }
    },
    {
      id: "renewable-energy-quiz",
      title: "Renewable Energy Challenge", 
      description: "Test your knowledge about renewable energy sources",
      points: 80,
      difficulty: "Medium",
      type: "game",
      duration: "25 Minutes", 
      completed: false,
      participants: 634,
      icon: "☀️",
      color: "bg-yellow-100",
      learningTopic: "renewable-energy",
      requirements: [
        "Answer questions about solar, wind, and other renewables",
        "Score at least 75% correct",
        "Learn about energy efficiency"
      ],
      tips: [
        "Study different types of renewable energy",
        "Think about energy conservation methods", 
        "Consider the environmental benefits",
        "Review home energy audit practices"
      ],
      gameConfig: {
        gameType: "quiz",
        timeLimit: 900,
        minScore: 75
      }
    },
    {
      id: "sustainable-living-match",
      title: "Sustainable Living Choices",
      description: "Match sustainable practices with their benefits",
      points: 65,
      difficulty: "Easy",
      type: "game",
      duration: "18 Minutes",
      completed: false,
      participants: 567,
      icon: "🌱", 
      color: "bg-green-100",
      learningTopic: "sustainable-living",
      requirements: [
        "Match sustainable practices correctly",
        "Complete all matching pairs",
        "Learn about eco-friendly alternatives"
      ],
      tips: [
        "Think about daily habits you can change",
        "Consider the long-term environmental impact",
        "Focus on simple swaps you can make",
        "Remember that small changes add up"
      ],
      gameConfig: {
        gameType: "matching",
        timeLimit: 480,
        minScore: 85
      }
    },
    {
      id: "earth-puzzle-adventure",
      title: "Earth Puzzle Adventure",
      description: "Complete beautiful nature puzzles by placing pieces in the right spots!",
      points: 100,
      difficulty: "Easy",
      type: "game",
      duration: "15 Minutes",
      completed: false,
      participants: 892,
      icon: "🧩",
      color: "bg-blue-100",
      learningTopic: "sustainable-living",
      requirements: [
        "Complete the puzzle by placing all pieces correctly",
        "Learn about different elements of nature",
        "Have fun while learning about our planet"
      ],
      tips: [
        "Look at the colors and shapes of each piece",
        "Think about where each nature element belongs",
        "Take your time - there's no rush!",
        "Each piece has its perfect spot"
      ],
      gameConfig: {
        gameType: "puzzle",
        timeLimit: 900,
        minScore: 80
      }
    },
    {
      id: "green-snake-adventure",
      title: "Green Snake Adventure",
      description: "Guide your eco-friendly snake to eat healthy foods and avoid pollution!",
      points: 120,
      difficulty: "Medium",
      type: "game",
      duration: "20 Minutes",
      completed: false,
      participants: 654,
      icon: "🐍",
      color: "bg-green-100",
      learningTopic: "waste-management",
      requirements: [
        "Control the snake to eat good foods",
        "Avoid trash and pollution items",
        "Grow your snake by eating healthy items"
      ],
      tips: [
        "Use the arrow buttons to move your snake",
        "Apples and vegetables are good for you",
        "Stay away from trash and pollution",
        "Don't hit the walls or yourself!"
      ],
      gameConfig: {
        gameType: "snake",
        timeLimit: 1200,
        minScore: 100
      }
    },
    {
      id: "connect-eco-dots",
      title: "Connect the Eco Dots",
      description: "Draw beautiful nature patterns by connecting dots in the right order!",
      points: 80,
      difficulty: "Easy",
      type: "game",
      duration: "12 Minutes",
      completed: false,
      participants: 738,
      icon: "🔗",
      color: "bg-purple-100",
      learningTopic: "renewable-energy",
      requirements: [
        "Connect dots to create nature patterns",
        "Follow the sequence to draw flowers and trees",
        "Complete all patterns to win"
      ],
      tips: [
        "Follow the numbers to connect dots",
        "Start with dot 1, then connect to dot 2",
        "Watch the pattern appear as you connect",
        "Take your time to make it perfect"
      ],
      gameConfig: {
        gameType: "connect",
        timeLimit: 720,
        minScore: 60
      }
    },
    {
      id: "eco-word-builder",
      title: "Eco Word Builder",
      description: "Guess the eco-friendly words by choosing the right letters!",
      points: 90,
      difficulty: "Easy",
      type: "game",
      duration: "15 Minutes",
      completed: false,
      participants: 567,
      icon: "📝",
      color: "bg-yellow-100",
      learningTopic: "sustainable-living",
      requirements: [
        "Guess the hidden eco-friendly words",
        "Use clues to help you find the right letters",
        "Learn new environmental vocabulary"
      ],
      tips: [
        "Read the clue carefully for hints",
        "Start with common letters like A, E, I",
        "Think about nature and environment words",
        "Don't worry about wrong guesses - keep trying!"
      ],
      gameConfig: {
        gameType: "word",
        timeLimit: 900,
        minScore: 70
      }
    }
  ];

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleBackToChallenges = () => {
    setSelectedChallenge(null);
  };

  if (selectedChallenge) {
    return (
      <ChallengeDetails
        challenge={selectedChallenge}
        onBack={handleBackToChallenges}
      />
    );
  }

  return (
    <ChallengesList
      challenges={challenges}
      onChallengeSelect={handleChallengeSelect}
    />
  );
}