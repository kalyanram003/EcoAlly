import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    Leaf,
    Play,
    ChevronDown,
    Trophy,
    Award,
    TrendingUp,
    Users,
    Zap,
    Globe,
    BookOpen,
    CheckCircle2,
    Menu,
    X,
    Mail
} from "lucide-react";

interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
}

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Navbar scroll transform
    const { scrollY } = useScroll();
    const navBg = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)']);
    const navShadow = useTransform(scrollY, [0, 80], ['0 0 0px transparent', '0 2px 20px rgba(0,0,0,0.06)']);

    // Hero parallax
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
            {/* 1. Sticky Navbar */}
            <motion.nav
                style={{ backgroundColor: navBg, boxShadow: navShadow }}
                className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-sm transition-colors"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="bg-[var(--forest-600)] rounded-full p-1.5 flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>EcoAlly</span>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-gray-600 hover:text-[var(--forest-600)] transition-colors">Features</button>
                        <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-gray-600 hover:text-[var(--forest-600)] transition-colors">How It Works</button>
                        <button onClick={() => scrollToSection('for-teachers')} className="text-sm font-medium text-gray-600 hover:text-[var(--forest-600)] transition-colors">For Teachers</button>
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={onLogin} className="text-sm font-medium text-gray-600 hover:text-[var(--forest-600)] transition-colors">
                            Sign In
                        </button>
                        <button onClick={onGetStarted} className="bg-[var(--forest-600)] text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-[var(--forest-700)] transition-colors">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden bg-white border-b border-gray-100 overflow-hidden shadow-lg"
                        >
                            <div className="flex flex-col p-4 space-y-4">
                                <button onClick={() => scrollToSection('features')} className="text-left text-gray-600 font-medium py-2 border-b border-gray-50">Features</button>
                                <button onClick={() => scrollToSection('how-it-works')} className="text-left text-gray-600 font-medium py-2 border-b border-gray-50">How It Works</button>
                                <button onClick={() => scrollToSection('for-teachers')} className="text-left text-gray-600 font-medium py-2 border-b border-gray-50">For Teachers</button>
                                <div className="flex flex-col gap-3 pt-2">
                                    <button onClick={onLogin} className="w-full py-2.5 text-center text-gray-600 font-medium border border-gray-200 rounded-full hover:bg-gray-50">Sign In</button>
                                    <button onClick={onGetStarted} className="w-full py-2.5 text-center bg-[var(--forest-600)] text-white font-medium rounded-full hover:bg-[var(--forest-700)]">Get Started</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* 2. Hero Section */}
            <section ref={heroRef} className="relative min-h-screen pt-24 pb-16 flex items-center bg-gradient-to-br from-[var(--stone-100)] via-[var(--sage-50)] to-[var(--forest-50)] overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-20 right-[-5%] w-96 h-96 bg-[var(--forest-100)] opacity-30 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute bottom-10 left-[-5%] w-80 h-80 bg-[var(--sage-100)] opacity-30 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--forest-600) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                {/* Geometric Frame Decorations */}
                <div className="absolute top-20 right-[5%] w-48 h-48 border border-[var(--sage-300)] rounded-none pointer-events-none opacity-30" />
                <div className="absolute top-24 right-[4%] w-48 h-48 border border-[var(--sage-300)] rounded-none pointer-events-none opacity-20" />

                <motion.div style={{ y: heroY }} className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">

                    {/* Left Side: Text */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center lg:items-start text-center lg:text-left pt-10"
                    >
                        <motion.div variants={fadeUp} className="bg-[var(--forest-50)] border border-[var(--sage-300)] rounded-full px-4 py-1.5 flex items-center gap-2 mb-8">
                            <Leaf className="w-4 h-4 text-[var(--forest-600)]" />
                            <span className="text-sm font-medium text-[var(--forest-700)]">Environmental Learning Platform</span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                            Learn. <span className="text-[var(--forest-600)] italic">Play.</span> <br />
                            <span className="text-[var(--forest-600)] italic">Save the Planet.</span>
                        </motion.h1>

                        <motion.p variants={fadeUp} className="text-lg text-gray-500 leading-relaxed mb-8 max-w-[480px]">
                            Join the gamified platform where discovering environmental science translates into real-world impact. Complete challenges, earn rewards, and grow your eco-knowledge.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[var(--forest-500)]" /> Earn Eco-Points</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[var(--forest-500)]" /> Unlock Badges</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[var(--forest-500)]" /> Track Progress</div>
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full lg:w-auto">
                            <button onClick={onGetStarted} className="group flex items-center justify-center gap-2 w-full sm:w-auto bg-[var(--forest-600)] text-white rounded-full px-7 py-3.5 font-semibold hover:bg-[var(--forest-700)] transition-all shadow-lg shadow-[var(--forest-600)]/20 hover:scale-[1.02]">
                                Start Learning Free
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </button>
                            <button className="flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-3.5 group rounded-full hover:bg-white/50 transition-colors text-gray-700 font-medium">
                                <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-[var(--forest-600)] group-hover:scale-110 transition-transform">
                                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                                </div>
                                Watch Demo
                            </button>
                        </motion.div>

                    </motion.div>

                    {/* Right Side: Visual Components */}
                    <div className="hidden md:flex relative h-[520px] lg:h-[600px] items-center justify-center perspective-1000">
                        {/* Main Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 60, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="w-[420px] bg-white rounded-3xl shadow-2xl border border-[var(--border-light)] overflow-hidden relative z-10"
                        >
                            {/* Card Top */}
                            <div className="bg-gradient-to-br from-[var(--forest-600)] to-[var(--forest-700)] p-6 pt-8 pb-10 text-white relative flex flex-col items-center">
                                <div className="absolute inset-0 bg-white/5" />
                                <div className="w-full flex justify-between items-center mb-6 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-lg font-bold">AL</div>
                                        <div>
                                            <div className="text-sm text-white/80 font-medium">Welcome back,</div>
                                            <div className="font-bold text-lg leading-tight">Kalyan</div>
                                        </div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Level 12
                                    </div>
                                </div>

                                {/* XP Progress Bar */}
                                <div className="w-full relative z-10 relative mb-4">
                                    <div className="flex justify-between text-xs font-medium mb-1.5 opacity-90">
                                        <span>1,420 XP</span>
                                        <span>2,000 XP</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "71%" }}
                                            transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                                            className="h-full bg-white rounded-full relative"
                                        >
                                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/50 blur-sm" />
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="flex gap-2 text-2xl relative z-10">
                                    <span>🌲</span><span>🌿</span><span>🪴</span><span>🌻</span><span>🌵</span>
                                </div>
                            </div>

                            {/* Card Bottom */}
                            <div className="p-6 bg-white flex flex-col gap-4">
                                <div className="bg-[var(--forest-50)] rounded-2xl p-4 border border-[var(--sage-300)] shadow-sm flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm mb-1">Recycling Master ✓</h4>
                                        <span className="text-xs font-semibold text-[var(--forest-600)] bg-[var(--forest-100)] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                            <Trophy className="w-3 h-3" /> +150 Points
                                        </span>
                                    </div>
                                    <button className="text-sm font-semibold text-[var(--forest-600)] hover:text-[var(--forest-700)] transition-colors">
                                        Upload Proof →
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-[var(--sage-50)] p-3 rounded-xl border border-[var(--border-light)] text-center">
                                        <div className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider mb-1">Points</div>
                                        <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                                            <span className="text-[var(--forest-500)]">❖</span> 1.4k
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Streak</div>
                                        <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                                            <span className="text-orange-500">🔥</span> 14
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Rank</div>
                                        <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                                            <span className="text-amber-500">🏆</span> #42
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Badge 1 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="absolute top-16 left-[-20px] lg:left-[-60px] z-20"
                        >
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                className="bg-white rounded-2xl shadow-xl border border-[var(--border-light)] p-3 flex items-center gap-3 pr-5"
                            >
                                <div className="bg-[var(--moss-100)] p-2 rounded-xl text-xl">�</div>
                                <div>
                                    <div className="font-bold text-sm text-gray-900">+50 Eco-Points</div>
                                    <div className="text-xs text-gray-500">Quiz completed</div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Floating Badge 2 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.3, duration: 0.5 }}
                            className="absolute bottom-24 right-[-10px] lg:right-[-40px] z-20"
                        >
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
                                className="bg-white rounded-2xl shadow-xl border border-[var(--border-light)] p-3 flex items-center gap-3 pr-5"
                            >
                                <div className="bg-[var(--stone-100)] p-2 rounded-xl text-xl">🔥</div>
                                <div>
                                    <div className="font-bold text-sm text-gray-900">14-day streak!</div>
                                    <div className="text-xs text-gray-500">Keep it up!</div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block text-[var(--forest-600)]/50">
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                        <ChevronDown className="w-8 h-8" />
                    </motion.div>
                </div>
            </section>

            {/* 3. Features Section */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={fadeUp}
                        className="text-center mb-16"
                    >
                        <span className="text-[var(--forest-600)] uppercase tracking-widest text-sm font-bold block mb-3">Features</span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
                            Everything you need to <span className="text-[var(--forest-600)] italic">go green and grow</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {[
                            { icon: Trophy, color: 'text-[var(--moss-500)]', bg: 'bg-[var(--moss-100)]', title: 'Earn Eco-Points', desc: 'Complete challenges, quizzes, and real-world eco-actions to climb the rankings.' },
                            { icon: Award, color: 'text-[var(--stone-400)]', bg: 'bg-[var(--stone-100)]', title: 'Unlock Badges', desc: 'Collect achievement badges as you master environmental topics and milestones.' },
                            { icon: TrendingUp, color: 'text-[var(--forest-600)]', bg: 'bg-[var(--forest-50)]', title: 'Track Progress', desc: 'Visualize your learning with analytics, streak counters, and weekly reports.' },
                            { icon: Users, color: 'text-[var(--sage-600)]', bg: 'bg-[var(--sage-100)]', title: 'Compete Together', desc: 'Join leaderboards, team up with friends, and enter global eco-tournaments.' },
                            { icon: Zap, color: 'text-[var(--moss-500)]', bg: 'bg-[var(--moss-100)]', title: 'Daily Quests', desc: 'Fresh challenges daily. Complete streaks to earn bonus rewards and special badges.' },
                            { icon: Globe, color: 'text-[var(--stone-400)]', bg: 'bg-[var(--stone-100)]', title: 'Real-World Impact', desc: 'Upload proof of eco-actions to earn points and inspire your community.' },
                        ].map((ft, i) => (
                            <motion.div key={i} variants={fadeUp} className="group bg-white border border-[var(--border-light)] rounded-2xl p-6 hover:shadow-lg hover:border-[var(--sage-300)] transition-all duration-300">
                                <div className={`w-12 h-12 rounded-xl ${ft.bg} ${ft.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                    <ft.icon className="w-6 h-6" strokeWidth={2} />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-2">{ft.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{ft.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 4. How It Works Section */}
            <section id="how-it-works" className="py-24 bg-gradient-to-br from-[var(--stone-50)] to-[var(--sage-50)] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={fadeUp}
                        className="text-center mb-16"
                    >
                        <span className="text-[var(--forest-600)] uppercase tracking-widest text-sm font-bold block mb-3">How It Works</span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>Start your eco-journey in 3 steps</h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
                    >
                        {/* Connection Lines for Desktop */}
                        <div className="hidden md:block absolute top-[4.5rem] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[var(--sage-300)] via-[var(--sage-300)] to-[var(--sage-300)] opacity-50 z-0 border-dashed border-t-2 border-[var(--sage-300)]/40" />

                        {[
                            { num: '01', icon: Users, title: 'Choose Your Role', desc: 'Join as a student, teacher, or admin. Each role has its own tailored dashboard.' },
                            { num: '02', icon: BookOpen, title: 'Learn & Play', desc: 'Dive into interactive quizzes, video lessons, and gamified eco-challenges.' },
                            { num: '03', icon: Leaf, title: 'Take Real Action', desc: 'Document eco-challenges, upload proof, earn points, and grow your impact.' },
                        ].map((step, i) => (
                            <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[var(--sage-300)] relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 bg-[var(--forest-600)] rounded-2xl shadow-lg shadow-[var(--forest-600)]/20 flex items-center justify-center text-white mb-6">
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <div className="text-[var(--forest-400)] text-xs font-bold tracking-widest mb-2">{step.num}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 5. For Teachers */}
            <section id="for-teachers" className="py-24 bg-gray-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
                        {/* Left Side: Content */}
                        <motion.div
                            initial={{ x: -60, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <span className="text-[var(--forest-400)] uppercase tracking-widest text-sm font-bold block mb-4">For Teachers</span>
                            <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Empower your <span className="text-[var(--forest-400)] italic">classroom</span></h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Transform environmental education with powerful tools to monitor, engage, and reward your students interactively.
                            </p>

                            <ul className="space-y-4 mb-10">
                                {[
                                    "Create and assign custom quizzes and challenges",
                                    "Review & approve student eco-action submissions",
                                    "Real-time progress tracking for every student",
                                    "Class leaderboards and tournament management"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                                        <span className="text-gray-300 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={onGetStarted} className="bg-[var(--forest-500)] text-white rounded-full px-8 py-3.5 font-semibold hover:bg-[var(--forest-400)] transition-colors text-center shadow-lg shadow-[var(--forest-500)]/20">
                                    Join as Teacher
                                </button>
                                <button className="border border-white/20 text-white rounded-full px-8 py-3.5 font-semibold hover:bg-white/10 transition-colors text-center">
                                    Learn More
                                </button>
                            </div>
                        </motion.div>

                        {/* Right Side: Mock Dashboard */}
                        <motion.div
                            initial={{ x: 60, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
                        >
                            {/* Fake header */}
                            <div className="bg-gray-800/80 border-b border-gray-700 p-4 flex justify-between items-center backdrop-blur">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[var(--forest-500)] w-8 h-8 rounded shrink-0" />
                                    <div className="font-bold text-sm tracking-wide">Classroom Dashboard</div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="relative">
                                        <div className="w-2 h-2 rounded-full bg-red-500 absolute -top-1 -right-1" />
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Fake content */}
                            <div className="p-6 pb-8">
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
                                        <div className="text-gray-400 text-xs mb-1 font-medium">Students</div>
                                        <div className="text-2xl font-bold">28</div>
                                    </div>
                                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
                                        <div className="text-gray-400 text-xs mb-1 font-medium">Reviews</div>
                                        <div className="text-2xl font-bold text-amber-400">5</div>
                                    </div>
                                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
                                        <div className="text-gray-400 text-xs mb-1 font-medium">Class Avg</div>
                                        <div className="text-2xl font-bold text-[var(--forest-400)]">78%</div>
                                    </div>
                                </div>

                                <div className="mb-6 h-[80px] flex items-end justify-between px-2 gap-2 opacity-60">
                                    <div className="w-full bg-[var(--forest-500)]/80 rounded-t-sm h-[30%]" />
                                    <div className="w-full bg-[var(--forest-500)]/80 rounded-t-sm h-[60%]" />
                                    <div className="w-full bg-[var(--forest-500)]/80 rounded-t-sm h-[45%]" />
                                    <div className="w-full bg-[var(--forest-500)]/80 rounded-t-sm h-[80%]" />
                                    <div className="w-full bg-[var(--forest-500)]/80 rounded-t-sm h-[50%]" />
                                    <div className="w-full bg-[var(--forest-500)]/80 rounded-t-sm h-[90%]" />
                                    <div className="w-full bg-[var(--forest-500)]/80 rounded-t-sm h-[75%]" />
                                </div>

                                <div>
                                    <h4 className="text-xs tracking-wider text-gray-500 font-bold uppercase mb-4">Recent Submissions</h4>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Sarah M.', task: 'Compost Setup', status: 'PENDING', bg: 'bg-[var(--forest-400)]/10 text-[var(--forest-400)] border-[var(--forest-400)]/20' },
                                            { name: 'James K.', task: 'Recycle Sort', status: 'APPROVED', bg: 'bg-[var(--forest-500)]/10 text-[var(--forest-500)] border-[var(--forest-500)]/20' },
                                            { name: 'Priya R.', task: 'Energy Audit', status: 'APPROVED', bg: 'bg-[var(--forest-500)]/10 text-[var(--forest-500)] border-[var(--forest-500)]/20' }
                                        ].map((sub, i) => (
                                            <div key={i} className="bg-gray-900 p-3 rounded-xl border border-gray-700 flex justify-between items-center">
                                                <div>
                                                    <div className="text-sm font-bold text-white mb-0.5">{sub.name}</div>
                                                    <div className="text-xs text-gray-400">{sub.task}</div>
                                                </div>
                                                <div className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${sub.bg}`}>
                                                    {sub.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 6. CTA Banner */}
            <section className="py-20 relative overflow-hidden bg-gradient-to-r from-[var(--forest-700)] to-[var(--forest-600)]">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-white/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={fadeUp}
                    >
                        <h2 className="text-white text-4xl sm:text-5xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Ready to start your eco-journey?</h2>
                        <p className="text-[var(--forest-100)] text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
                            Join 50,000+ students making a real difference. Learn, play, and protect the planet today.
                        </p>
                        <button onClick={onGetStarted} className="bg-white text-[var(--forest-600)] font-bold rounded-full px-10 py-4 text-lg hover:shadow-xl hover:scale-105 transition-all shadow-lg active:scale-95">
                            Get Started Free →
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* 7. Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-[var(--forest-600)] rounded-full p-1.5 flex items-center justify-center">
                                    <Leaf className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>EcoAlly</span>
                            </div>
                            <p className="text-gray-400 text-sm max-w-sm">
                                The gamified environmental science learning platform that turns education into impactful real-world actions.
                            </p>
                        </div>

                        <div className="lg:col-span-1 border-gray-800">
                            <h4 className="font-semibold text-lg mb-4">Platform</h4>
                            <ul className="space-y-3">
                                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors text-sm">Features</button></li>
                                <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-white transition-colors text-sm">How it Works</button></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a></li>
                            </ul>
                        </div>

                        <div className="lg:col-span-1">
                            <h4 className="font-semibold text-lg mb-4">Learn</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Student Guide</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Teacher Guide</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Admin Guide</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">API Docs</a></li>
                            </ul>
                        </div>

                        <div className="lg:col-span-1">
                            <h4 className="font-semibold text-lg mb-4">Company</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Press</a></li>
                            </ul>
                        </div>

                        <div className="lg:col-span-1">
                            <h4 className="font-semibold text-lg mb-4">Legal</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            © 2026 EcoAlly. Making the planet greener, one student at a time.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
