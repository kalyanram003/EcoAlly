import React from "react";
import { Users, BarChart3, BookOpen, Trophy, FileText, Settings, LogOut } from "lucide-react";

interface TeacherSidebarProps {
    activeSection: string;
    setActiveSection: (section: "overview" | "classes" | "students" | "challenges" | "materials" | "reports" | "settings") => void;
    currentUser?: any;
    onLogout?: () => void;
}

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({
    activeSection,
    setActiveSection,
    currentUser,
    onLogout,
}) => {
    const menuItems = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "classes", label: "Classes", icon: Users },
        { id: "students", label: "Students", icon: Users },
        { id: "challenges", label: "Challenges", icon: Trophy },
        { id: "materials", label: "Materials", icon: BookOpen },
        { id: "reports", label: "Reports", icon: FileText },
        { id: "settings", label: "Settings", icon: Settings }
    ];

    return (
        <div
            className="hidden lg:flex flex-col h-[calc(100vh-var(--header-height))] sticky bg-white border-r border-[var(--border)] overflow-y-auto sidebar-scroll"
            style={{ width: 'var(--sidebar-width)', top: 'var(--header-height)' }}
        >

            {/* NAV ITEMS */}
            <nav className="flex-1 px-2 py-4 space-y-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                    Dashboard Menu
                </div>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as any)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors ${activeSection === item.id
                                ? "bg-[var(--forest-50)] text-[var(--forest-700)] font-semibold border-l-2 border-[var(--forest-600)] pl-[10px]"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${activeSection === item.id ? "text-[var(--forest-600)]" : "text-gray-400"}`} />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* BOTTOM SECTION */}
            <div className="p-4 mt-auto border-t border-gray-100">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl mb-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--forest-600)] flex items-center justify-center text-white font-bold shrink-0">
                        {currentUser?.firstName?.charAt(0).toUpperCase() ?? currentUser?.username?.charAt(0).toUpperCase() ?? 'T'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-gray-900 truncate">Teacher Account</p>
                        <p className="text-xs text-gray-500 truncate">Admin Access</p>
                    </div>
                </div>

                {/* We rely on WebHeader to logout, but providing UI consistency with SidebarNav */}
                <button
                    className="flex items-center w-full gap-2 text-gray-500 hover:text-red-500 text-sm font-medium transition-colors mb-2 px-1"
                    onClick={() => onLogout?.()}
                >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};
