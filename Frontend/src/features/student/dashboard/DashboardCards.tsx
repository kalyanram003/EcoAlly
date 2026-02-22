import { motion } from "framer-motion";
import { Trophy, Star, Award, Flame, Coins } from "lucide-react";

interface DashboardCardsProps {
  userPoints: number;
  currentStreak: number;
  onNavigateToRanking?: () => void;
  onNavigateToStreaks?: () => void;
}

export function DashboardCards({ userPoints, currentStreak, onNavigateToRanking, onNavigateToStreaks }: DashboardCardsProps) {
  const cardClass = "bg-white rounded-2xl p-4 lg:p-6 shadow-[var(--shadow-xs)] border border-[var(--border)] text-center";
  const iconClass = "w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center mx-auto mb-3";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div className={cardClass}>
        <div className={`${iconClass} bg-[var(--forest-50)]`}>
          <Coins className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--forest-500)]" />
        </div>
        <p className="text-xs text-gray-600 mb-1">Eco Points</p>
        <p className="font-bold text-base lg:text-xl">{userPoints.toLocaleString()}</p>
      </div>

      <motion.button
        onClick={onNavigateToRanking}
        whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.09)" }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={cardClass}
      >
        <div className={`${iconClass} bg-[var(--stone-100)]`}>
          <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--stone-700)]" />
        </div>
        <p className="text-xs text-gray-600 mb-1">Class Rank</p>
        <p className="font-bold text-base lg:text-xl">#4</p>
      </motion.button>

      <motion.button
        onClick={onNavigateToStreaks}
        whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.09)" }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={cardClass}
      >
        <div className={`${iconClass} bg-orange-100`}>
          <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
        </div>
        <p className="text-xs text-gray-600 mb-1">Day Streak</p>
        <p className="font-bold text-base lg:text-xl">{currentStreak}</p>
      </motion.button>

      <div className={cardClass}>
        <div className={`${iconClass} bg-violet-100`}>
          <Award className="w-5 h-5 lg:w-6 lg:h-6 text-violet-600" />
        </div>
        <p className="text-xs text-gray-600 mb-1">Badges</p>
        <p className="font-bold text-base lg:text-xl">3</p>
      </div>
    </div>
  );
}