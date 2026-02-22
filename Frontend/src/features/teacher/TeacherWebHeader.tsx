import React, { useState } from "react";
import { Leaf, Bell, Menu, X, ChevronDown, Users, BarChart3, BookOpen, Trophy, FileText, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface TeacherWebHeaderProps {
    currentUser: any;
    activeSection: string;
    setActiveSection: (section: "overview" | "classes" | "students" | "challenges" | "materials" | "reports" | "settings") => void;
    selectedClass: string;
    setSelectedClass: (classId: string) => void;
    onLogout: () => void;
}

export const TeacherWebHeader: React.FC<TeacherWebHeaderProps> = ({
    currentUser,
    activeSection,
    setActiveSection,
    selectedClass,
    setSelectedClass,
    onLogout
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const getInitial = () => {
        if (currentUser?.firstName) return currentUser.firstName.charAt(0).toUpperCase();
        if (currentUser?.username) return currentUser.username.charAt(0).toUpperCase();
        return "T";
    };

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

    const currentClassObj = classes.find(c => c.id === selectedClass);

    return (
        <header
            className="bg-white border-b border-[var(--border)] shadow-[var(--shadow-xs)] sticky top-0 z-40"
            style={{ height: 'var(--header-height)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                {/* LEFT: Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setActiveSection("overview")}
                >
                    <div className="bg-[var(--forest-600)] rounded-full p-1 flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-gray-900 tracking-tight">EcoVibe Teacher</span>
                </div>

                {/* RIGHT: Class Selector, Bell, Avatar, Mobile Menu */}
                <div className="flex items-center gap-3">

                    <div className="hidden sm:flex items-center space-x-2 mr-2">
                        <span className="text-sm text-gray-600">Class:</span>
                        <div className="relative">
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="appearance-none bg-[var(--forest-50)] text-[var(--forest-700)] px-3 py-1.5 rounded-lg text-sm font-medium pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--forest-500)] border border-[var(--forest-100)]"
                            >
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name} ({cls.students})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--forest-600)] pointer-events-none" />
                        </div>
                    </div>

                    <button className="text-gray-400 hover:text-gray-700 relative mx-1">
                        <Bell className="w-5 h-5" />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    </button>

                    <button
                        onClick={() => setActiveSection("settings")}
                        className="hidden sm:flex w-8 h-8 rounded-full bg-[var(--forest-600)] text-white items-center justify-center text-sm font-bold shadow-sm hover:ring-2 hover:ring-[var(--forest-600)] hover:ring-offset-2 transition-all"
                    >
                        {getInitial()}
                    </button>

                    <button
                        onClick={() => setMobileNavOpen(prev => !prev)}
                        className="hidden md:flex lg:hidden p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="md:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tablet Dropdown Menu with AnimatePresence */}
            <AnimatePresence>
                {mobileNavOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden md:block lg:hidden fixed left-0 right-0 bg-white border-b border-[var(--border)] shadow-lg z-30 p-3"
                        style={{ top: 'var(--header-height)' }}
                    >
                        {menuItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveSection(item.id as any); setMobileNavOpen(false); }}
                                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-colors flex items-center gap-3 ${
                                        activeSection === item.id
                                            ? 'bg-[var(--forest-50)] text-[var(--forest-700)] font-semibold'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${activeSection === item.id ? 'text-[var(--forest-600)]' : 'text-gray-400'}`} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay with AnimatePresence */}
            <AnimatePresence>
                {showMenu && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-50 md:hidden"
                        onClick={() => setShowMenu(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-medium text-gray-900">Teacher Menu</h3>
                                <button onClick={() => setShowMenu(false)} className="text-gray-400 hover:text-gray-700">✕</button>
                            </div>

                            <div className="p-4 border-b border-gray-100">
                                <label className="block text-xs text-gray-500 mb-1">Select Class</label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full bg-[var(--forest-50)] text-[var(--forest-700)] p-2 rounded-lg text-sm font-medium border border-[var(--forest-100)]"
                                >
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-2 flex-1 overflow-y-auto">
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
                                            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors mb-1 ${isActive
                                                    ? "bg-[var(--forest-50)] text-[var(--forest-700)] font-semibold"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? "text-[var(--forest-600)]" : "text-gray-400"}`} />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-gray-100">
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm font-medium transition-colors"
                                >
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
