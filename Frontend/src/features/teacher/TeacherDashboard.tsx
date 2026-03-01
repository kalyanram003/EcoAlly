import { useState } from "react";
import { TeacherWebHeader } from "./TeacherWebHeader";
import { TeacherSidebar } from "./TeacherSidebar";
import { TeacherOverview } from "./TeacherOverview";
import { TeacherClassManagement } from "./TeacherClassManagement";
import { TeacherStudentProgress } from "./TeacherStudentProgress";
import { TeacherChallengeAssignment } from "./TeacherChallengeAssignment";
import { TeacherLearningMaterials } from "./TeacherLearningMaterials";
import { TeacherReports } from "./TeacherReports";
import { TeacherSettings } from "./TeacherSettings";
import { TeacherSubmissionReview } from "./TeacherSubmissionReview";
import { TeacherQuizManagement } from "./TeacherQuizManagement";

interface TeacherDashboardProps {
  currentUser: any;
  onLogout: () => void;
}

export function TeacherDashboard({ currentUser, onLogout }: TeacherDashboardProps) {
  const [activeSection, setActiveSection] = useState<"overview" | "classes" | "students" | "challenges" | "materials" | "reports" | "settings" | "reviews" | "quizzes">("overview");
  const [selectedClass, setSelectedClass] = useState<string>("class-10a");

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <TeacherOverview
            currentUser={currentUser}
            selectedClass={selectedClass}
            onSectionChange={setActiveSection}
          />
        );
      case "classes":
        return (
          <TeacherClassManagement
            currentUser={currentUser}
            selectedClass={selectedClass}
            onClassChange={setSelectedClass}
          />
        );
      case "students":
        return (
          <TeacherStudentProgress
            currentUser={currentUser}
            selectedClass={selectedClass}
          />
        );
      case "challenges":
        return (
          <TeacherChallengeAssignment
            currentUser={currentUser}
            selectedClass={selectedClass}
          />
        );
      case "materials":
        return (
          <TeacherLearningMaterials
            currentUser={currentUser}
            selectedClass={selectedClass}
          />
        );
      case "reports":
        return (
          <TeacherReports
            currentUser={currentUser}
            selectedClass={selectedClass}
          />
        );
      case "settings":
        return (
          <TeacherSettings
            currentUser={currentUser}
            onLogout={onLogout}
          />
        );
      case "reviews":
        return <TeacherSubmissionReview />;
      case "quizzes":
        return (
          <TeacherQuizManagement
            currentUser={currentUser}
            selectedClass={selectedClass}
          />
        );
      default:
        return (
          <TeacherOverview
            currentUser={currentUser}
            selectedClass={selectedClass}
            onSectionChange={setActiveSection}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col">
      <TeacherWebHeader
        currentUser={currentUser}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        onLogout={onLogout}
      />
      <div className="flex flex-1 overflow-hidden">
        <TeacherSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          currentUser={currentUser}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}