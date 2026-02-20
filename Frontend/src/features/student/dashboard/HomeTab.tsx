import { DashboardCards } from "./DashboardCards";
import { LearningMaterials } from "../../learning/LearningMaterials";
import { TasksList } from "./TasksList";
import { Badges } from "../profile/Badges";
import { QuickActions } from "./QuickActions";
import { EnhancedGameOverview } from "../../gamification/EnhancedGameOverview";

interface HomeTabProps {
  setActiveTab: (tab: string) => void;
  setProfileSection: (section: "overview" | "achievements" | "settings" | "notes" | "progression" | "quests" | "streaks" | "store" | "social") => void;
  userPoints: number;
  currentStreak: number;
  onOpenProgression: () => void;
  onOpenQuests: () => void;
  onOpenStore: () => void;
  onOpenSocial: () => void;
  onOpenQRScanner?: () => void;
  setNotesFilter?: (topic: string) => void;
}

export function HomeTab({
  setActiveTab,
  setProfileSection,
  userPoints,
  currentStreak,
  onOpenProgression,
  onOpenQuests,
  onOpenStore,
  onOpenSocial,
  onOpenQRScanner,
  setNotesFilter
}: HomeTabProps) {
  const handleNavigateToRanking = () => {
    setActiveTab("ranking");
  };

  const handleNavigateToStreaks = () => {
    setProfileSection("streaks");
    setActiveTab("profile");
  };

  const handleNavigateToNotes = (topic: string) => {
    if (setNotesFilter) {
      setNotesFilter(topic);
    }
    setProfileSection("notes");
    setActiveTab("profile");
  };

  return (
    <div className="pb-4">
      <DashboardCards
        userPoints={userPoints}
        currentStreak={currentStreak}
        onNavigateToRanking={handleNavigateToRanking}
        onNavigateToStreaks={handleNavigateToStreaks}
      />
      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#2ECC71]/10 rounded-lg flex items-center justify-center">
              <span className="text-lg">📚</span>
            </div>
            <h3 className="font-semibold">Learning Hub</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Explore topics and build your eco knowledge</p>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3 w-max">
              <button
                onClick={() => handleNavigateToNotes("waste-management")}
                className="bg-blue-50 p-3 rounded-lg text-left hover:bg-blue-100 transition-colors min-w-[140px]"
              >
                <div className="text-lg mb-1">♻️</div>
                <div className="text-sm font-medium">Waste Management</div>
              </button>
              <button
                onClick={() => handleNavigateToNotes("carbon-footprint")}
                className="bg-green-50 p-3 rounded-lg text-left hover:bg-green-100 transition-colors min-w-[140px]"
              >
                <div className="text-lg mb-1">🌍</div>
                <div className="text-sm font-medium">Carbon Footprint</div>
              </button>
              <button
                onClick={() => handleNavigateToNotes("renewable-energy")}
                className="bg-yellow-50 p-3 rounded-lg text-left hover:bg-yellow-100 transition-colors min-w-[140px]"
              >
                <div className="text-lg mb-1">⚡</div>
                <div className="text-sm font-medium">Renewable Energy</div>
              </button>
              <button
                onClick={() => handleNavigateToNotes("sustainable-living")}
                className="bg-purple-50 p-3 rounded-lg text-left hover:bg-purple-100 transition-colors min-w-[140px]"
              >
                <div className="text-lg mb-1">🌱</div>
                <div className="text-sm font-medium">Sustainable Living</div>
              </button>
              <button
                onClick={() => handleNavigateToNotes("water-conservation")}
                className="bg-cyan-50 p-3 rounded-lg text-left hover:bg-cyan-100 transition-colors min-w-[140px]"
              >
                <div className="text-lg mb-1">💧</div>
                <div className="text-sm font-medium">Water Conservation</div>
              </button>
              <button
                onClick={() => handleNavigateToNotes("biodiversity")}
                className="bg-pink-50 p-3 rounded-lg text-left hover:bg-pink-100 transition-colors min-w-[140px]"
              >
                <div className="text-lg mb-1">🦋</div>
                <div className="text-sm font-medium">Biodiversity</div>
              </button>
              <button
                onClick={() => handleNavigateToNotes("climate-change")}
                className="bg-red-50 p-3 rounded-lg text-left hover:bg-red-100 transition-colors min-w-[140px]"
              >
                <div className="text-lg mb-1">🌡️</div>
                <div className="text-sm font-medium">Climate Change</div>
              </button>
              <button
                onClick={() => handleNavigateToNotes("eco-transportation")}
                className="bg-indigo-50 p-3 rounded-lg text-left hover:bg-indigo-100 transition-colors min-w-[140px]"
              >
                <div className="text-lg mb-1">🚲</div>
                <div className="text-sm font-medium">Eco Transport</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <EnhancedGameOverview
        userPoints={userPoints}
        currentStreak={currentStreak}
        onOpenProgression={onOpenProgression}
        onOpenQuests={onOpenQuests}
        onOpenStore={onOpenStore}
        onOpenSocial={onOpenSocial}
      />
      <QuickActions
        setActiveTab={setActiveTab}
        setProfileSection={setProfileSection}
        onOpenQRScanner={onOpenQRScanner}
      />
      <TasksList />
      <Badges />
    </div>
  );
}