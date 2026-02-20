import { useState } from "react";
import { Flame, Shield, Star, Zap, Calendar, Trophy, Crown, Gift, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";

export interface PowerStreak {
  id: string;
  name: string;
  description: string;
  emoji: string;
  daysRequired: number;
  multiplier: number;
  duration: number; // days the multiplier lasts
  color: string;
  unlocked: boolean;
  active: boolean;
}

export interface StreakShield {
  id: string;
  name: string;
  description: string;
  emoji: string;
  protection: number; // days of protection
  cost: number; // eco points
  owned: number; // how many shields owned
  maxOwned: number;
}

export interface SeasonalStreak {
  id: string;
  name: string;
  description: string;
  emoji: string;
  season: string;
  startDate: Date;
  endDate: Date;
  bonusMultiplier: number;
  specialReward: string;
  progress: number;
  target: number;
  active: boolean;
}

interface EnhancedStreaksProps {
  currentStreak: number;
  longestStreak: number;
  streakShields: number;
  onPurchaseShield?: () => void;
  onActivateStreak?: (streakId: string) => void;
}

export function EnhancedStreaks({ 
  currentStreak, 
  longestStreak, 
  streakShields,
  onPurchaseShield,
  onActivateStreak 
}: EnhancedStreaksProps) {
  const [activeTab, setActiveTab] = useState<"current" | "power" | "shields" | "seasonal">("current");

  const powerStreaks: PowerStreak[] = [
    {
      id: "fire_streak",
      name: "Fire Streak",
      description: "Unlock 1.2x points multiplier for completing a 7-day streak",
      emoji: "🔥",
      daysRequired: 7,
      multiplier: 1.2,
      duration: 7,
      color: "from-red-400 to-orange-500",
      unlocked: currentStreak >= 7,
      active: currentStreak >= 7 && currentStreak < 14
    },
    {
      id: "lightning_streak",
      name: "Lightning Streak", 
      description: "Earn 1.5x points multiplier after 14 consecutive days",
      emoji: "⚡",
      daysRequired: 14,
      multiplier: 1.5,
      duration: 10,
      color: "from-blue-400 to-purple-500",
      unlocked: currentStreak >= 14,
      active: currentStreak >= 14 && currentStreak < 30
    },
    {
      id: "cosmic_streak",
      name: "Cosmic Streak",
      description: "Achieve legendary 2x multiplier with a 30-day streak",
      emoji: "✨",
      daysRequired: 30,
      multiplier: 2.0,
      duration: 14,
      color: "from-purple-400 to-pink-500",
      unlocked: currentStreak >= 30,
      active: currentStreak >= 30
    },
    {
      id: "eternal_streak",
      name: "Eternal Streak",
      description: "Master level: 2.5x multiplier for 60+ day streaks",
      emoji: "👑",
      daysRequired: 60,
      multiplier: 2.5,
      duration: 21,
      color: "from-yellow-400 to-gold-500",
      unlocked: currentStreak >= 60,
      active: currentStreak >= 60
    }
  ];

  const streakShieldsData: StreakShield[] = [
    {
      id: "basic_shield",
      name: "Basic Protection",
      description: "Protects your streak for 1 missed day",
      emoji: "🛡️",
      protection: 1,
      cost: 250,
      owned: streakShields,
      maxOwned: 3
    },
    {
      id: "premium_shield",
      name: "Premium Protection",
      description: "Shields your streak for up to 3 days",
      emoji: "💎",
      protection: 3,
      cost: 600,
      owned: 0,
      maxOwned: 2
    }
  ];

  const seasonalStreaks: SeasonalStreak[] = [
    {
      id: "earth_day_2024",
      name: "Earth Day Challenge",
      description: "Special Earth Day streak event with exclusive rewards",
      emoji: "🌍",
      season: "Earth Day 2024",
      startDate: new Date("2024-04-15"),
      endDate: new Date("2024-04-30"),
      bonusMultiplier: 1.5,
      specialReward: "Earth Guardian Badge + Tree Companion",
      progress: 8,
      target: 14,
      active: true
    },
    {
      id: "ocean_week",
      name: "World Ocean Week",
      description: "Dive deep into ocean conservation during this special week",
      emoji: "🌊",
      season: "Ocean Week",
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-06-08"),
      bonusMultiplier: 1.3,
      specialReward: "Ocean Protector Title + Blue Avatar",
      progress: 0,
      target: 7,
      active: false
    }
  ];

  const getNextPowerStreak = () => {
    return powerStreaks.find(streak => !streak.unlocked);
  };

  const getCurrentPowerStreak = () => {
    return powerStreaks.find(streak => streak.active);
  };

  const formatDaysUntilSeason = (startDate: Date): string => {
    const now = new Date();
    const diff = startDate.getTime() - now.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    
    if (days <= 0) return "Active now!";
    return `${days} days until start`;
  };

  const getStreakEffect = () => {
    if (currentStreak >= 60) return "👑";
    if (currentStreak >= 30) return "✨";
    if (currentStreak >= 14) return "⚡";
    if (currentStreak >= 7) return "🔥";
    return "🌱";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🔥 Streak Central</h2>
        <p className="text-gray-600">Keep your momentum going for amazing rewards!</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setActiveTab("current")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "current" ? "bg-orange-500 text-white" : "bg-transparent text-gray-600"
          }`}
        >
          <Flame className="w-4 h-4" />
          Current
        </button>
        <button
          onClick={() => setActiveTab("power")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "power" ? "bg-purple-500 text-white" : "bg-transparent text-gray-600"
          }`}
        >
          <Zap className="w-4 h-4" />
          Power
        </button>
        <button
          onClick={() => setActiveTab("shields")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "shields" ? "bg-blue-500 text-white" : "bg-transparent text-gray-600"
          }`}
        >
          <Shield className="w-4 h-4" />
          Shields
        </button>
        <button
          onClick={() => setActiveTab("seasonal")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "seasonal" ? "bg-green-500 text-white" : "bg-transparent text-gray-600"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Events
        </button>
      </div>

      {/* Current Streak Tab */}
      {activeTab === "current" && (
        <div className="space-y-4">
          {/* Main Streak Display */}
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-20">
              <div className="flex gap-1">
                <Flame className="w-6 h-6" />
                <Flame className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm">
                  {getStreakEffect()}
                </div>
                <div>
                  <h3 className="text-3xl font-bold">{currentStreak}</h3>
                  <p className="text-white/80">Day Streak</p>
                  <p className="text-white/70 text-sm">Best: {longestStreak} days</p>
                </div>
              </div>
            </div>

            {/* Active Multiplier */}
            {getCurrentPowerStreak() && (
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">
                    {getCurrentPowerStreak()!.multiplier}x Points Active!
                  </span>
                </div>
                <p className="text-white/80 text-sm">
                  {getCurrentPowerStreak()!.name} bonus is active
                </p>
              </div>
            )}
          </div>

          {/* Next Milestone */}
          {getNextPowerStreak() && (
            <div className="bg-white rounded-xl p-4 border-2 border-dashed border-orange-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl">
                    {getNextPowerStreak()!.emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800">Next: {getNextPowerStreak()!.name}</h4>
                    <p className="text-sm text-orange-600">
                      {getNextPowerStreak()!.daysRequired - currentStreak} days to unlock {getNextPowerStreak()!.multiplier}x multiplier
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-3 bg-orange-200 rounded-full">
                    <div 
                      className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((currentStreak / getNextPowerStreak()!.daysRequired) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Streak Protection */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Streak Protection
              </h4>
              <span className="text-2xl font-bold text-blue-600">{streakShields}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {streakShields > 0 
                ? `You have ${streakShields} shield${streakShields > 1 ? 's' : ''} to protect your streak`
                : "No shields active - purchase protection to safeguard your streak"
              }
            </p>
            {streakShields === 0 && (
              <Button 
                onClick={onPurchaseShield}
                variant="outline"
                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                Get Protection
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Power Streaks Tab */}
      {activeTab === "power" && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="font-semibold mb-2">⚡ Power Streak Multipliers</h3>
            <p className="text-sm text-gray-600">Unlock amazing multipliers by maintaining your streaks!</p>
          </div>

          {powerStreaks.map((streak) => (
            <div key={streak.id} className={`bg-white rounded-xl border-2 p-4 ${
              streak.active ? `border-orange-400 bg-gradient-to-r ${streak.color} bg-opacity-10` :
              streak.unlocked ? "border-green-400 bg-green-50" :
              "border-gray-200 bg-gray-50 opacity-75"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                    {streak.emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      {streak.name}
                      {streak.active && <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">ACTIVE</span>}
                      {streak.unlocked && !streak.active && <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">UNLOCKED</span>}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">{streak.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>📅 {streak.daysRequired} days required</span>
                      <span>⏰ {streak.duration} days duration</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{streak.multiplier}x</div>
                  <div className="text-xs text-gray-500">multiplier</div>
                </div>
              </div>

              {!streak.unlocked && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((currentStreak / streak.daysRequired) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Streak Shields Tab */}
      {activeTab === "shields" && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="font-semibold mb-2">🛡️ Streak Protection</h3>
            <p className="text-sm text-gray-600">Purchase shields to protect your precious streaks!</p>
          </div>

          {streakShieldsData.map((shield) => (
            <div key={shield.id} className="bg-white rounded-xl border-2 border-blue-200 p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                    {shield.emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold">{shield.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">{shield.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>🛡️ {shield.protection} day{shield.protection > 1 ? 's' : ''} protection</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{shield.cost}</div>
                  <div className="text-xs text-gray-500">eco points</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Owned: {shield.owned}/{shield.maxOwned}</span>
                <div className="flex gap-1">
                  {Array.from({ length: shield.maxOwned }, (_, i) => (
                    <div 
                      key={i}
                      className={`w-6 h-6 rounded border-2 ${
                        i < shield.owned ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button 
                onClick={onPurchaseShield}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={shield.owned >= shield.maxOwned}
              >
                {shield.owned >= shield.maxOwned ? "Max Owned" : `Purchase Shield - ${shield.cost} points`}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Seasonal Events Tab */}
      {activeTab === "seasonal" && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="font-semibold mb-2">🌍 Seasonal Streak Events</h3>
            <p className="text-sm text-gray-600">Special time-limited events with exclusive rewards!</p>
          </div>

          {seasonalStreaks.map((event) => (
            <div key={event.id} className={`bg-white rounded-xl border-2 p-4 ${
              event.active ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50"
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                    {event.emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      {event.name}
                      {event.active && <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">LIVE</span>}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                    <div className="text-xs text-gray-500">
                      {event.active ? 
                        `${Math.ceil((event.endDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))} days remaining` :
                        formatDaysUntilSeason(event.startDate)
                      }
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{event.bonusMultiplier}x</div>
                  <div className="text-xs text-gray-500">bonus</div>
                </div>
              </div>

              {event.active && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">{event.progress}/{event.target} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(event.progress / event.target) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Special Reward: {event.specialReward}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}