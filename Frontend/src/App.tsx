import { useState } from "react";
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

// Mock user database for testing
const mockUsers = [
  {
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    username: "EcoWarrior2024",
    password: "EcoLearn123!",
    firstName: "Alex",
    lastName: "Johnson",
    dateOfBirth: "2008-06-15",
    gender: "male",
    city: "Los Angeles",
    address: "456 Sunset Boulevard, Apt 3A",
    guardianName: "Michael Johnson",
    guardianRelationship: "father",
    guardianEmail: "michael.johnson@email.com",
    guardianPhone: "+1 (555) 123-4568",
    guardianAddress: "456 Sunset Boulevard, Apt 3A",
    guardianOccupation: "Software Engineer",
    instituteName: "Hollywood High Institute",
    instituteCity: "Los Angeles",
    instituteId: "SCH002",
    academicRollNo: "2024-STU-042",
    gradeYear: "Grade 10",
    sectionCourse: "Section B",
    userType: "student"
  },
  {
    email: "sarah.green@email.com",
    phone: "+1 (555) 987-6543",
    username: "GreenThumb!",
    password: "Nature@123",
    firstName: "Sarah",
    lastName: "Green",
    dateOfBirth: "1990-03-22",
    gender: "female",
    city: "Seattle",
    address: "789 Pine Street, Unit 12B",
    instituteName: "Seattle Academy of Arts & Sciences",
    instituteCity: "Seattle",
    instituteId: "SCH003",
    facultyId: "FAC-SEAS-2024-15",
    rolePassword: "Nature@123",
    userType: "teacher"
  },
  {
    email: "mike.earth@email.com",
    phone: "+1 (555) 456-7890",
    username: "EarthGuardian",
    password: "Planet#2024",
    firstName: "Mike",
    lastName: "Earth",
    dateOfBirth: "1985-11-08",
    gender: "male",
    city: "Denver",
    address: "321 Mountain View Drive",
    instituteName: "Denver Environmental University",
    instituteCity: "Denver",
    instituteId: "COL003",
    adminId: "ADM-DENV-2024-001",
    rolePassword: "Planet#2024",
    userType: "admin"
  }
];

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

  // Enhanced Gamification State
  const [userPoints, setUserPoints] = useState(2100);
  const [currentStreak, setCurrentStreak] = useState(5);
  const [longestStreak, setLongestStreak] = useState(18);
  const [streakShields, setStreakShields] = useState(1);

  // Authentication handlers
  const handleLogin = (credentials: { email: string; password: string; role?: string; roleId?: string; rolePassword?: string }) => {
    // Check against mock database
    const user = mockUsers.find(u =>
      (u.email === credentials.email || u.phone === credentials.email) &&
      u.password === credentials.password
    );

    if (!user) {
      alert("Invalid email/phone or password. Please check the test credentials in the login page.");
      return;
    }

    // For students, no additional verification needed
    if (!credentials.role || credentials.role === "student") {
      setCurrentUser(user);
      setIsLoggedIn(true);
      console.log("Login successful:", user.username);
      return;
    }

    // For teachers and admins, verify role-specific credentials
    if (credentials.role === "teacher") {
      if (user.userType !== "teacher") {
        alert("This account is not registered as a teacher.");
        return;
      }
      if (!credentials.roleId || !credentials.rolePassword) {
        alert("Teacher ID and password are required.");
        return;
      }
      if (user.facultyId !== credentials.roleId || user.rolePassword !== credentials.rolePassword) {
        alert("Invalid teacher ID or password.");
        return;
      }
    } else if (credentials.role === "admin") {
      if (user.userType !== "admin") {
        alert("This account is not registered as an admin.");
        return;
      }
      if (!credentials.roleId || !credentials.rolePassword) {
        alert("Admin ID and password are required.");
        return;
      }
      if (user.adminId !== credentials.roleId || user.rolePassword !== credentials.rolePassword) {
        alert("Invalid admin ID or password.");
        return;
      }
    }

    setCurrentUser(user);
    setIsLoggedIn(true);
    console.log("Login successful:", user.username, "as", credentials.role);
  };

  const handleSignUp = (userData: { email: string; username: string; password: string }) => {
    // Check if user already exists
    const existingUser = mockUsers.find(u =>
      u.email === userData.email ||
      u.phone === userData.email ||
      u.username === userData.username
    );

    if (existingUser) {
      alert("User already exists with this email/phone or username.");
      return;
    }

    // Store registration data and move to user info page
    setRegistrationData(userData);
    setAuthView("userInfo");
  };

  const handleUserInfoComplete = (userInfo: any) => {
    // Complete registration process
    const completeUserData = {
      ...registrationData,
      ...userInfo,
      createdAt: new Date().toISOString()
    };

    // Add new user to mock database
    const newUser = {
      email: completeUserData.email.includes("@") ? completeUserData.email : "",
      phone: completeUserData.email.includes("@") ? "" : completeUserData.email,
      username: completeUserData.username,
      password: completeUserData.password,
      ...completeUserData
    };

    mockUsers.push(newUser);
    console.log("Registration completed:", newUser);

    // Reset registration state and redirect to login
    setRegistrationData(null);
    setAuthView("login");
    alert(`Registration completed! You're now registered as a ${userInfo.userType}. Please login with your credentials.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab("home");
  };

  // Navigation helpers for enhanced features
  const openProgressionSystem = () => {
    setProfileSection("progression");
    setActiveTab("profile");
  };

  const openQuestSystem = () => {
    setProfileSection("quests");
    setActiveTab("profile");
  };

  const openStreakSystem = () => {
    setProfileSection("streaks");
    setActiveTab("profile");
  };

  const openVirtualStore = () => {
    setProfileSection("store");
    setActiveTab("profile");
  };

  const openSocialFeatures = () => {
    setProfileSection("social");
    setActiveTab("profile");
  };

  const openQRScanner = () => {
    setShowQRScanner(true);
  };

  // Enhanced gamification handlers
  const handlePurchase = (itemId: string, cost: number) => {
    if (userPoints >= cost) {
      setUserPoints(prev => prev - cost);
      // Handle item unlock logic here
      console.log(`Purchased ${itemId} for ${cost} points`);
    }
  };

  const handleCompleteQuest = (questId: string) => {
    // Handle quest completion logic
    console.log(`Completed quest: ${questId}`);
    // Award points, update progress, etc.
  };

  const handlePurchaseShield = () => {
    const cost = 250;
    if (userPoints >= cost) {
      setUserPoints(prev => prev - cost);
      setStreakShields(prev => prev + 1);
    }
  };

  const handleGiveKudo = (userId: string, message: string) => {
    // Handle peer endorsement logic
    console.log(`Gave kudo to ${userId}: ${message}`);
  };

  const handleJoinTeam = (teamId: string) => {
    // Handle team joining logic
    console.log(`Joined team: ${teamId}`);
  };

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

  // Show authentication pages if not logged in
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

  // Show Teacher Dashboard for teachers
  if (currentUser?.userType === "teacher") {
    return (
      <TeacherDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // Show Admin Dashboard for admins (you can create this later)
  if (currentUser?.userType === "admin") {
    return (
      <TeacherDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // Main student app interface (only shown when logged in as student)
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