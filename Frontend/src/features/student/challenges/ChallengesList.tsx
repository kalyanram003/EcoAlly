import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Users, Clock, Star, Check } from "lucide-react";
import { Challenge } from "./ChallengesTab";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } }
};

interface ChallengesListProps {
  challenges: Challenge[];
  onChallengeSelect: (challenge: Challenge) => void;
}

type FilterType = "all" | "photo" | "action" | "social" | "learning" | "game";

export function ChallengesList({ challenges, onChallengeSelect }: ChallengesListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "photo":
        return "bg-blue-100 text-blue-800";
      case "action":
        return "bg-green-100 text-green-800";
      case "social":
        return "bg-purple-100 text-purple-800";
      case "learning":
        return "bg-orange-100 text-orange-800";
      case "game":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "photo":
        return "📸 Photo";
      case "action":
        return "✅ Action";
      case "social":
        return "👥 Social";
      case "learning":
        return "📚 Learning";
      case "game":
        return "🎮 Game";
      default:
        return type;
    }
  };

  const filteredChallenges = activeFilter === "all" 
    ? challenges 
    : challenges.filter(challenge => challenge.type === activeFilter);

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (activeFilter !== "all") {
      if (a.type === activeFilter && b.type !== activeFilter) return -1;
      if (b.type === activeFilter && a.type !== activeFilter) return 1;
    }
    return b.points - a.points;
  });

  const activeCount = filteredChallenges.filter(c => !c.completed).length;
  const completedCount = filteredChallenges.filter(c => c.completed).length;

  const filterButtons = [
    { key: "all" as FilterType, label: "All", icon: "🌟" },
    { key: "photo" as FilterType, label: "Photo", icon: "📸" },
    { key: "action" as FilterType, label: "Action", icon: "✅" },
    { key: "social" as FilterType, label: "Social", icon: "👥" },
    { key: "learning" as FilterType, label: "Learning", icon: "📚" },
    { key: "game" as FilterType, label: "Games", icon: "🎮" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
        <p className="text-gray-500 text-sm mt-1">Complete real-world eco actions and upload proof</p>
        
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--forest-600)]">{activeCount}</div>
            <div className="text-sm text-gray-500">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-600">{completedCount}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterButtons.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter.key
                ? "bg-[var(--forest-600)] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {challenges.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-xs)] p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-24 ml-auto mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {sortedChallenges.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="font-semibold mb-2">No challenges found</h3>
              <p className="text-gray-600">Try selecting a different filter to see more challenges.</p>
            </div>
          ) : (
            <>
            {sortedChallenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                variants={item}
                whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.09)" }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-xs)] p-5"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${challenge.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-xl">{challenge.icon}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{challenge.title}</h3>
                      {challenge.completed && (
                        <div className="w-6 h-6 bg-[var(--forest-500)] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                    
                    <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{challenge.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{challenge.points} points</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{challenge.participants}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(challenge.type)}`}>
                          {getTypeLabel(challenge.type)}
                        </span>
                      </div>
                      
                      {challenge.completed ? (
                        <div className="text-center py-2">
                          <span className="text-[var(--forest-600)] font-medium text-sm">Completed!</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onChallengeSelect(challenge)}
                          className="bg-[var(--forest-600)] text-white px-6 py-2 rounded-xl font-medium hover:bg-[var(--forest-700)] transition-colors"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}