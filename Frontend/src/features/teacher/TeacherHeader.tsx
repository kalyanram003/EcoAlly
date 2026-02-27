import { useState } from "react";
import { Bell, Search, Menu, ChevronDown, Users, BarChart3, BookOpen, Trophy, FileText, Settings } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";

interface TeacherHeaderProps {
  currentUser: any;
  activeSection: string;
  setActiveSection: (section: "overview" | "classes" | "students" | "challenges" | "materials" | "reports" | "settings" | "reviews") => void;
  selectedClass: string;
  setSelectedClass: (classId: string) => void;
}

export function TeacherHeader({
  currentUser,
  activeSection,
  setActiveSection,
  selectedClass,
  setSelectedClass
}: TeacherHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const classes = [
    { id: "class-10a", name: "Grade 10-A", students: 28 },
    { id: "class-10b", name: "Grade 10-B", students: 25 },
    { id: "class-9a", name: "Grade 9-A", students: 30 },
    { id: "class-9b", name: "Grade 9-B", students: 27 }
  ];

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "classes", label: "Classes", icon: Users },
    { id: "students", label: "Students", icon: Users },
    { id: "challenges", label: "Challenges", icon: Trophy },
    { id: "materials", label: "Materials", icon: BookOpen },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const currentClass = classes.find(c => c.id === selectedClass);

  return (
    <div className="bg-white shadow-sm border-b border-gray-100">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#2ECC71] rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🌱</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">EcoAlly Teacher</h1>
            <p className="text-sm text-gray-500">Welcome, {currentUser.firstName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">3</span>
            </div>
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Class Selector */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Current Class:</span>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="appearance-none bg-[#2ECC71] text-white px-3 py-1 rounded-lg text-sm pr-8 cursor-pointer"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.students} students)
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white pointer-events-none" />
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">Today</div>
            <div className="text-sm font-medium text-gray-900">
              {currentClass?.students || 0} Students
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="flex overflow-x-auto px-2 py-2 space-x-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${isActive
                    ? "bg-[#2ECC71] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Teacher Menu</h3>
            </div>
            <div className="p-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id as any);
                      setShowMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${isActive
                        ? "bg-[#2ECC71] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}