import { useState, useRef, useEffect } from "react";
import { Settings, Edit, Share2, Trophy, Target, Calendar, Flame, Award, Star, TrendingUp, Leaf, Bell, Shield, HelpCircle, LogOut, Camera, ChevronRight, BookOpen, Clock, CheckCircle, Lock, Crown, Zap, ShoppingCart, Users, FileText } from "lucide-react";
import { Switch } from "../../../components/ui/switch";
import { ProfileEditModal } from "./ProfileEditModal";
import { EditProfilePage } from "./EditProfilePage";
import { ShareProfileModal } from "./ShareProfileModal";
import { HelpSupportPage } from "../../shared/HelpSupportPage";
import { PrivacyTermsPage } from "../../shared/PrivacyTermsPage";
import { ProgressionSystem } from "../../gamification/ProgressionSystem";
import { QuestSystem } from "../../gamification/QuestSystem";
import { EnhancedStreaks } from "../../gamification/EnhancedStreaks";
import { VirtualStore } from "../../gamification/VirtualStore";
import { SocialFeatures } from "../../gamification/SocialFeatures";
import * as api from "../../../lib/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  totalPoints: number;
  joinDate: string;
  currentStreak: number;
  longestStreak: number;
  challengesCompleted: number;
  quizzesCompleted: number;
  rank: number;
  totalUsers: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: "quiz" | "challenge" | "streak" | "points" | "social";
}

interface ProfileTabProps {
  initialSection?: "overview" | "achievements" | "settings" | "notes" | "progression" | "quests" | "streaks" | "store" | "social";
  userPoints: number;
  userCoins: number;
  currentStreak: number;
  longestStreak: number;
  streakShields: number;
  onPurchase: (itemId: string, cost: number) => void;
  onCompleteQuest: (questId: string) => void;
  onPurchaseShield: () => void;
  onGiveKudo: (userId: string, message: string) => void;
  onJoinTeam: (teamId: string) => void;
  onLogout?: () => void;
  setActiveTab?: (tab: string) => void;
  notesFilter?: string;
}

export function ProfileTab({
  initialSection = "overview",
  userPoints,
  userCoins,
  currentStreak,
  longestStreak,
  streakShields,
  onPurchase,
  onCompleteQuest,
  onPurchaseShield,
  onGiveKudo,
  onJoinTeam,
  onLogout,
  setActiveTab,
  notesFilter
}: ProfileTabProps) {
  const [activeSection, setActiveSection] = useState<"overview" | "achievements" | "settings" | "notes" | "progression" | "quests" | "streaks" | "store" | "social">(initialSection);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditProfilePage, setShowEditProfilePage] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHelpPage, setShowHelpPage] = useState(false);
  const [showPrivacyPage, setShowPrivacyPage] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(notesFilter || null);
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    achievementAlerts: true,
    weeklyReports: false,
    socialUpdates: true
  });

  // References for smooth scrolling
  const settingsRef = useRef<HTMLDivElement>(null);

  // Start with sensible defaults; overwritten by API response
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "",
    name: "Loading…",
    email: "",
    avatar: "👤",
    level: 1,
    totalPoints: userPoints,
    joinDate: "",
    currentStreak: currentStreak,
    longestStreak: longestStreak,
    challengesCompleted: 0,
    quizzesCompleted: 0,
    rank: 0,
    totalUsers: 0,
    weeklyGoal: 200,
    weeklyProgress: 0
  });

  // Fetch live profile on mount
  useEffect(() => {
    api.getProfile().then((data) => {
      setUserProfile({
        id: data.userId ?? "",
        name:
          data.name ??
          data.fullName ??
          (`${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() ||
            data.username ||
            "Student"),
        email: data.email ?? "",
        avatar: data.avatarUrl ?? "👤",
        level: Math.max(1, Math.floor(userPoints / 200) + 1),
        totalPoints: userPoints,
        joinDate: data.createdAt ? new Date(data.createdAt).toISOString().split("T")[0] : "",
        currentStreak: currentStreak,
        longestStreak: longestStreak,
        challengesCompleted: data.challengesCompleted ?? 0,
        quizzesCompleted: data.quizzesCompleted ?? 0,
        rank: data.rank ?? 0,
        totalUsers: data.totalUsers ?? 0,
        weeklyGoal: 200,
        weeklyProgress: userPoints % 200
      });
    }).catch(() => {
      // API unavailable; keep defaults derived from props
      setUserProfile(prev => ({
        ...prev,
        totalPoints: userPoints,
        currentStreak: currentStreak,
        longestStreak: longestStreak
      }));
    });
  }, []);

  // Keep points/streak in sync when props change (e.g. after a quiz submit)
  useEffect(() => {
    setUserProfile(prev => ({
      ...prev,
      totalPoints: userPoints,
      currentStreak: currentStreak,
      longestStreak: longestStreak,
      level: Math.max(1, Math.floor(userPoints / 200) + 1)
    }));
  }, [userPoints, currentStreak, longestStreak]);

  const achievements: Achievement[] = [
    {
      id: "first-quiz",
      title: "Knowledge Seeker",
      description: "Complete your first quiz",
      icon: "🧠",
      earned: true,
      earnedDate: "2024-01-20",
      category: "quiz"
    },
    {
      id: "quiz-master",
      title: "Quiz Master",
      description: "Complete 20 quizzes",
      icon: "🎓",
      earned: false,
      category: "quiz"
    },
    {
      id: "first-challenge",
      title: "Action Taker",
      description: "Complete your first challenge",
      icon: "🎯",
      earned: true,
      earnedDate: "2024-01-25",
      category: "challenge"
    },
    {
      id: "eco-warrior",
      title: "Eco Warrior",
      description: "Complete 15 challenges",
      icon: "🌱",
      earned: false,
      category: "challenge"
    },
    {
      id: "week-streak",
      title: "Weekly Warrior",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      earned: true,
      earnedDate: "2024-02-01",
      category: "streak"
    },
    {
      id: "month-streak",
      title: "Monthly Master",
      description: "Maintain a 30-day streak",
      icon: "💪",
      earned: false,
      category: "streak"
    },
    {
      id: "points-1000",
      title: "Point Collector",
      description: "Earn 1000 points",
      icon: "⭐",
      earned: true,
      earnedDate: "2024-02-10",
      category: "points"
    },
    {
      id: "points-5000",
      title: "Point Master",
      description: "Earn 5000 points",
      icon: "💎",
      earned: false,
      category: "points"
    }
  ];

  const getProgressToNextLevel = () => {
    const pointsForNextLevel = (userProfile.level + 1) * 200;
    const pointsNeeded = pointsForNextLevel - userProfile.totalPoints;
    const progress = (userProfile.totalPoints % 200) / 200 * 100;
    return { pointsNeeded, progress };
  };

  const { pointsNeeded, progress } = getProgressToNextLevel();

  const weeklyProgressPercentage = (userProfile.weeklyProgress / userProfile.weeklyGoal) * 100;

  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);

  const handleProfileUpdate = async (updatedProfile: Partial<UserProfile>) => {
    try {
      await api.updateProfile({
        firstName: updatedProfile.name?.split(" ")[0],
        lastName: updatedProfile.name?.split(" ").slice(1).join(" "),
        avatarUrl: typeof updatedProfile.avatar === "string" ? updatedProfile.avatar : undefined
      });
    } catch {
      // ignore; optimistic update proceeds anyway
    }
    setUserProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  const handleEditProfile = () => {
    // Directly show edit profile page without scrolling
    setShowEditProfilePage(true);
  };

  const handleShareProfile = () => {
    setShowShareModal(true);
  };

  // Show help page if requested
  if (showHelpPage) {
    return <HelpSupportPage onBack={() => setShowHelpPage(false)} />;
  }

  // Show privacy page if requested
  if (showPrivacyPage) {
    return <PrivacyTermsPage onBack={() => setShowPrivacyPage(false)} />;
  }

  // Show EditProfilePage if requested
  if (showEditProfilePage) {
    return <EditProfilePage userProfile={userProfile} onUpdate={handleProfileUpdate} onBack={() => setShowEditProfilePage(false)} />;
  }

  return (
    <div className="p-4 pb-20">
      {/* Enhanced Profile Header */}
      <div className="relative bg-gradient-to-br from-[#2ECC71] via-[#27AE60] to-[#1E8449] rounded-2xl p-6 mb-6 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-white/20"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full border-2 border-white/20"></div>
          <div className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-white/10"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-18 h-18 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm overflow-hidden">
                  {userProfile.avatar.startsWith('data:') ? (
                    <img
                      src={userProfile.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">{userProfile.avatar}</span>
                  )}
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Camera className="w-4 h-4 text-[#2ECC71]" />
                </button>
              </div>
              <div>
                <h2>{userProfile.name}</h2>
                <p className="text-white/80">Level {userProfile.level} Eco Learner</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                  <span className="text-sm text-white/90">{earnedAchievements.length} achievements</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveSection("settings")}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-xl">{userProfile.totalPoints.toLocaleString()}</div>
              <div className="text-white/80 text-sm">Eco Points</div>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab("ranking")}
              className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <div className="text-xl">#{userProfile.rank}</div>
              <div className="text-white/80 text-sm">Class Rank</div>
              <div className="text-white/60 text-xs mt-1">View Rankings →</div>
            </button>
            <button
              onClick={() => setActiveSection("streaks")}
              className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-300" />
                <span className="text-xl">{userProfile.currentStreak}</span>
              </div>
              <div className="text-white/80 text-sm">Day Streak</div>
              <div className="text-white/60 text-xs mt-1">Manage Streaks →</div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Section Navigation */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 px-1">
          <button
            onClick={() => setActiveSection("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${activeSection === "overview"
              ? "bg-[#2ECC71] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <TrendingUp className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveSection("progression")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${activeSection === "progression"
              ? "bg-[#2ECC71] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Crown className="w-4 h-4" />
            Progression
          </button>
          <button
            onClick={() => setActiveSection("notes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${activeSection === "notes"
              ? "bg-[#2ECC71] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <BookOpen className="w-4 h-4" />
            Notes
          </button>
          <button
            onClick={() => setActiveSection("quests")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${activeSection === "quests"
              ? "bg-[#2ECC71] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Target className="w-4 h-4" />
            Quests
          </button>
          <button
            onClick={() => setActiveSection("streaks")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${activeSection === "streaks"
              ? "bg-[#2ECC71] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Flame className="w-4 h-4" />
            Streaks
          </button>
          <button
            onClick={() => setActiveSection("store")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${activeSection === "store"
              ? "bg-[#2ECC71] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Store
          </button>
          <button
            onClick={() => setActiveSection("social")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${activeSection === "social"
              ? "bg-[#2ECC71] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Users className="w-4 h-4" />
            Social
          </button>
          <button
            onClick={() => setActiveSection("achievements")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${activeSection === "achievements"
              ? "bg-[#2ECC71] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Trophy className="w-4 h-4" />
            Badges
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${activeSection === "settings"
              ? "bg-[#2ECC71] text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === "overview" && (
        <div className="space-y-6">
          {/* Level Progress */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Level Progress</h3>
              <span className="text-sm text-gray-500">Level {userProfile.level}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-[#2ECC71] h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {pointsNeeded} more points to reach Level {userProfile.level + 1}
            </p>
          </div>

          {/* Weekly Goal */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#2ECC71]" />
                <h3 className="font-semibold">Weekly Goal</h3>
              </div>
              <button className="text-[#2ECC71] text-sm font-medium">
                <Edit className="w-4 h-4 inline mr-1" />
                Edit
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-[#2ECC71] h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(weeklyProgressPercentage, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {userProfile.weeklyProgress} / {userProfile.weeklyGoal} points this week
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">Streaks</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-semibold">{userProfile.currentStreak}</div>
                <div className="text-xs text-gray-500">Current streak</div>
                <div className="text-sm text-gray-600">Best: {userProfile.longestStreak} days</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">Activity</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-semibold">{userProfile.challengesCompleted + userProfile.quizzesCompleted}</div>
                <div className="text-xs text-gray-500">Total completed</div>
                <div className="text-sm text-gray-600">{userProfile.challengesCompleted} challenges, {userProfile.quizzesCompleted} quizzes</div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-3">Recent Achievements</h3>
            <div className="space-y-3">
              {earnedAchievements.slice(-3).reverse().map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2ECC71]/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{achievement.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {achievement.earnedDate && new Date(achievement.earnedDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Gamification Sections */}
      {activeSection === "progression" && (
        <ProgressionSystem
          currentPoints={userPoints}
          onViewRewards={() => setActiveSection("store")}
        />
      )}

      {activeSection === "quests" && (
        <QuestSystem onCompleteQuest={onCompleteQuest} />
      )}

      {activeSection === "streaks" && (
        <EnhancedStreaks
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          streakShields={streakShields}
          onPurchaseShield={onPurchaseShield}
        />
      )}

      {activeSection === "store" && (
        <VirtualStore
          currentCoins={userCoins}
          onPurchase={onPurchase}
          onOpenChest={(chestId) => console.log(`Opening chest: ${chestId}`)}
        />
      )}

      {activeSection === "social" && (
        <SocialFeatures
          onJoinTeam={onJoinTeam}
          onGiveKudo={onGiveKudo}
        />
      )}

      {activeSection === "achievements" && (
        <div className="space-y-6">
          {/* Achievement Stats */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold text-[#2ECC71]">{earnedAchievements.length}</div>
                <div className="text-sm text-gray-600">Earned</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-400">{lockedAchievements.length}</div>
                <div className="text-sm text-gray-600">Locked</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-blue-600">{Math.round((earnedAchievements.length / achievements.length) * 100)}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>

          {/* Earned Achievements */}
          {earnedAchievements.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#2ECC71]" />
                Earned Badges
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {earnedAchievements.map((achievement) => (
                  <div key={achievement.id} className="relative border-2 border-[#2ECC71]/30 rounded-xl p-4 bg-gradient-to-br from-[#2ECC71]/5 to-[#27AE60]/10 hover:shadow-md transition-all duration-200">
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-[#2ECC71] rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white fill-current" />
                      </div>
                    </div>
                    <div className="text-center mb-3">
                      <div className="w-12 h-12 mx-auto bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
                        <span className="text-2xl">{achievement.icon}</span>
                      </div>
                    </div>
                    <h4 className="text-sm text-center mb-1 text-gray-900">{achievement.title}</h4>
                    <p className="text-xs text-gray-600 text-center leading-tight">{achievement.description}</p>
                    {achievement.earnedDate && (
                      <p className="text-xs text-[#2ECC71] text-center mt-2 bg-[#2ECC71]/10 rounded-full px-2 py-1">
                        {new Date(achievement.earnedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-400" />
                Locked Badges
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {lockedAchievements.map((achievement) => (
                  <div key={achievement.id} className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-gray-500" />
                      </div>
                    </div>
                    <div className="text-center mb-3">
                      <div className="w-12 h-12 mx-auto bg-white/50 rounded-xl flex items-center justify-center shadow-sm mb-2 opacity-40">
                        <span className="text-2xl grayscale">{achievement.icon}</span>
                      </div>
                    </div>
                    <h4 className="text-sm text-center mb-1 text-gray-500">{achievement.title}</h4>
                    <p className="text-xs text-gray-400 text-center leading-tight">{achievement.description}</p>
                    <div className="text-center mt-2">
                      <span className="text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-1">
                        Locked
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === "notes" && (
        <div className="space-y-4">
          {/* Topic Navigation */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#2ECC71]" />
              <h3 className="font-semibold">Learning Topics</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedTopic(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTopic === null
                  ? "bg-[#2ECC71] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                All Notes
              </button>
              <button
                onClick={() => setSelectedTopic("waste-management")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTopic === "waste-management"
                  ? "bg-[#2ECC71] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                ♻️ Waste Management
              </button>
              <button
                onClick={() => setSelectedTopic("carbon-footprint")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTopic === "carbon-footprint"
                  ? "bg-[#2ECC71] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                🌍 Carbon Footprint
              </button>
              <button
                onClick={() => setSelectedTopic("renewable-energy")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTopic === "renewable-energy"
                  ? "bg-[#2ECC71] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                ⚡ Renewable Energy
              </button>
              <button
                onClick={() => setSelectedTopic("sustainable-living")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTopic === "sustainable-living"
                  ? "bg-[#2ECC71] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                🌱 Sustainable Living
              </button>
              <button
                onClick={() => setSelectedTopic("water-conservation")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTopic === "water-conservation"
                  ? "bg-[#2ECC71] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                💧 Water Conservation
              </button>
              <button
                onClick={() => setSelectedTopic("biodiversity")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTopic === "biodiversity"
                  ? "bg-[#2ECC71] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                🦋 Biodiversity
              </button>
              <button
                onClick={() => setSelectedTopic("climate-change")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTopic === "climate-change"
                  ? "bg-[#2ECC71] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                🌡️ Climate Change
              </button>
              <button
                onClick={() => setSelectedTopic("eco-transportation")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTopic === "eco-transportation"
                  ? "bg-[#2ECC71] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                🚲 Eco Transport
              </button>
            </div>
          </div>

          {/* Learning Content */}
          {(selectedTopic === null || selectedTopic === "waste-management") && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">♻️</span>
                </div>
                <h3 className="font-semibold">Waste Management</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">The 3 R's: Reduce, Reuse, Recycle</h4>
                  <p className="text-sm text-gray-700 mb-2">The waste hierarchy prioritizes waste prevention first, followed by reuse and recycling.</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• <strong>Reduce:</strong> Buy only what you need and choose products with less packaging</li>
                    <li>• <strong>Reuse:</strong> Use items multiple times before disposing</li>
                    <li>• <strong>Recycle:</strong> Convert waste materials into new products</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Composting Basics</h4>
                  <p className="text-sm text-gray-700">Turn food scraps and yard waste into nutrient-rich soil. Compost needs a mix of green materials (food scraps) and brown materials (dry leaves, cardboard).</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Plastic Waste Facts</h4>
                  <p className="text-sm text-gray-700">Only 9% of all plastic ever made has been recycled. Plastic takes 500+ years to decompose. Choose reusable alternatives!</p>
                </div>
              </div>
            </div>
          )}

          {(selectedTopic === null || selectedTopic === "carbon-footprint") && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🌍</span>
                </div>
                <h3 className="font-semibold">Carbon Footprint</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">What is a Carbon Footprint?</h4>
                  <p className="text-sm text-gray-700">The total amount of greenhouse gases (including CO2) produced by our daily activities. Average person produces about 4 tons of CO2 per year.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">How to Reduce Your Carbon Footprint</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Walk, bike, or use public transport instead of driving</li>
                    <li>• Eat more plant-based meals</li>
                    <li>• Buy local and seasonal produce</li>
                    <li>• Reduce energy consumption at home</li>
                    <li>• Choose products with less packaging</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Food Impact</h4>
                  <p className="text-sm text-gray-700">Beef production creates 6x more CO2 than chicken. Food waste in landfills produces methane, a powerful greenhouse gas. Plan meals to reduce waste!</p>
                </div>
              </div>
            </div>
          )}

          {(selectedTopic === null || selectedTopic === "renewable-energy") && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">⚡</span>
                </div>
                <h3 className="font-semibold">Renewable Energy</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-yellow-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Types of Renewable Energy</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• <strong>Solar:</strong> Energy from the sun using panels or thermal systems</li>
                    <li>• <strong>Wind:</strong> Turbines convert wind into electricity</li>
                    <li>• <strong>Hydro:</strong> Water flow generates power</li>
                    <li>• <strong>Geothermal:</strong> Heat from Earth's core</li>
                    <li>• <strong>Biomass:</strong> Organic materials for energy</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Benefits of Renewable Energy</h4>
                  <p className="text-sm text-gray-700">Clean, unlimited resources that don't produce greenhouse gases. Reduces dependence on fossil fuels and creates green jobs.</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Home Energy Saving Tips</h4>
                  <p className="text-sm text-gray-700">Switch to LED bulbs (use 75% less energy), unplug devices when not in use, use natural light when possible, and insulate your home properly.</p>
                </div>
              </div>
            </div>
          )}

          {(selectedTopic === null || selectedTopic === "sustainable-living") && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🌱</span>
                </div>
                <h3 className="font-semibold">Sustainable Living</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Sustainable Daily Habits</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Use reusable bags, bottles, and containers</li>
                    <li>• Buy second-hand when possible</li>
                    <li>• Support local and sustainable businesses</li>
                    <li>• Grow your own herbs or vegetables</li>
                    <li>• Repair items instead of replacing them</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Eco-Friendly Shopping</h4>
                  <p className="text-sm text-gray-700">Look for products with eco-labels, choose items with minimal packaging, buy in bulk to reduce waste, and avoid fast fashion.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Zero Waste Lifestyle</h4>
                  <p className="text-sm text-gray-700">Aim to send nothing to landfills by refusing single-use items, choosing reusables, composting organic waste, and recycling properly.</p>
                </div>
              </div>
            </div>
          )}

          {(selectedTopic === null || selectedTopic === "water-conservation") && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💧</span>
                </div>
                <h3 className="font-semibold">Water Conservation</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-cyan-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Why Save Water?</h4>
                  <p className="text-sm text-gray-700">Only 0.5% of Earth's water is usable freshwater. Water scarcity affects 40% of the global population. Every drop counts!</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Water Saving Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Take shorter showers (save 5 gallons per minute)</li>
                    <li>• Turn off tap while brushing teeth</li>
                    <li>• Fix leaky faucets immediately</li>
                    <li>• Run dishwasher and washing machine only when full</li>
                    <li>• Collect rainwater for plants</li>
                  </ul>
                </div>
                <div className="bg-cyan-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Water Footprint</h4>
                  <p className="text-sm text-gray-700">Everything we consume requires water to produce. A burger needs 660 gallons, a cotton shirt needs 700 gallons. Choose wisely!</p>
                </div>
              </div>
            </div>
          )}

          {(selectedTopic === null || selectedTopic === "biodiversity") && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🦋</span>
                </div>
                <h3 className="font-semibold">Biodiversity</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-pink-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">What is Biodiversity?</h4>
                  <p className="text-sm text-gray-700">The variety of all life on Earth - plants, animals, fungi, and microorganisms. Essential for ecosystem health and human survival.</p>
                </div>
                <div className="bg-pink-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Why It Matters</h4>
                  <p className="text-sm text-gray-700">Biodiversity provides food, medicine, clean air and water, pollination, and climate regulation. 1 million species face extinction due to human activity.</p>
                </div>
                <div className="bg-pink-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">How to Help</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Plant native species in your garden</li>
                    <li>• Create habitats for wildlife (bird houses, bee hotels)</li>
                    <li>• Avoid pesticides and chemicals</li>
                    <li>• Support conservation organizations</li>
                    <li>• Reduce consumption and waste</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {(selectedTopic === null || selectedTopic === "climate-change") && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🌡️</span>
                </div>
                <h3 className="font-semibold">Climate Change</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-red-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Understanding Climate Change</h4>
                  <p className="text-sm text-gray-700">Long-term shifts in temperatures and weather patterns caused primarily by human activities releasing greenhouse gases since the Industrial Revolution.</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Current Impacts</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Rising global temperatures (1.1°C since 1880)</li>
                    <li>• More frequent extreme weather events</li>
                    <li>• Melting ice caps and rising sea levels</li>
                    <li>• Ocean acidification affecting marine life</li>
                    <li>• Changes in wildlife migration patterns</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Taking Action</h4>
                  <p className="text-sm text-gray-700">Individual actions matter! Reduce energy use, choose sustainable transport, eat less meat, waste less, and advocate for climate policies.</p>
                </div>
              </div>
            </div>
          )}

          {(selectedTopic === null || selectedTopic === "eco-transportation") && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🚲</span>
                </div>
                <h3 className="font-semibold">Eco-Friendly Transportation</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-indigo-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Green Transportation Options</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• <strong>Walking/Cycling:</strong> Zero emissions, improves health</li>
                    <li>• <strong>Public Transit:</strong> Reduces traffic and emissions per person</li>
                    <li>• <strong>Carpooling:</strong> Share rides, reduce cars on road</li>
                    <li>• <strong>Electric Vehicles:</strong> Lower emissions, especially with renewable energy</li>
                  </ul>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Transportation's Climate Impact</h4>
                  <p className="text-sm text-gray-700">Transportation accounts for 24% of global CO2 emissions. Switching to sustainable options can significantly reduce your carbon footprint.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Smart Travel Tips</h4>
                  <p className="text-sm text-gray-700">Plan trips efficiently, maintain your vehicle properly, avoid unnecessary acceleration, and combine errands into one trip to reduce fuel consumption.</p>
                </div>
              </div>
            </div>
          )}

          {/* Personal Notes Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#2ECC71]" />
              <h3 className="font-semibold">My Personal Notes</h3>
            </div>

            {/* Quick Add Note */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <textarea
                placeholder="Add a quick note about your eco journey..."
                className="w-full bg-transparent border-none resize-none focus:outline-none text-sm"
                rows={3}
              />
              <button className="mt-2 px-4 py-2 bg-[#2ECC71] text-white rounded-lg text-sm hover:bg-[#27AE60] transition-colors">
                Save Note
              </button>
            </div>

            {/* Sample Notes */}
            <div className="space-y-3">
              <div className="border-l-4 border-[#2ECC71] pl-3 py-2">
                <p className="text-sm text-gray-800">Learned about composting today - planning to start my own compost bin!</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday, 2:30 PM</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-3 py-2">
                <p className="text-sm text-gray-800">Completed the water conservation challenge. Reduced usage by 15% this week.</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago, 6:45 PM</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-3 py-2">
                <p className="text-sm text-gray-800">Planted 5 trees in the community garden with my eco club!</p>
                <p className="text-xs text-gray-500 mt-1">1 week ago, 10:15 AM</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "settings" && (
        <div ref={settingsRef} className="space-y-4">
          {/* Account Settings */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-4">Account</h3>
            <div className="space-y-1">
              <button
                onClick={handleEditProfile}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5 text-[#2ECC71]" />
                  <div className="text-left">
                    <h4 className="font-medium">Edit Profile</h4>
                    <p className="text-sm text-gray-600">Change your name, avatar, and details</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={handleShareProfile}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <h4 className="font-medium">Share Profile</h4>
                    <p className="text-sm text-gray-600">Share your eco journey with friends</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Enhanced Notifications */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-[#2ECC71]" />
              <h3>Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <h4>Daily Reminders</h4>
                  <p className="text-sm text-gray-600">Get notified about daily tasks</p>
                </div>
                <Switch
                  checked={notifications.dailyReminders}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, dailyReminders: checked }))}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <h4>Achievement Alerts</h4>
                  <p className="text-sm text-gray-600">Celebrate your accomplishments</p>
                </div>
                <Switch
                  checked={notifications.achievementAlerts}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, achievementAlerts: checked }))}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <h4>Weekly Reports</h4>
                  <p className="text-sm text-gray-600">Summary of your weekly progress</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <h4>Social Updates</h4>
                  <p className="text-sm text-gray-600">Friends' activities and team updates</p>
                </div>
                <Switch
                  checked={notifications.socialUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, socialUpdates: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Support & Information */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-4">Support & Information</h3>
            <div className="space-y-1">
              <button
                onClick={() => setShowHelpPage(true)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <h4 className="font-medium">Help & Support</h4>
                    <p className="text-sm text-gray-600">Get help and contact support</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => setShowPrivacyPage(true)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <h4 className="font-medium">Privacy & Terms</h4>
                    <p className="text-sm text-gray-600">Privacy policy and terms of service</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditModal && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          userProfile={userProfile}
          onSave={handleProfileUpdate}
        />
      )}

      {showShareModal && (
        <ShareProfileModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          userProfile={userProfile}
        />
      )}
    </div>
  );
}