import { Home, Brain, Target, Trophy, User, Map, BookOpen, AlertTriangle } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "quiz", label: "Quiz", icon: Brain },
    { id: "challenges", label: "Challenges", icon: Target },

    { id: "ecomap", label: "EcoMap", icon: Map },
    { id: "awakemap", label: "AwakeMap", icon: AlertTriangle },
    { id: "ranking", label: "Ranking", icon: Trophy },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center gap-0.5 px-1 py-1.5 sm:px-2 sm:py-2 rounded-lg transition-colors flex-1 min-w-0 ${isActive ? 'text-[var(--forest-600)]' : 'text-gray-400'
              }`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-xs font-medium truncate w-full text-center">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}