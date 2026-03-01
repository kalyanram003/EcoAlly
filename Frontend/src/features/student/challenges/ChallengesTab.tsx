import { useState, useEffect } from "react";
import * as api from "../../../lib/api";
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
  learningTopic?: string;
  gameConfig?: {
    gameType: "quiz" | "memory" | "sorting" | "matching" | "puzzle" | "snake" | "connect" | "word";
    timeLimit?: number;
    minScore?: number;
  };
}

// Local-only game challenges that live entirely on the client
const LOCAL_GAME_CHALLENGES: Challenge[] = [
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
    requirements: ["Sort at least 8 items correctly", "Complete the game within time limit", "Learn about different waste categories"],
    tips: ["Read the item descriptions carefully", "Remember: when in doubt, throw it out", "Clean containers go in recycling", "Batteries are hazardous waste"],
    gameConfig: { gameType: "sorting", timeLimit: 300, minScore: 80 }
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
    requirements: ["Match all eco-friendly pairs", "Complete within 20 moves", "Learn about carbon impact differences"],
    tips: ["Remember the positions of cards", "Think about environmental impact", "Low-carbon options are usually local and simple", "Transportation adds significant carbon footprint"],
    gameConfig: { gameType: "memory", timeLimit: 600, minScore: 70 }
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
    requirements: ["Answer questions about solar, wind, and other renewables", "Score at least 75% correct", "Learn about energy efficiency"],
    tips: ["Study different types of renewable energy", "Think about energy conservation methods", "Consider the environmental benefits", "Review home energy audit practices"],
    gameConfig: { gameType: "quiz", timeLimit: 900, minScore: 75 }
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
    requirements: ["Match sustainable practices correctly", "Complete all matching pairs", "Learn about eco-friendly alternatives"],
    tips: ["Think about daily habits you can change", "Consider the long-term environmental impact", "Focus on simple swaps you can make", "Remember that small changes add up"],
    gameConfig: { gameType: "matching", timeLimit: 480, minScore: 85 }
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
    requirements: ["Complete the puzzle by placing all pieces correctly", "Learn about different elements of nature", "Have fun while learning about our planet"],
    tips: ["Look at the colors and shapes of each piece", "Think about where each nature element belongs", "Take your time - there's no rush!", "Each piece has its perfect spot"],
    gameConfig: { gameType: "puzzle", timeLimit: 900, minScore: 80 }
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
    requirements: ["Control the snake to eat good foods", "Avoid trash and pollution items", "Grow your snake by eating healthy items"],
    tips: ["Use the arrow buttons to move your snake", "Apples and vegetables are good for you", "Stay away from trash and pollution", "Don't hit the walls or yourself!"],
    gameConfig: { gameType: "snake", timeLimit: 1200, minScore: 100 }
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
    requirements: ["Connect dots to create nature patterns", "Follow the sequence to draw flowers and trees", "Complete all patterns to win"],
    tips: ["Follow the numbers to connect dots", "Start with dot 1, then connect to dot 2", "Watch the pattern appear as you connect", "Take your time to make it perfect"],
    gameConfig: { gameType: "connect", timeLimit: 720, minScore: 60 }
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
    requirements: ["Guess the hidden eco-friendly words", "Use clues to help you find the right letters", "Learn new environmental vocabulary"],
    tips: ["Read the clue carefully for hints", "Start with common letters like A, E, I", "Think about nature and environment words", "Don't worry about wrong guesses - keep trying!"],
    gameConfig: { gameType: "word", timeLimit: 900, minScore: 70 }
  }
];

export function ChallengesTab() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  useEffect(() => {
    Promise.all([api.getChallenges(), api.getMySubmissions()])
      .then(([challengeData, submissionsData]) => {
        setMySubmissions(submissionsData ?? []);

        const completedSubmissionIds = new Set(
          (submissionsData ?? [])
            .filter((s: any) => s.status === "APPROVED" || s.status === "PENDING" || s.status === "REJECTED" || s.id)
            .map((s: any) => s.challengeId)
        );

        const fromApi: Challenge[] = challengeData.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description ?? "",
          points: c.points ?? 0,
          type: (c.type ? c.type.toLowerCase() : "action") as Challenge["type"],
          difficulty: (c.difficulty
            ? c.difficulty.charAt(0) + c.difficulty.slice(1).toLowerCase()
            : "Medium") as "Easy" | "Medium" | "Hard",
          duration: c.duration ?? "1 Hour",
          completed: completedSubmissionIds.has(c.id),
          participants: 0,
          icon: c.icon ?? "🌍",
          color: c.color ?? "bg-green-100",
          requirements: c.requirements ?? [],
          tips: c.tips ?? [],
        }));

        // Merge: backend real challenges first, then local games (dedup by id)
        const backendIds = new Set(fromApi.map((c) => c.id));
        const games = LOCAL_GAME_CHALLENGES.filter((g) => !backendIds.has(g.id));
        setChallenges([...fromApi, ...games]);
      })
      .catch(() => {
        // If backend is unreachable, fall back to local games only
        setChallenges(LOCAL_GAME_CHALLENGES);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChallengeSelect = (challenge: Challenge) => setSelectedChallenge(challenge);
  const handleBackToChallenges = () => setSelectedChallenge(null);

  if (selectedChallenge) {
    return (
      <ChallengeDetails
        challenge={selectedChallenge}
        onBack={handleBackToChallenges}
        mySubmissions={mySubmissions}
      />
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-700";
      case "REJECTED": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "APPROVED": return "✅ Approved";
      case "REJECTED": return "❌ Rejected";
      default: return "⏳ Pending Review";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab switcher */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 mx-1">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "active"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Active Challenges
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "history"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
            }`}
        >
          History {mySubmissions.length > 0 && <span className="ml-1 text-xs bg-[#2ECC71] text-white rounded-full px-1.5 py-0.5">{mySubmissions.length}</span>}
        </button>
      </div>

      {activeTab === "active" && (
        <ChallengesList
          challenges={challenges}
          onChallengeSelect={handleChallengeSelect}
        />
      )}

      {activeTab === "history" && (
        <div className="flex-1 overflow-y-auto space-y-3 px-1">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : mySubmissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-medium text-gray-700">No submissions yet</p>
              <p className="text-sm text-gray-500 mt-1">Complete your first challenge to see history here.</p>
            </div>
          ) : mySubmissions.map((sub: any) => {
            const challenge = challenges.find(c => String(c.id) === String(sub.challengeId));
            return (
              <div key={sub.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {challenge?.title ?? `Challenge #${sub.challengeId}`}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(sub.createdAt ?? sub.submittedAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric"
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${statusColor(sub.status)}`}>
                    {statusLabel(sub.status)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {sub.pointsEarned != null && (
                    <span className="flex items-center gap-1 text-xs text-[#2ECC71] font-semibold">
                      ⭐ {sub.pointsEarned} pts
                    </span>
                  )}
                  {sub.ecoScore != null && (
                    <span className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
                      🔬 EcoScore: {sub.ecoScore}
                    </span>
                  )}
                  {sub.detectedCategory && (
                    <span className="text-xs text-gray-500 capitalize">
                      📍 {sub.detectedCategory.replace("_", " ")}
                    </span>
                  )}
                </div>
                {sub.autoDecisionReason && (
                  <p className="text-xs text-gray-400 mt-2 border-t border-gray-50 pt-2">
                    {sub.autoDecisionReason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
