import { Crown, Target, Zap, ShoppingCart, Users, Gift, TrendingUp, Star } from "lucide-react";

interface EnhancedGameOverviewProps {
  userPoints: number;
  currentStreak: number;
  onOpenProgression: () => void;
  onOpenQuests: () => void;
  onOpenStore: () => void;
  onOpenSocial: () => void;
}

export function EnhancedGameOverview({
  userPoints,
  currentStreak,
  onOpenProgression,
  onOpenQuests,
  onOpenStore,
  onOpenSocial
}: EnhancedGameOverviewProps) {
  // Calculate current tier
  const getCurrentTier = () => {
    if (userPoints >= 6000) return { name: "Eco Master", emoji: "🌟", color: "from-yellow-400 to-yellow-600" };
    if (userPoints >= 3000) return { name: "Eco Guardian", emoji: "🛡️", color: "from-purple-400 to-purple-600" };
    if (userPoints >= 1000) return { name: "Eco Explorer", emoji: "🌍", color: "from-blue-400 to-blue-600" };
    return { name: "Eco Sprout", emoji: "🌱", color: "from-green-400 to-green-600" };
  };

  const currentTier = getCurrentTier();
  
  // Mock data for quick overview
  const activeQuests = 3;
  const unlockedItems = 2;
  const teamRank = 2;

  const getStreakEffect = () => {
    if (currentStreak >= 30) return "✨";
    if (currentStreak >= 14) return "⚡";
    if (currentStreak >= 7) return "🔥";
    return "🌱";
  };

  return (
    <div className="p-4 space-y-4">
      {/* Enhanced Tier Display */}
      <div className={`bg-gradient-to-r ${currentTier.color} rounded-xl p-4 text-white relative overflow-hidden`}>
        <div className="absolute top-2 right-2 opacity-20">
          <Star className="w-6 h-6" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
              {currentTier.emoji}
            </div>
            <div>
              <h3 className="font-bold">{currentTier.name}</h3>
              <p className="text-white/80 text-sm">{userPoints.toLocaleString()} eco points</p>
            </div>
          </div>
          <button 
            onClick={onOpenProgression}
            className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            View Progress
          </button>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Quests Card */}
        <button
          onClick={onOpenQuests}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">{activeQuests}</span>
          </div>
          <h4 className="font-semibold text-sm mb-1">Active Quests</h4>
          <p className="text-xs text-gray-600">Daily & weekly missions</p>
        </button>

        {/* Power Streak Card */}
        <button
          onClick={() => {}} // Could open streak details
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl">{getStreakEffect()}</div>
            <span className="text-sm font-medium text-orange-600">{currentStreak}d</span>
          </div>
          <h4 className="font-semibold text-sm mb-1">Power Streak</h4>
          <p className="text-xs text-gray-600">
            {currentStreak >= 7 ? "Multiplier active!" : "Keep it going!"}
          </p>
        </button>

        {/* Store Card */}
        <button
          onClick={onOpenStore}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-6 h-6 text-purple-500" />
            <span className="text-sm font-medium text-purple-600">{unlockedItems}</span>
          </div>
          <h4 className="font-semibold text-sm mb-1">Eco Market</h4>
          <p className="text-xs text-gray-600">New items unlocked!</p>
        </button>

        {/* Social Card */}
        <button
          onClick={onOpenSocial}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-green-500" />
            <span className="text-sm font-medium text-green-600">#{teamRank}</span>
          </div>
          <h4 className="font-semibold text-sm mb-1">Team Rank</h4>
          <p className="text-xs text-gray-600">Eco Warriors team</p>
        </button>
      </div>

      {/* Mini Achievement Spotlight */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Gift className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-800">Level Up Reward!</h4>
            <p className="text-sm text-yellow-700">New items unlocked in the eco market</p>
          </div>
          <button 
            onClick={onOpenStore}
            className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-yellow-600 transition-colors"
          >
            Claim
          </button>
        </div>
      </div>
    </div>
  );
}