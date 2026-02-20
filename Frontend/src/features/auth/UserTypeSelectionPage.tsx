import { useState } from "react";
import { ArrowLeft, ArrowRight, GraduationCap, Users, BookOpen, User, Shield, Target } from "lucide-react";
import { Button } from "../../components/ui/button";

type UserType = "student" | "teacher" | "admin";

interface UserTypeSelectionProps {
  onComplete: (userType: UserType) => void;
  onBack: () => void;
}

export function UserTypeSelectionPage({ onComplete, onBack }: UserTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const userTypes = [
    {
      id: "student" as UserType,
      title: "Student",
      icon: GraduationCap,
      description: "I'm here to learn and participate in eco-activities",
      features: [
        "Access learning modules and quizzes",
        "Participate in challenges and games",
        "Track progress and earn badges",
        "Join class discussions",
        "Complete assignments"
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      selectedBorder: "border-blue-500"
    },
    {
      id: "teacher" as UserType,
      title: "Teacher",
      icon: BookOpen,
      description: "I want to create and manage educational content",
      features: [
        "Create and assign learning content",
        "Monitor student progress",
        "Manage classroom activities",
        "Grade assignments and quizzes",
        "Generate progress reports"
      ],
      color: "from-[#2ECC71] to-[#27AE60]",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      selectedBorder: "border-[#2ECC71]"
    },
    {
      id: "admin" as UserType,
      title: "School Admin",
      icon: Shield,
      description: "I need to oversee school-wide eco initiatives",
      features: [
        "Manage multiple classrooms",
        "Oversee school eco programs",
        "View comprehensive analytics",
        "Manage teacher and student accounts",
        "Configure school-wide settings"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      selectedBorder: "border-purple-500"
    }
  ];

  const handleContinue = () => {
    if (selectedType) {
      onComplete(selectedType);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2ECC71] via-[#27AE60] to-[#1E8449] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Information
          </button>
          
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl">👥</span>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Choose Your Role</h1>
          <p className="text-white/80">Select how you'll be using EcoAlly</p>
        </div>

        {/* User Type Cards */}
        <div className="space-y-4 mb-6">
          {userTypes.map((type) => {
            const IconComponent = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  isSelected 
                    ? `${type.selectedBorder} border-2 shadow-xl` 
                    : `${type.borderColor} border hover:border-gray-300`
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${type.color} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{type.title}</h3>
                      {isSelected && (
                        <div className="w-6 h-6 bg-[#2ECC71] rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{type.description}</p>
                    
                    {/* Features List */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">What you can do:</p>
                      <ul className="space-y-1">
                        {type.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-[#2ECC71] rounded-full mr-2 flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <Button
            onClick={handleContinue}
            disabled={!selectedType}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              selectedType
                ? "bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {selectedType ? `Continue as ${userTypes.find(t => t.id === selectedType)?.title}` : "Select a role to continue"}
            {selectedType && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Info Message */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">💡 Choose Wisely</h3>
              <p className="text-sm text-white/90">
                Your role determines what features and content you'll have access to. You can contact your school administrator to change your role later if needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}