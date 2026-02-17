
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Leaf, ShieldCheck, TrendingUp, Zap, ChevronRight,
    Activity, Globe, Award, Smartphone,
    Sprout, Droplets, Sun, Wind, ArrowUpRight,
    ScanLine, BarChart3, Users, LucideIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// --- Components ---

const Navbar = () => (
    <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-xl border-b border-white/10"
    >
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <Leaf className="w-5 h-5" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">AgriYield<span className="text-emerald-500">.AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            {['Technology', 'Solutions', 'Impact', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-emerald-400 transition-colors">
                    {item}
                </a>
            ))}
        </div>
        <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-sm font-medium text-white hover:text-emerald-400 transition-colors">Sign In</Link>
            <Link to="/login">
                <Button className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                    Get Started
                </Button>
            </Link>
        </div>
    </motion.nav>
);

const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-[#020403]">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

            {/* Ambient Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10 px-6 pt-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-8 backdrop-blur-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    SYSTEM ONLINE_ v2.4
                </motion.div>

                <motion.h1
                    style={{ y: y1, opacity }}
                    className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6 leading-[0.9]"
                >
                    PRECISION <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-900">AGRICULTURE</span>
                </motion.h1>

                <motion.p
                    style={{ y: y1 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    The world's most advanced AI-powered farming companion. Detect diseases, predict yields, and connect to global markets instantly.
                </motion.p>

                <motion.div
                    style={{ y: y2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/login">
                        <Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-gray-200 font-semibold text-lg transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105">
                            Launch Dashboard
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4 px-6 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-black flex items-center justify-center text-[10px] text-white">
                                    <Users className="w-3 h-3" />
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-gray-300"><span className="text-white font-bold">50k+</span> Farmers Joined</span>
                    </div>
                </motion.div>
            </div>

            {/* 3D Floating Elements (Decorative) */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 left-[10%] w-64 h-64 border border-emerald-500/20 rounded-full flex items-center justify-center hidden lg:flex"
            >
                <div className="w-48 h-48 border border-emerald-500/10 rounded-full animate-pulse" />
            </motion.div>
        </div>
    );
};

const BentoGrid = () => (
    <section className="py-32 bg-[#020403] relative z-20">
        <div className="container mx-auto px-6">
            <div className="mb-20">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">INTELLIGENCE <br /><span className="text-emerald-500">GROWN LOCALLY.</span></h2>
                <div className="h-1 w-40 bg-emerald-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                {/* Large Card - Crop Diagnosis */}
                <motion.div
                    whileHover={{ scale: 0.98 }}
                    className="md:col-span-2 row-span-2 rounded-[2rem] bg-zinc-900/50 border border-white/10 overflow-hidden relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-black/80 z-0" />
                    <img src="https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=2696&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" alt="Plant analysis" />

                    <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                            <ScanLine className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">Neural-Agri™ CV</h3>
                        <p className="text-gray-400 text-lg max-w-md">Real-time pathogen diagnosis using edge computing. 99.8% accuracy on early-stage blight detection.</p>

                        {/* Overlay UI Mockup */}
                        <div className="absolute top-10 right-10 bg-black/60 backdrop-blur-md border border-emerald-500/30 p-4 rounded-xl">
                            <div className="flex items-center gap-3 text-emerald-400 text-sm font-mono mb-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                SCANNING...
                            </div>
                            <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ width: ["0%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Small Card 1 - Market */}
                <motion.div
                    whileHover={{ scale: 0.98 }}
                    className="rounded-[2rem] bg-zinc-900/50 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-transparent" />
                    <TrendingUp className="w-10 h-10 text-amber-500 mb-4" />
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Market Futures</h3>
                        <p className="text-sm text-gray-500">Predictive pricing models.</p>
                    </div>
                    {/* Graph Line */}
                    <svg className="absolute bottom-0 left-0 right-0 h-16 text-amber-500/20" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path d="M0 30 Q 20 10, 40 25 T 100 0 V 40 H 0 Z" fill="currentColor" />
                    </svg>
                </motion.div>

                {/* Small Card 2 - Community */}
                <motion.div
                    whileHover={{ scale: 0.98 }}
                    className="rounded-[2rem] bg-zinc-900/50 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent" />
                    <Globe className="w-10 h-10 text-purple-500 mb-4" />
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Global League</h3>
                        <p className="text-sm text-gray-500">Compete with top cultivators.</p>
                    </div>
                    <div className="absolute top-8 right-8 text-2xl font-bold text-white">#1</div>
                </motion.div>
            </div>
        </div>
    </section>
);

const FeatureShowcase = ({ icon: Icon, title, desc, index }: { icon: LucideIcon, title: string, desc: string, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="group relative p-1 pointer-events-none" // pointer-events-none to prevent hover issues on wrapper
        >
            <div className="pointer-events-auto relative h-full bg-black border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-emerald-500/50 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 mb-6 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all">
                        <Icon className="w-6 h-6 text-gray-300 group-hover:text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{desc}</p>
                </div>
            </div>
        </motion.div>
    );
}

const Features = () => {
    const list = [
        { icon: Smartphone, title: "Offline-First Mode", desc: "No internet? No problem. Core diagnostic models run directly on your device using WebAssembly." },
        { icon: ShieldCheck, title: "Smart Contracts", desc: "Automated insurance payouts triggered by satellite weather data, secured on the Polygon blockchain." },
        { icon: Droplets, title: "Precision Irrigation", desc: "IoT integration to optimize water usage based on soil moisture sensor arrays." },
        { icon: BarChart3, title: "Yield Analytics", desc: "Historical data comparison to forecast harvest volume and quality metrics." },
    ];

    return (
        <section className="py-24 bg-[#020403]">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {list.map((item, i) => (
                        <FeatureShowcase key={i} {...item} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StatsTicker = () => {
    return (
        <div className="border-y border-white/10 bg-white/[0.02] py-12 overflow-hidden">
            <div className="container mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
                {[
                    { label: "Acres Monitored", val: "1.2M+" },
                    { label: "Data Points", val: "500M+" },
                    { label: "Farmers Empowered", val: "50k+" },
                    { label: "Insects Identified", val: "20k+" },
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col">
                        <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">{stat.val}</span>
                        <span className="text-emerald-500 text-sm font-mono uppercase tracking-widest mt-2">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CTA = () => {
    return (
        <section className="relative py-32 bg-[#020403] overflow-hidden text-center">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-emerald-900/20 blur-[100px] rounded-full transform scale-150 opacity-20" />

            <div className="container relative z-10 px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter"
                >
                    READY TO <span className="text-emerald-500">GROW?</span>
                </motion.h2>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                    Join the thousands of farmers transforming their crop yields with AgriYield AI driven insights.
                </p>
                <Link to="/login">
                    <Button className="h-16 px-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold shadow-2xl shadow-emerald-500/20 hover:scale-105 transition-all">
                        Get Started Now <ArrowUpRight className="ml-2 w-6 h-6" />
                    </Button>
                </Link>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-black py-12 border-t border-white/10 text-gray-500 text-sm">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Leaf className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-lg">AgriYield AI</span>
                </div>
                <p className="max-w-xs leading-relaxed">
                    Empowering the next generation of agriculture with artificial intelligence and blockchain technology.
                </p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Platform</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-emerald-400">Crop Health</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Marketplace</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Insurance</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-emerald-400">About</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Careers</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Contact</a></li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center md:text-left">
            © 2024 FarmLens AI. All rights reserved.
        </div>
    </footer>
);

const Landing = () => {
    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-emerald-500/30">
            <Navbar />
            <Hero />
            <StatsTicker />
            <BentoGrid />
            <Features />
            <CTA />
            <Footer />
        </div>
    );
};

export default Landing;
