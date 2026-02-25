import { useState, useEffect } from "react";
import { Calendar, Clock, Trophy, Users, Zap, CheckCircle, Circle, Star, Target, Crown } from "lucide-react";
import { Button } from "../../components/ui/button";
import * as api from "../../lib/api";

export interface Quest {
  id: string;
  type: "daily" | "weekly" | "epic";
  title: string;
  description: string;
  emoji: string;
  progress: number;
  maxProgress: number;
  points: number;
  deadline?: Date;
  completed: boolean;
  color: string;
  requirements: string[];
  bonus?: string;
}

interface QuestSystemProps {
  onCompleteQuest?: (questId: string) => void;
}

export function QuestSystem({ onCompleteQuest }: QuestSystemProps) {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "epic">("daily");
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuests = () => {
    setLoading(true);
    api.getQuests()
      .then((data) => {
        const mapped: Quest[] = data.map((q: any) => ({
          id: String(q.id),
          // backend sends "DAILY", "WEEKLY", "EPIC" — convert to lowercase
          type: (q.type ? q.type.toLowerCase() : "daily") as "daily" | "weekly" | "epic",
          title: q.title ?? "Quest",
          description: q.description ?? "",
          emoji: q.emoji ?? "🎯",
          progress: q.progress ?? 0,
          maxProgress: q.maxProgress ?? q.target ?? 1,
          points: q.points ?? q.reward ?? 0,
          deadline: q.deadline ? new Date(q.deadline) : undefined,
          completed: q.completed ?? false,
          color: q.color ?? "bg-green-100 border-green-300",
          requirements: q.requirements ?? [],
          bonus: q.bonus,
        }));
        setQuests(mapped);
      })
      .catch(() => setQuests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchQuests(); }, []);



  const getQuestsByType = (type: "daily" | "weekly" | "epic") => {
    return quests.filter(quest => quest.type === type);
  };

  const getTabIcon = (type: "daily" | "weekly" | "epic") => {
    switch (type) {
      case "daily":
        return <Calendar className="w-4 h-4" />;
      case "weekly":
        return <Target className="w-4 h-4" />;
      case "epic":
        return <Crown className="w-4 h-4" />;
    }
  };

  const getTabColor = (type: "daily" | "weekly" | "epic") => {
    switch (type) {
      case "daily":
        return activeTab === type ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600";
      case "weekly":
        return activeTab === type ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600";
      case "epic":
        return activeTab === type ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600";
    }
  };

  const formatTimeRemaining = (deadline: Date): string => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getProgressColor = (type: "daily" | "weekly" | "epic") => {
    switch (type) {
      case "daily": return "bg-green-500";
      case "weekly": return "bg-blue-500";
      case "epic": return "bg-purple-500";
    }
  };

  const currentQuests = getQuestsByType(activeTab);
  const completedCount = currentQuests.filter(q => q.completed).length;
  const totalCount = currentQuests.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🎯 Quest Center</h2>
        <p className="text-gray-600">Complete quests to earn extra rewards!</p>
      </div>

      {/* Quest Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {["daily", "weekly", "epic"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${getTabColor(type as any)}`}
          >
            {getTabIcon(type as any)}
            <span className="capitalize">{type}</span>
          </button>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold capitalize">{activeTab} Quests</h3>
          <span className="text-sm text-gray-500">{completedCount}/{totalCount} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(activeTab)}`}
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        {currentQuests.map((quest) => (
          <div key={quest.id} className={`bg-white rounded-xl border-2 p-4 ${quest.color} ${quest.completed ? 'opacity-75' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                  {quest.emoji}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold flex items-center gap-2">
                    {quest.title}
                    {quest.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">{quest.description}</p>
                  {quest.deadline && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeRemaining(quest.deadline)} remaining</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-[#2ECC71] font-semibold">
                  <Star className="w-4 h-4" />
                  <span>{quest.points}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium">{quest.progress}/{quest.maxProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(quest.type)}`}
                  style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-2 mb-3">
              <h5 className="text-sm font-medium text-gray-700">Requirements:</h5>
              <div className="space-y-1">
                {quest.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <Circle className="w-3 h-3 text-gray-400" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus */}
            {quest.bonus && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Bonus: {quest.bonus}</span>
                </div>
              </div>
            )}

            {/* Action Button */}
            {!quest.completed && (
              <Button
                onClick={async () => {
                  if (quest.progress >= quest.maxProgress) {
                    try {
                      await api.claimQuest(quest.id);
                      fetchQuests();
                      onCompleteQuest?.(quest.id);
                    } catch (err: any) {
                      alert(err.message);
                    }
                  }
                }}
                className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                disabled={quest.progress < quest.maxProgress}
              >
                {quest.progress >= quest.maxProgress ? "Claim Reward! 🏆" : "Work on Quest"}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Achievement Summary */}
      <div className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Quest Master Progress</h3>
            <p className="text-white/80 text-sm">Complete all quest types to unlock special rewards!</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{completedCount}</div>
            <div className="text-white/80 text-xs">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}