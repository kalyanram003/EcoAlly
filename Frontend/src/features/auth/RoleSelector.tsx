import { useState } from "react";
import { User, GraduationCap, Shield } from "lucide-react";
import { Button } from "../../components/ui/button";

interface RoleSelectorProps {
  onRoleSelect: (role: "student" | "teacher" | "admin") => void;
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | "admin" | null>(null);

  const roles = [
    {
      id: "student" as const,
      title: "Student",
      description: "I'm here to learn and grow",
      icon: User,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      id: "teacher" as const,
      title: "Teacher",
      description: "I want to guide and educate",
      icon: GraduationCap,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    },
    {
      id: "admin" as const,
      title: "Admin",
      description: "I manage the institution",
      icon: Shield,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600"
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2ECC71] via-[#27AE60] to-[#1E8449] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">EcoAlly</h1>
          <p className="text-white/80 text-lg">How do you want to join us?</p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Select Your Role</h2>
          
          <div className="space-y-4 mb-6">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? `border-[#2ECC71] bg-[#2ECC71]/5`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{role.title}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-[#2ECC71] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : "..."}
          </Button>
        </div>
      </div>
    </div>
  );
}