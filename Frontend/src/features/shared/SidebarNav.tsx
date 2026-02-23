import React from "react";
import {
    Home,
    Brain,
    Target,
    Trophy,
    User,
    Map,
    LogOut,
    Coins,
    Flame
} from "lucide-react";

interface SidebarNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    userPoints: number;
    currentStreak: number;
    onLogout: () => void;
    currentUser: any;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
    activeTab,
    setActiveTab,
    userPoints,
    currentStreak,
    onLogout,
    currentUser,
}) => {
    const getInitial = () => {
        if (currentUser?.firstName) return currentUser.firstName.charAt(0).toUpperCase();
        if (currentUser?.username) return currentUser.username.charAt(0).toUpperCase();
        return 'U';
    };

    const displayName = currentUser?.firstName
        ? `${currentUser.firstName} ${currentUser.lastName ?? ''}`.trim()
        : (currentUser?.username ?? 'Student');

    const navItems = [
        { id: "home", label: "Home", icon: Home },
        { id: "quiz", label: "Quizzes", icon: Brain },
        { id: "challenges", label: "Challenges", icon: Target },
        { id: "ecomap", label: "EcoMap", icon: Map },
        { id: "ranking", label: "Leaderboard", icon: Trophy },
        { id: "profile", label: "Profile", icon: User },
    ];

    return (
        <div
            className="hidden lg:flex flex-col h-[calc(100vh-var(--header-height))] sticky bg-white border-r border-[var(--border)] overflow-y-auto sidebar-scroll"
            style={{ width: 'var(--sidebar-width)', top: 'var(--header-height)' }}
        >

            {/* TOP SECTION: User Mini-Card */}
            <div className="p-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[var(--forest-600)] flex justify-center items-center text-white text-2xl font-bold mb-3 shadow-md ring-4 ring-[var(--forest-100)]">
                    {getInitial()}
                </div>
                <div className="font-bold text-gray-900 leading-tight text-center">{displayName}</div>
                <div className="text-xs font-semibold text-[var(--forest-600)] bg-[var(--forest-50)] px-2 py-0.5 rounded-full mt-1">Level 12</div>

                <div className="w-full space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Coins className="w-4 h-4 text-[var(--forest-500)]" />
                        <span>{userPoints.toLocaleString()} pts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>{currentStreak} day streak</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 my-2 mx-4" />

            {/* NAV ITEMS */}
            <nav className="flex-1 px-2 py-2 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 py-2.5 pr-3 rounded-xl text-sm font-medium cursor-pointer transition-colors ${activeTab === item.id
                                ? "bg-[var(--forest-50)] text-[var(--forest-700)] font-semibold border-l-2 border-[var(--forest-600)] pl-[10px]"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 pl-3"
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? "text-[var(--forest-600)]" : "text-gray-400"}`} />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* BOTTOM SECTION */}
            <div className="p-4 mt-auto border-t border-gray-100">
                <button
                    onClick={onLogout}
                    className="flex items-center w-full gap-2 text-gray-500 hover:text-red-500 text-sm font-medium transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};
