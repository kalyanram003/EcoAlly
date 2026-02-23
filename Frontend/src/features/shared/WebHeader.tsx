import React, { useState } from "react";
import { Leaf, Flame, Coins, Bell, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface WebHeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    userPoints: number;
    currentStreak: number;
    onLogout: () => void;
    currentUser: any;
}

export const WebHeader: React.FC<WebHeaderProps> = ({
    activeTab,
    setActiveTab,
    userPoints,
    currentStreak,
    onLogout,
    currentUser,
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const getInitial = () => {
        if (currentUser?.firstName) return currentUser.firstName.charAt(0).toUpperCase();
        if (currentUser?.username) return currentUser.username.charAt(0).toUpperCase();
        return "U";
    };

    const navLinks = [
        { id: "home", label: "Home" },
        { id: "quiz", label: "Quizzes" },
        { id: "challenges", label: "Challenges" },
        { id: "ranking", label: "Leaderboard" },
        { id: "profile", label: "Profile" },
    ];

    return (
        <>
        <header
            className="bg-white border-b border-[var(--border)] shadow-[var(--shadow-xs)] sticky top-0 z-40"
            style={{ height: 'var(--header-height)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

                {/* LEFT: Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setActiveTab("home")}
                >
                    <div className="bg-[var(--forest-600)] rounded-full p-1 flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-gray-900 tracking-tight">EcoAlly</span>
                </div>

                {/* CENTER: Nav Links (lg+ only) */}
                <nav className="hidden lg:flex flex-1 justify-center space-x-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => setActiveTab(link.id)}
                            className={`text-sm h-14 border-b-2 px-1 transition-colors ${activeTab === link.id
                                    ? "border-[var(--forest-600)] text-[var(--forest-600)] font-semibold"
                                    : "border-transparent text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* Tablet hamburger — visible on md, hidden on lg+ */}
                <button
                    className="hidden md:flex lg:hidden p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(prev => !prev)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* RIGHT: Badges and Profile */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-orange-50 text-orange-500 rounded-full px-2.5 py-1 text-sm font-semibold">
                        <Flame className="w-4 h-4" />
                        <span>{currentStreak}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[var(--forest-50)] text-[var(--forest-600)] rounded-full px-2.5 py-1 text-sm font-semibold">
                        <Coins className="w-4 h-4" />
                        <span>{userPoints.toLocaleString()}</span>
                    </div>

                    <button className="text-gray-400 hover:text-gray-700 mx-1">
                        <Bell className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setActiveTab("profile")}
                        className="w-8 h-8 rounded-full bg-[var(--forest-600)] text-white flex items-center justify-center text-sm font-bold shadow-sm hover:ring-2 hover:ring-[var(--forest-600)] hover:ring-offset-2 transition-all"
                    >
                        {getInitial()}
                    </button>
                </div>
            </div>
        </header>

        <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden md:block lg:hidden fixed left-0 right-0 bg-white border-b border-[var(--border)] shadow-lg z-30 p-3"
                    style={{ top: 'var(--header-height)' }}
                >
                    {navLinks.map(link => (
                        <button
                            key={link.id}
                            onClick={() => { setActiveTab(link.id); setMobileMenuOpen(false); }}
                            className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-colors ${
                                activeTab === link.id
                                    ? 'bg-[var(--forest-50)] text-[var(--forest-700)] font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};
