import { Link } from 'react-router-dom';
import { Shield, Brain, Sparkles, Image as ImageIcon, ChevronRight, Lock, Fingerprint, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500 overflow-hidden">
            {/* Hero Section */}
            <section className="relative px-6 pt-32 pb-40 text-center max-w-7xl mx-auto">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-10 dark:opacity-20 pointer-events-none">
                    <img src="/hero.png" alt="Hero Background" className="w-full h-full object-cover blur-3xl scale-150" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-vault-accent/5 dark:bg-vault-accent/10 border border-vault-accent/20 text-vault-accent text-sm font-black uppercase tracking-widest animate-pulse">
                        <Sparkles size={16} /> Neural Observation 2.0
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-[0.95] max-w-5xl mx-auto">
                        Your memories, <span className="text-vault-accent italic">witnessed</span> by AI.
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        A sanctuary for your lived experiences. Private, secure, and entirely yours. Let the neural engine detect the patterns you might miss.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
                        <Link to="/login" className="btn-primary px-10 py-5 text-xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-vault-accent/40 rounded-[2rem] hover:scale-105 active:scale-95 transition-all">
                            Initialize Your Vault <ChevronRight size={24} />
                        </Link>
                        <a href="#philosophy" className="px-10 py-5 rounded-[2rem] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
                            Our Philosophy
                        </a>
                    </div>
                </motion.div>

                {/* Floating UI Elements */}
                <div className="absolute top-1/4 left-10 md:left-20 hidden lg:block opacity-20 dark:opacity-40 animate-bounce transition-duration-[4s]">
                    <div className="glass-card !p-4 border-emerald-500/20">
                        <div className="flex items-center gap-3">
                            <Lock size={20} className="text-emerald-500" />
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Zero-Access</span>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-1/4 right-10 md:right-20 hidden lg:block opacity-20 dark:opacity-40 animate-float transition-duration-[5s]">
                    <div className="glass-card !p-4 border-vault-accent/20">
                        <div className="flex items-center gap-3">
                            <Brain size={20} className="text-vault-accent" />
                            <span className="text-xs font-black uppercase tracking-widest text-vault-accent">Pattern Pulse</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="philosophy" className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<Fingerprint size={32} className="text-vault-accent" />}
                            title="Biological Ownership"
                            description="Your memories are your biological property. We provide the infrastructure; you provide the soul."
                        />
                        <FeatureCard
                            icon={<Eye size={32} className="text-emerald-500" />}
                            title="The Neutral Observer"
                            description="AI without advice. It mirrors your emotional state back to you, helping you see yourself from the outside."
                        />
                        <FeatureCard
                            icon={<Sparkles size={32} className="text-fuchsia-500" />}
                            title="Semantic Recall"
                            description="Query your past naturally. Ask about trends, feelings, or specific moments without complex searching."
                        />
                    </div>

                    <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-10 p-12 rounded-[3.5rem] bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-vault-accent opacity-20 blur-[120px] pointer-events-none" />
                        <div className="relative z-10 max-w-xl">
                            <h3 className="text-4xl font-black tracking-tight mb-4">Privacy is Architectural.</h3>
                            <p className="text-lg opacity-70 font-medium">No one sees your vault but you. Not even our engineers. Your data belongs to you—export it anytime.</p>
                        </div>
                        <Link to="/login" className="relative z-10 px-8 py-4 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
                            Get Your Key
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-zinc-100 dark:border-zinc-800 text-center space-y-6">
                <div className="flex justify-center gap-4">
                    <div className="w-12 h-1 bg-vault-accent rounded-full opacity-30" />
                </div>
                <p className="text-zinc-400 dark:text-zinc-500 text-xs font-black uppercase tracking-[0.4em]">
                    LifeVault AI &bull; Built for people &bull; 2026
                </p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-card border border-zinc-100 dark:border-zinc-800 p-12 flex flex-col items-start gap-8 hover:shadow-2xl transition-all duration-500"
    >
        <div className="p-5 bg-zinc-50 dark:bg-zinc-900 rounded-3xl shadow-inner">
            {icon}
        </div>
        <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{description}</p>
        </div>
    </motion.div>
);

export default Landing;
