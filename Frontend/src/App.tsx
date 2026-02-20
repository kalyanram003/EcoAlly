import { useState, useEffect } from "react";
import * as api from "./lib/api";
import { Header } from "./features/shared/Header";
import { HomeTab } from "./features/student/dashboard/HomeTab";
import { QuizTab } from "./features/student/quiz/QuizTab";
import { ChallengesTab } from "./features/student/challenges/ChallengesTab";
import { LeaderboardTab } from "./features/student/leaderboard/LeaderboardTab";
import { ProfileTab } from "./features/student/profile/ProfileTab";
import { PlaceholderTab } from "./features/shared/PlaceholderTab";
import { BottomNavigation } from "./features/shared/BottomNavigation";
import { LoginPage } from "./features/auth/LoginPage";
import { SignUpPage } from "./features/auth/SignUpPage";
import { UserInfoPage } from "./features/auth/UserInfoPage";
import { ProgressionSystem } from "./features/gamification/ProgressionSystem";
import { QuestSystem } from "./features/gamification/QuestSystem";
import { EnhancedStreaks } from "./features/gamification/EnhancedStreaks";
import { VirtualStore } from "./features/gamification/VirtualStore";
import { SocialFeatures } from "./features/gamification/SocialFeatures";
import { QRScannerPage } from "./features/shared/QRScannerPage";
import { TeacherDashboard } from "./features/teacher/TeacherDashboard";

// Demo data for easy signup testing
export const demoSignupData = {
  student: {
    signup: {
      email: "emma.wilson@email.com",
      username: "EcoExplorer2024",
      password: "GreenFuture123!"
    },
    personal: {
      firstName: "Emma",
      lastName: "Wilson",
      dateOfBirth: "2010-03-15",
      gender: "female",
      phone: "+1 (555) 234-5678",
      city: "San Francisco",
      address: "1234 Green Valley Road, Apt 5B",
      userType: "student"
    },
    guardian: {
      guardianName: "Jennifer Wilson",
      guardianRelationship: "mother",
      guardianEmail: "jennifer.wilson@gmail.com",
      guardianPhone: "+1 (555) 234-5679",
      guardianAddress: "1234 Green Valley Road, Apt 5B",
      guardianOccupation: "Environmental Engineer"
    },
    institute: {
      instituteName: "Greenwood Elementary Institute",
      instituteCity: "San Francisco",
      instituteId: "SCH001",
      academicRollNo: "2024-STU-001",
      gradeYear: "Grade 8",
      sectionCourse: "Section A"
    }
  },
  teacher: {
    signup: {
      email: "david.green@email.com",
      username: "TeacherGreen42",
      password: "EcoTeach@456"
    },
    personal: {
      firstName: "David",
      lastName: "Green",
      dateOfBirth: "1985-07-22",
      gender: "male",
      phone: "+1 (555) 345-6789",
      city: "Portland",
      address: "567 Oak Street, Unit 12",
      userType: "teacher"
    },
    institute: {
      instituteName: "Environmental Science College",
      instituteCity: "Portland",
      instituteId: "COL001",
      facultyId: "FAC-ENV-2024-042",
      rolePassword: "EcoTeach@456"
    }
  },
  admin: {
    signup: {
      email: "maria.santos@email.com",
      username: "AdminMaria_2024",
      password: "SchoolAdmin789!"
    },
    personal: {
      firstName: "Maria",
      lastName: "Santos",
      dateOfBirth: "1978-11-08",
      gender: "female",
      phone: "+1 (555) 456-7890",
      city: "Austin",
      address: "890 Education Boulevard",
      userType: "admin"
    },
    institute: {
      instituteName: "Austin Environmental University",
      instituteCity: "Austin",
      instituteId: "COL002",
      adminId: "ADM-AEU-2024-003",
      rolePassword: "SchoolAdmin789!"
    }
  }
};

export default function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authView, setAuthView] = useState<"login" | "signup" | "userInfo">("login");

  // Registration flow state
  const [registrationData, setRegistrationData] = useState<any>(null);

  // App state
  const [activeTab, setActiveTab] = useState("home");
  const [profileSection, setProfileSection] = useState<"overview" | "achievements" | "settings" | "notes" | "progression" | "quests" | "streaks" | "store" | "social">("overview");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [notesFilter, setNotesFilter] = useState<string | undefined>(undefined);

  // Gamification state (initialised to 0 — filled by API on login/auto-login)
  const [userPoints, setUserPoints] = useState(0);
  const [userCoins, setUserCoins] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [streakShields, setStreakShields] = useState(0);

  // ── Auto-login on mount (restore session from localStorage token) ──────────
  useEffect(() => {
    const t = api.token.get();
    if (!t) return;
    api.getMe()
      .then((res) => {
        setCurrentUser({ ...res.user, userType: res.user.userType.toLowerCase() });
        if (res.roleRecord) {
          setUserPoints(res.roleRecord.points ?? 0);
          setUserCoins(res.roleRecord.coins ?? 0);
          setCurrentStreak(res.roleRecord.currentStreak ?? 0);
          setLongestStreak(res.roleRecord.longestStreak ?? 0);
          setStreakShields(res.roleRecord.streakShields ?? 0);
        }
        setIsLoggedIn(true);
      })
      .catch(() => api.token.clear());
  }, []);

  // ── Authentication handlers ───────────────────────────────────────────────
  const handleLogin = async (credentials: any) => {
    try {
      const result = await api.login(
        credentials.identifier ?? credentials.email ?? credentials.phone,
        credentials.password
      );
      api.token.set(result.token);
      setCurrentUser({ ...result.user, userType: result.user.userType.toLowerCase() });
      if (result.roleRecord) {
        setUserPoints(result.roleRecord.points ?? 0);
        setUserCoins(result.roleRecord.coins ?? 0);
        setCurrentStreak(result.roleRecord.currentStreak ?? 0);
        setLongestStreak(result.roleRecord.longestStreak ?? 0);
        setStreakShields(result.roleRecord.streakShields ?? 0);
      }
      setIsLoggedIn(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSignUp = (userData: { email: string; username: string; password: string }) => {
    // Store initial signup data and move to user-info page for profile completion
    setRegistrationData(userData);
    setAuthView("userInfo");
  };

  const handleUserInfoComplete = async (userInfo: any) => {
    try {
      const payload = {
        ...registrationData,
        ...userInfo,
        userType: userInfo.userType.toUpperCase(),
        adminRole: userInfo.adminId ?? userInfo.adminRole,  // remap adminId → adminRole
      };
      const result = await api.register(payload);
      api.token.set(result.token);
      setCurrentUser({ ...result.user, userType: result.user.userType.toLowerCase() });
      setUserPoints(0);
      setUserCoins(0);
      setCurrentStreak(0);
      setLongestStreak(0);
      setStreakShields(0);
      setIsLoggedIn(true);
      setRegistrationData(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    api.token.clear();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab("home");
  };

  // ── Navigation helpers ────────────────────────────────────────────────────
  const openProgressionSystem = () => { setProfileSection("progression"); setActiveTab("profile"); };
  const openQuestSystem = () => { setProfileSection("quests"); setActiveTab("profile"); };
  const openStreakSystem = () => { setProfileSection("streaks"); setActiveTab("profile"); };
  const openVirtualStore = () => { setProfileSection("store"); setActiveTab("profile"); };
  const openSocialFeatures = () => { setProfileSection("social"); setActiveTab("profile"); };
  const openQRScanner = () => setShowQRScanner(true);

  // ── Gamification handlers ─────────────────────────────────────────────────

  // Called by VirtualStore after a successful API purchase to sync coins locally
  const handlePurchase = (_itemId: string, cost: number) => {
    setUserCoins((prev) => prev - cost);
  };

  const handleCompleteQuest = (questId: string) => {
    console.log(`Quest completed: ${questId}`);
  };

  const handlePurchaseShield = async () => {
    try {
      const result = await api.purchaseShield();
      setStreakShields(result.streakShields);
      setUserCoins(result.coins);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGiveKudo = (userId: string, message: string) => {
    console.log(`Gave kudo to ${userId}: ${message}`);
  };

  const handleJoinTeam = (teamId: string) => {
    console.log(`Joined team: ${teamId}`);
  };

  // ── Tab rendering ─────────────────────────────────────────────────────────
  const renderTabContent = () => {
    if (showQRScanner) {
      return <QRScannerPage onBack={() => setShowQRScanner(false)} />;
    }

    switch (activeTab) {
      case "home":
        return (
          <HomeTab
            setActiveTab={setActiveTab}
            setProfileSection={setProfileSection}
            userPoints={userPoints}
            currentStreak={currentStreak}
            onOpenProgression={openProgressionSystem}
            onOpenQuests={openQuestSystem}
            onOpenStore={openVirtualStore}
            onOpenSocial={openSocialFeatures}
            onOpenQRScanner={openQRScanner}
            setNotesFilter={setNotesFilter}
          />
        );
      case "quiz":
        return <QuizTab />;
      case "challenges":
        return <ChallengesTab />;
      case "ranking":
        return <LeaderboardTab />;
      case "profile":
        return (
          <ProfileTab
            initialSection={profileSection}
            userPoints={userPoints}
            userCoins={userCoins}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            streakShields={streakShields}
            onPurchase={handlePurchase}
            onCompleteQuest={handleCompleteQuest}
            onPurchaseShield={handlePurchaseShield}
            onGiveKudo={handleGiveKudo}
            onJoinTeam={handleJoinTeam}
            onLogout={handleLogout}
            setActiveTab={setActiveTab}
            notesFilter={notesFilter}
          />
        );
      default:
        return (
          <HomeTab
            setActiveTab={setActiveTab}
            setProfileSection={setProfileSection}
            userPoints={userPoints}
            currentStreak={currentStreak}
            onOpenProgression={openProgressionSystem}
            onOpenQuests={openQuestSystem}
            onOpenStore={openVirtualStore}
            onOpenSocial={openSocialFeatures}
            onOpenQRScanner={openQRScanner}
          />
        );
    }
  };

  // ── Auth screens ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    if (authView === "signup") {
      return (
        <SignUpPage
          onSignUp={handleSignUp}
          onBackToLogin={() => setAuthView("login")}
        />
      );
    }

    if (authView === "userInfo") {
      return (
        <UserInfoPage
          initialData={registrationData}
          onComplete={handleUserInfoComplete}
          onBack={() => setAuthView("signup")}
        />
      );
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onShowSignup={() => setAuthView("signup")}
      />
    );
  }

  // Teacher / admin dashboard
  if (currentUser?.userType === "teacher" || currentUser?.userType === "admin") {
    return (
      <TeacherDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // Student app
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col max-w-md mx-auto relative">
      <Header setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-y-auto pb-20">
        {renderTabContent()}
      </div>

      {!showQRScanner && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md">
          <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
    </div>
  );
}