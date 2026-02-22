import { Brain, Target, Camera, BookOpen } from "lucide-react";

interface QuickActionsProps {
  setActiveTab: (tab: string) => void;
  setProfileSection: (section: "overview" | "achievements" | "settings" | "notes" | "progression" | "quests" | "streaks" | "store" | "social") => void;
  onOpenQRScanner?: () => void;
}

export function QuickActions({ setActiveTab, setProfileSection, onOpenQRScanner }: QuickActionsProps) {
  const actions = [
    {
      id: "quiz",
      title: "Take Quiz",
      subtitle: "Test your knowledge",
      icon: <Brain className="w-6 h-6 text-white" />,
      color: "bg-[#3B82F6]",
      action: () => setActiveTab("quiz")
    },
    {
      id: "challenges",
      title: "Complete Challenge",
      subtitle: "Upload proof",
      icon: <Target className="w-6 h-6 text-white" />,
      color: "bg-[#8B5CF6]",
      action: () => setActiveTab("challenges")
    },
    {
      id: "qr-scan",
      title: "Scan QR Code",
      subtitle: "Quick eco-tip",
      icon: <Camera className="w-6 h-6 text-white" />,
      color: "bg-[#2ECC71]",
      action: () => onOpenQRScanner?.()
    },
    {
      id: "learn",
      title: "Learn More",
      subtitle: "Eco resources",
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: "bg-[#F59E0B]",
      action: () => handleLearnMore()
    }
  ];

  const handleLearnMore = () => {
    // Navigate to profile notes section
    setProfileSection("notes");
    setActiveTab("profile");
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[var(--border)] shadow-[var(--shadow-xs)]">
      <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`${action.color} rounded-xl p-4 lg:p-6 text-left shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                {action.icon}
              </div>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">{action.title}</h3>
            <p className="text-white/80 text-xs">{action.subtitle}</p>
          </button>
        ))}
      </div>
    </div>
  );
}