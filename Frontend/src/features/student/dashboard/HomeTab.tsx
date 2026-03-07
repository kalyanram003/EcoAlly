import { DashboardCards } from "./DashboardCards";
import { LearningMaterials } from "../../learning/LearningMaterials";
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
    <div className="space-y-6">
      <DashboardCards
        userPoints={userPoints}
        currentStreak={currentStreak}
        onNavigateToRanking={handleNavigateToRanking}
        onNavigateToStreaks={handleNavigateToStreaks}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-[var(--shadow-xs)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[var(--forest-50)] rounded-xl flex items-center justify-center">
                <span className="text-lg">📚</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Learning Hub</h3>
                <p className="text-gray-500 text-xs">Explore topics and build your eco knowledge</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { id: "waste-management", emoji: "♻️", label: "Waste Management", bg: "bg-blue-50  hover:bg-blue-100" },
                { id: "carbon-footprint", emoji: "🌍", label: "Carbon Footprint", bg: "bg-green-50 hover:bg-green-100" },
                { id: "renewable-energy", emoji: "⚡", label: "Renewable Energy", bg: "bg-yellow-50 hover:bg-yellow-100" },
                { id: "sustainable-living", emoji: "🌱", label: "Sustainable Living", bg: "bg-purple-50 hover:bg-purple-100" },
                { id: "water-conservation", emoji: "💧", label: "Water Conservation", bg: "bg-cyan-50   hover:bg-cyan-100" },
                { id: "biodiversity", emoji: "🦋", label: "Biodiversity", bg: "bg-pink-50   hover:bg-pink-100" },
                { id: "climate-change", emoji: "🌡️", label: "Climate Change", bg: "bg-red-50    hover:bg-red-100" },
                { id: "eco-transportation", emoji: "🚲", label: "Eco Transport", bg: "bg-indigo-50 hover:bg-indigo-100" },
              ].map(topic => (
                <button
                  key={topic.id}
                  onClick={() => handleNavigateToNotes(topic.id)}
                  className={`${topic.bg} p-2 sm:p-3 rounded-xl text-left transition-colors`}
                >
                  <div className="text-lg sm:text-xl mb-1">{topic.emoji}</div>
                  <div className="text-[11px] sm:text-xs font-medium text-gray-700 leading-tight line-clamp-2">{topic.label}</div>
                </button>
              ))}
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

        </div>

        <div className="space-y-6">
          <QuickActions
            setActiveTab={setActiveTab}
            setProfileSection={setProfileSection}
            onOpenQRScanner={onOpenQRScanner}
          />
          <Badges />
        </div>
      </div>
    </div>
  );
}