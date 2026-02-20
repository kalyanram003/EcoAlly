import { useState } from "react";
import { Star, Trophy, Shield, Sparkles, Crown, ChevronRight, Gift, Zap } from "lucide-react";
import { Button } from "../../components/ui/button";

export interface UserTier {
  id: string;
  name: string;
  emoji: string;
  color: string;
  minPoints: number;
  maxPoints: number;
  level: number;
  subLevel: number;
  description: string;
}

export interface Unlockable {
  id: string;
  type: "avatar" | "badge_frame" | "streak_effect" | "companion" | "quiz" | "fact";
  name: string;
  description: string;
  emoji: string;
  unlockedAt: number; // level
  unlocked: boolean;
}

interface ProgressionSystemProps {
  currentPoints: number;
  onViewRewards?: () => void;
}

export function ProgressionSystem({ currentPoints, onViewRewards }: ProgressionSystemProps) {
  const [showLevelDetails, setShowLevelDetails] = useState(false);

  const tiers: UserTier[] = [
    {
      id: "sprout",
      name: "Eco Sprout",
      emoji: "🌱",
      color: "from-green-400 to-green-600",
      minPoints: 0,
      maxPoints: 999,
      level: 1,
      subLevel: 0,
      description: "Just beginning your eco journey!"
    },
    {
      id: "explorer",
      name: "Eco Explorer", 
      emoji: "🌍",
      color: "from-blue-400 to-blue-600",
      minPoints: 1000,
      maxPoints: 2999,
      level: 2,
      subLevel: 0,
      description: "Discovering the wonders of our planet!"
    },
    {
      id: "guardian",
      name: "Eco Guardian",
      emoji: "🛡️", 
      color: "from-purple-400 to-purple-600",
      minPoints: 3000,
      maxPoints: 5999,
      level: 3,
      subLevel: 0,
      description: "Protecting and defending our environment!"
    },
    {
      id: "master",
      name: "Eco Master",
      emoji: "🌟",
      color: "from-yellow-400 to-yellow-600",
      minPoints: 6000,
      maxPoints: 9999,
      level: 4,
      subLevel: 0,
      description: "Master of ecological wisdom!"
    },
    {
      id: "legend",
      name: "Eco Legend",
      emoji: "👑",
      color: "from-gradient-to-r from-yellow-400 via-pink-500 to-purple-600",
      minPoints: 10000,
      maxPoints: 99999,
      level: 5,
      subLevel: 0,
      description: "Legendary eco champion!"
    }
  ];

  const unlockables: Unlockable[] = [
    {
      id: "leaf_frame",
      type: "badge_frame",
      name: "Leaf Frame",
      description: "Green leaf border for your badges",
      emoji: "🍃",
      unlockedAt: 5,
      unlocked: currentPoints >= 500
    },
    {
      id: "tree_companion",
      type: "companion",
      name: "Buddy Tree",
      description: "A growing tree companion that evolves with you",
      emoji: "🌳",
      unlockedAt: 10,
      unlocked: currentPoints >= 1000
    },
    {
      id: "water_quiz",
      type: "quiz",
      name: "Ocean Depths Quiz",
      description: "Exclusive advanced water conservation quiz",
      emoji: "🌊",
      unlockedAt: 8,
      unlocked: currentPoints >= 800
    },
    {
      id: "fire_streak",
      type: "streak_effect",
      name: "Fire Streak",
      description: "Flame effects for your streak counter",
      emoji: "🔥",
      unlockedAt: 15,
      unlocked: currentPoints >= 1500
    },
    {
      id: "eco_avatar",
      type: "avatar",
      name: "Eco Warrior Avatar",
      description: "Special avatar with eco gear",
      emoji: "🦸‍♀️",
      unlockedAt: 20,
      unlocked: currentPoints >= 2000
    }
  ];

  const getCurrentTier = (): UserTier => {
    return tiers.find(tier => currentPoints >= tier.minPoints && currentPoints <= tier.maxPoints) || tiers[0];
  };

  const getNextTier = (): UserTier | null => {
    const currentTier = getCurrentTier();
    const currentIndex = tiers.findIndex(tier => tier.id === currentTier.id);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const calculateSubLevel = (): { level: number; subLevel: number; progress: number } => {
    const currentTier = getCurrentTier();
    const tierRange = currentTier.maxPoints - currentTier.minPoints + 1;
    const subLevelSize = Math.floor(tierRange / 10); // 10 sub-levels per tier
    const pointsInTier = currentPoints - currentTier.minPoints;
    const subLevel = Math.floor(pointsInTier / subLevelSize);
    const subLevelProgress = (pointsInTier % subLevelSize) / subLevelSize * 100;
    
    return {
      level: currentTier.level,
      subLevel: Math.min(subLevel, 9),
      progress: subLevelProgress
    };
  };

  const getProgressToNext = (): { pointsNeeded: number; progress: number } => {
    const nextTier = getNextTier();
    if (!nextTier) {
      return { pointsNeeded: 0, progress: 100 };
    }
    
    const pointsNeeded = nextTier.minPoints - currentPoints;
    const currentTier = getCurrentTier();
    const totalRange = nextTier.minPoints - currentTier.minPoints;
    const currentProgress = currentPoints - currentTier.minPoints;
    const progress = (currentProgress / totalRange) * 100;
    
    return { pointsNeeded, progress };
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const { level, subLevel, progress: subProgress } = calculateSubLevel();
  const { pointsNeeded, progress } = getProgressToNext();
  const newUnlockables = unlockables.filter(item => !item.unlocked && currentPoints >= item.unlockedAt * 100);

  return (
    <div className="space-y-4">
      {/* Main Tier Display */}
      <div className={`bg-gradient-to-r ${currentTier.color} rounded-2xl p-6 text-white relative overflow-hidden`}>
        {/* Background decorations */}
        <div className="absolute top-2 right-2 opacity-20">
          <div className="flex gap-1">
            <Star className="w-4 h-4" />
            <Star className="w-3 h-3" />
            <Star className="w-2 h-2" />
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
              {currentTier.emoji}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentTier.name}</h2>
              <p className="text-white/80 text-sm">{currentTier.description}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowLevelDetails(!showLevelDetails)}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <ChevronRight className={`w-5 h-5 transform transition-transform ${showLevelDetails ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Sub-level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Level {level}.{subLevel}</span>
            <span className="text-sm text-white/80">{currentPoints.toLocaleString()} points</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${subProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/80">
            <span>Sub-level {subLevel}/9</span>
            {nextTier && <span>{pointsNeeded} to {nextTier.name}</span>}
          </div>
        </div>
      </div>

      {/* Next Tier Preview */}
      {nextTier && (
        <div className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl opacity-60">
                {nextTier.emoji}
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Next: {nextTier.name}</h3>
                <p className="text-sm text-gray-500">{pointsNeeded} points to unlock</p>
              </div>
            </div>
            <div className="w-16 h-2 bg-gray-200 rounded-full">
              <div 
                className="bg-[#2ECC71] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Level Details */}
      {showLevelDetails && (
        <div className="bg-white rounded-xl p-4 space-y-4 border border-gray-100">
          <h3 className="font-semibold flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#2ECC71]" />
            Level Rewards & Unlockables
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {unlockables.map((item) => (
              <div 
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                  item.unlocked 
                    ? "border-[#2ECC71] bg-green-50" 
                    : currentPoints >= item.unlockedAt * 100 
                      ? "border-yellow-400 bg-yellow-50 animate-pulse" 
                      : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="text-xs text-right">
                  {item.unlocked ? (
                    <span className="text-[#2ECC71] font-medium">✓ Unlocked</span>
                  ) : currentPoints >= item.unlockedAt * 100 ? (
                    <span className="text-yellow-600 font-medium animate-bounce">🎁 New!</span>
                  ) : (
                    <span className="text-gray-500">Level {item.unlockedAt}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {onViewRewards && (
            <Button 
              onClick={onViewRewards}
              className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View All Rewards
            </Button>
          )}
        </div>
      )}

      {/* New Unlockable Notification */}
      {newUnlockables.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">New Unlockables!</h3>
              <p className="text-sm text-white/90">
                {newUnlockables.length} new reward{newUnlockables.length > 1 ? 's' : ''} available!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}