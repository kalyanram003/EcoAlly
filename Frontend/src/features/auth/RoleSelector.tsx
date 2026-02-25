import { useState } from "react";
import { User, GraduationCap, Leaf } from "lucide-react";
import { Button } from "../../components/ui/button";

interface RoleSelectorProps {
  onRoleSelect: (role: "student" | "teacher") => void;
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | null>(null);

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
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--stone-50)] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-8 left-8 w-32 h-32 border border-[var(--sage-300)] opacity-30 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-48 h-48 border border-[var(--sage-300)] opacity-20 pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="bg-[var(--forest-600)] rounded-full p-3">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          EcoAlly
        </span>
      </div>

      <div className="w-full max-w-2xl">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How do you want to join?
          </h1>
          <p className="text-[var(--text-secondary)]">
            Choose your role to get a personalized experience
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-8 rounded-2xl border-2 transition-all duration-200 
                ${
                  isSelected
                    ? "border-[var(--forest-600)] bg-[var(--forest-50)] shadow-md scale-[1.02]"
                    : "border-[var(--border-light)] hover:border-[var(--sage-300)] hover:shadow-sm"
                }`}
              >
                <div className="flex flex-col items-center text-center gap-5 py-4">
                  
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {role.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {role.description}
                    </p>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="w-6 h-6 bg-[var(--forest-600)] rounded-full flex items-center justify-center mt-2">
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
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
          className="w-full bg-[var(--forest-600)] hover:bg-[var(--forest-700)] text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue as{" "}
          {selectedRole
            ? roles.find((r) => r.id === selectedRole)?.title
            : "..."}
        </Button>
      </div>
    </div>
  );
}