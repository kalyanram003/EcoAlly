import { useState } from "react";
import { ArrowLeft, Camera, CheckCircle, Users, Clock, Star, Target, Gamepad2, BookOpen } from "lucide-react";
import { Challenge } from "./ChallengesTab";
import { ChallengeSubmission } from "./ChallengeSubmission";
import { GamePlayer } from "../games/GamePlayer";
import { KidsGames } from "../games/KidsGames";
import { LearningMaterials } from "../../learning/LearningMaterials";

interface ChallengeDetailsProps {
  challenge: Challenge;
  onBack: () => void;
}

export function ChallengeDetails({ challenge, onBack }: ChallengeDetailsProps) {
  const [showSubmission, setShowSubmission] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "requirements" | "tips" | "game" | "learning">("overview");

  const handleStartChallenge = () => {
    if (challenge.type === "game") {
      setShowGame(true);
    } else {
      setShowSubmission(true);
    }
  };

  const handleGameComplete = (score: number, timeSpent: number) => {
    // Handle game completion logic here
    setShowGame(false);
    // Could add score tracking, badge awarding, etc.
  };

  if (showGame && challenge.gameConfig) {
    // Use KidsGames for child-friendly games
    if (["puzzle", "snake", "connect", "word"].includes(challenge.gameConfig.gameType)) {
      return (
        <KidsGames
          game={{
            id: challenge.id,
            title: challenge.title,
            description: challenge.description,
            type: challenge.gameConfig.gameType as "puzzle" | "snake" | "connect" | "word",
            points: challenge.points,
            timeLimit: challenge.gameConfig.timeLimit,
          }}
          onBack={() => setShowGame(false)}
          onComplete={handleGameComplete}
        />
      );
    }

    // Use original GamePlayer for other games
    return (
      <GamePlayer
        game={{
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          type: challenge.gameConfig.gameType,
          points: challenge.points,
          timeLimit: challenge.gameConfig.timeLimit,
        }}
        onBack={() => setShowGame(false)}
        onComplete={handleGameComplete}
      />
    );
  }

  if (showSubmission) {
    return (
      <ChallengeSubmission
        challenge={challenge}
        onBack={() => setShowSubmission(false)}
        onComplete={onBack}
      />
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold">Challenge Details</h2>
        <div className="w-9" /> {/* Spacer for alignment */}
      </div>

      {/* Challenge Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-16 h-16 ${challenge.color} rounded-xl flex items-center justify-center`}>
            <span className="text-3xl">{challenge.icon}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold mb-2">{challenge.title}</h1>
            <p className="text-gray-600 mb-3">{challenge.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{challenge.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4" />
                <span>{challenge.points} points</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{challenge.participants} joined</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                <span>{challenge.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {!challenge.completed && (
          <button
            onClick={handleStartChallenge}
            className="w-full bg-[#2ECC71] text-white py-4 rounded-xl font-medium hover:bg-[#27AE60] transition-colors flex items-center justify-center gap-2"
          >
            {challenge.type === "photo" && <Camera className="w-5 h-5" />}
            {challenge.type === "action" && <CheckCircle className="w-5 h-5" />}
            {challenge.type === "game" && <Gamepad2 className="w-5 h-5" />}
            {challenge.type === "social" && <Users className="w-5 h-5" />}
            {challenge.type === "learning" && <BookOpen className="w-5 h-5" />}
            {challenge.type === "game" ? "Play Game" : "Start Challenge"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "overview" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("requirements")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "requirements" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Requirements
        </button>
        <button
          onClick={() => setActiveTab("tips")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "tips" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Tips
        </button>
        <button
          onClick={() => setActiveTab("game")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "game" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Game
        </button>
        <button
          onClick={() => setActiveTab("learning")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "learning" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Learning
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-4">About This Challenge</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Environmental Impact</h4>
                <p className="text-gray-600 text-sm">
                  This challenge helps reduce environmental waste and promotes sustainable living practices. 
                  By participating, you'll learn practical ways to minimize your ecological footprint.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">What You'll Learn</h4>
                <p className="text-gray-600 text-sm">
                  Discover alternative solutions to everyday environmental challenges and develop 
                  long-term sustainable habits that you can continue beyond this challenge.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Community</h4>
                <p className="text-gray-600 text-sm">
                  Join {challenge.participants} other eco-warriors who are taking action to protect our planet. 
                  Share your progress and inspire others in your journey.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-4">Challenge Requirements</h3>
            <div className="space-y-3">
              {challenge.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#2ECC71]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#2ECC71] text-sm font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{requirement}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "tips" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-4">Helpful Tips</h3>
            <div className="space-y-3">
              {challenge.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm">💡</span>
                  </div>
                  <p className="text-gray-700 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "game" && challenge.type === "game" && challenge.gameConfig && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#2ECC71] rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Ready to Play?</h3>
              <p className="text-gray-600 text-sm mb-6">
                Test your knowledge and skills with this interactive environmental game!
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Game Type:</span>
                  <span className="font-medium capitalize">{challenge.gameConfig.gameType}</span>
                </div>
                {challenge.gameConfig.timeLimit && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Limit:</span>
                    <span className="font-medium">{Math.floor(challenge.gameConfig.timeLimit / 60)}:{(challenge.gameConfig.timeLimit % 60).toString().padStart(2, '0')}</span>
                  </div>
                )}
                {challenge.gameConfig.minScore && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Target Score:</span>
                    <span className="font-medium">{challenge.gameConfig.minScore}%</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowGame(true)}
                className="w-full bg-[#2ECC71] text-white py-3 rounded-xl font-medium hover:bg-[#27AE60] transition-colors flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-5 h-5" />
                Start Game
              </button>
            </div>
          </div>
        )}

        {activeTab === "game" && challenge.type !== "game" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-600">No Game Available</h3>
              <p className="text-gray-500 text-sm">
                This challenge doesn't have an interactive game mode. Complete the challenge through the main action button above.
              </p>
            </div>
          </div>
        )}

        {activeTab === "learning" && challenge.learningTopic && (
          <LearningMaterials topic={challenge.learningTopic} />
        )}

        {activeTab === "learning" && !challenge.learningTopic && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-600">Learning Materials Coming Soon</h3>
              <p className="text-gray-500 text-sm">
                Educational resources for this challenge are being prepared. Check back soon for comprehensive learning materials!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}