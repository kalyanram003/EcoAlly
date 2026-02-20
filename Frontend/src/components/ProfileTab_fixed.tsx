import { useState, useRef } from "react";
import { Settings, Edit, Share2, Trophy, Target, Calendar, Flame, Award, Star, TrendingUp, Leaf, Bell, Shield, HelpCircle, LogOut, Camera, ChevronRight, BookOpen, Clock, CheckCircle, Lock, Crown, Zap, ShoppingCart, Users, FileText } from "lucide-react";
import { Switch } from "./ui/switch";
import { ProfileEditModal } from "./ProfileEditModal";
import { EditProfilePage } from "./EditProfilePage";
import { ShareProfileModal } from "./ShareProfileModal";
import { HelpSupportPage } from "./HelpSupportPage";
import { PrivacyTermsPage } from "./PrivacyTermsPage";
import { ProgressionSystem } from "./ProgressionSystem";
import { QuestSystem } from "./QuestSystem";
import { EnhancedStreaks } from "./EnhancedStreaks";
import { VirtualStore } from "./VirtualStore";
import { SocialFeatures } from "./SocialFeatures";

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
  currentStreak: number;
  longestStreak: number;
  streakShields: number;
  onPurchase: (itemId: string, cost: number) => void;
  onCompleteQuest: (questId: string) => void;
  onPurchaseShield: () => void;
  onGiveKudo: (userId: string, message: string) => void;
  onJoinTeam: (teamId: string) => void;
  onLogout?: () => void;
}

export function ProfileTab({ 
  initialSection = "overview",
  userPoints,
  currentStreak,
  longestStreak,
  streakShields,
  onPurchase,
  onCompleteQuest,
  onPurchaseShield,
  onGiveKudo,
  onJoinTeam,
  onLogout
}: ProfileTabProps) {
  const [activeSection, setActiveSection] = useState<"overview" | "achievements" | "settings" | "notes" | "progression" | "quests" | "streaks" | "store" | "social">(initialSection);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditProfilePage, setShowEditProfilePage] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHelpPage, setShowHelpPage] = useState(false);
  const [showPrivacyPage, setShowPrivacyPage] = useState(false);
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    achievementAlerts: true,
    weeklyReports: false,
    socialUpdates: true
  });

  // References for smooth scrolling
  const settingsRef = useRef<HTMLDivElement>(null);
  const editProfileButtonRef = useRef<HTMLButtonElement>(null);

  // Mock user data - in a real app, this would come from an API
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "user123",
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar: "👤",
    level: 12,
    totalPoints: userPoints,
    joinDate: "2024-01-15",
    currentStreak: currentStreak,
    longestStreak: longestStreak,
    challengesCompleted: 8,
    quizzesCompleted: 18,
    rank: 4,
    totalUsers: 24,
    weeklyGoal: 200,
    weeklyProgress: 180
  });

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

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  const handleEditProfile = () => {
    // First scroll to settings section
    setActiveSection("settings");
    setTimeout(() => {
      // Scroll to the edit profile button specifically
      editProfileButtonRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
      // Then show edit profile page after scroll
      setTimeout(() => {
        setShowEditProfilePage(true);
      }, 500); // Increased timeout to ensure scrolling completes
    }, 100);
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
    return <EditProfilePage userProfile={userProfile} onSave={handleProfileUpdate} onBack={() => setShowEditProfilePage(false)} />;
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
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-xl">#{userProfile.rank}</div>
              <div className="text-white/80 text-sm">Class Rank</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-300" />
                <span className="text-xl">{userProfile.currentStreak}</span>
              </div>
              <div className="text-white/80 text-sm">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Section Navigation */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 px-1">
          <button
            onClick={() => setActiveSection("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeSection === "overview"
                ? "bg-[#2ECC71] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveSection("progression")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeSection === "progression"
                ? "bg-[#2ECC71] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Crown className="w-4 h-4" />
            Progression
          </button>
          <button
            onClick={() => setActiveSection("quests")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeSection === "quests"
                ? "bg-[#2ECC71] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Target className="w-4 h-4" />
            Quests
          </button>
          <button
            onClick={() => setActiveSection("streaks")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeSection === "streaks"
                ? "bg-[#2ECC71] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Flame className="w-4 h-4" />
            Streaks
          </button>
          <button
            onClick={() => setActiveSection("store")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeSection === "store"
                ? "bg-[#2ECC71] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Store
          </button>
          <button
            onClick={() => setActiveSection("social")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeSection === "social"
                ? "bg-[#2ECC71] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Users className="w-4 h-4" />
            Social
          </button>
          <button
            onClick={() => setActiveSection("achievements")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeSection === "achievements"
                ? "bg-[#2ECC71] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Badges
          </button>
          <button
            onClick={() => setActiveSection("notes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeSection === "notes"
                ? "bg-[#2ECC71] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Leaf className="w-4 h-4" />
            Notes
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeSection === "settings"
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
          currentPoints={userPoints}
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
          {/* Notes Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#2ECC71]" />
              <h3 className="font-semibold">My Eco Notes</h3>
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
                ref={editProfileButtonRef}
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
                  <p className="text-sm text-gray-600">Get your eco progress summary</p>
                </div>
                <Switch 
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <h4>Social Updates</h4>
                  <p className="text-sm text-gray-600">Friend achievements and activities</p>
                </div>
                <Switch 
                  checked={notifications.socialUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, socialUpdates: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Support & Legal */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-4">Support & Legal</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setShowHelpPage(true)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <h4 className="font-medium">Help & Support</h4>
                    <p className="text-sm text-gray-600">Get help or contact support</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button 
                onClick={() => setShowPrivacyPage(true)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <div className="text-left">
                    <h4 className="font-medium">Privacy & Terms</h4>
                    <p className="text-sm text-gray-600">View privacy policy and terms</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-red-600" />
                    <div className="text-left">
                      <h4 className="font-medium text-red-600">Sign Out</h4>
                      <p className="text-sm text-gray-600">Sign out from your account</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
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