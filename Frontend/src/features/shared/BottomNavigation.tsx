import { Home, Brain, Target, Trophy, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "quiz", label: "Quiz", icon: Brain },
    { id: "challenges", label: "Challenges", icon: Target },
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
            className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive ? 'text-[var(--forest-600)]' : 'text-gray-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}