import { useState } from "react";
import { TeacherHeader } from "./TeacherHeader";
import { TeacherOverview } from "./TeacherOverview";
import { TeacherClassManagement } from "./TeacherClassManagement";
import { TeacherStudentProgress } from "./TeacherStudentProgress";
import { TeacherChallengeAssignment } from "./TeacherChallengeAssignment";
import { TeacherLearningMaterials } from "./TeacherLearningMaterials";
import { TeacherReports } from "./TeacherReports";
import { TeacherSettings } from "./TeacherSettings";

interface TeacherDashboardProps {
  currentUser: any;
  onLogout: () => void;
}

export function TeacherDashboard({ currentUser, onLogout }: TeacherDashboardProps) {
  const [activeSection, setActiveSection] = useState<"overview" | "classes" | "students" | "challenges" | "materials" | "reports" | "settings">("overview");
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
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col max-w-md mx-auto">
      <TeacherHeader 
        currentUser={currentUser}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
      />
      
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}