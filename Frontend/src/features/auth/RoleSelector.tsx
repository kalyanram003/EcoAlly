import { useState } from "react";
import { User, GraduationCap, Shield, Leaf } from "lucide-react";
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
    <div className="min-h-screen bg-[var(--stone-50)] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-8 left-8 w-32 h-32 border border-[var(--sage-300)] opacity-30 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-48 h-48 border border-[var(--sage-300)] opacity-20 pointer-events-none" />

      <div className="flex items-center gap-3 mb-10">
        <div className="bg-[var(--forest-600)] rounded-full p-2">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>EcoAlly</span>
      </div>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>How do you want to join?</h1>
          <p className="text-[var(--text-secondary)]">Choose your role to get a personalized experience</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-xl border-2 transition-all ${isSelected
                    ? "border-[var(--forest-600)] bg-[var(--forest-50)]"
                    : "border-[var(--border-light)] hover:border-[var(--sage-300)]"
                  }`}
              >
                <div className="flex flex-col items-center text-center gap-3 py-2">
                  <div className={`w-14 h-14 ${role.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base">{role.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{role.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 bg-[var(--forest-600)] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full bg-[var(--forest-600)] hover:bg-[var(--forest-700)] text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : "..."}
        </Button>
      </div>
    </div>
  );
}