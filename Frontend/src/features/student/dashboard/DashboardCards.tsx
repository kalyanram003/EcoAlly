import { Trophy, Star, Award, Flame, Coins } from "lucide-react";

interface DashboardCardsProps {
  userPoints: number;
  currentStreak: number;
  onNavigateToRanking?: () => void;
  onNavigateToStreaks?: () => void;
}

export function DashboardCards({ userPoints, currentStreak, onNavigateToRanking, onNavigateToStreaks }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
        <div className="w-8 h-8 bg-[#2ECC71]/10 rounded-full flex items-center justify-center mx-auto mb-2">
          <Coins className="w-4 h-4 text-[#2ECC71]" />
        </div>
        <p className="text-xs text-gray-600 mb-1">Eco Points</p>
        <p className="font-semibold text-sm">{userPoints.toLocaleString()}</p>
      </div>
      
      <button 
        onClick={onNavigateToRanking}
        className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:shadow-md hover:scale-105 transition-all duration-200 active:scale-95"
      >
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <Trophy className="w-4 h-4 text-amber-600" />
        </div>
        <p className="text-xs text-gray-600 mb-1">Class Rank</p>
        <p className="font-semibold text-sm">#4</p>
      </button>
      
      <button 
        onClick={onNavigateToStreaks}
        className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:shadow-md hover:scale-105 transition-all duration-200 active:scale-95"
      >
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <Flame className="w-4 h-4 text-orange-600" />
        </div>
        <p className="text-xs text-gray-600 mb-1">Day Streak</p>
        <p className="font-semibold text-sm">{currentStreak}</p>
      </button>
    </div>
  );
}