import { Link } from 'react-router-dom';
import { Shield, Brain, Sparkles, Image as ImageIcon, ChevronRight, Lock, Fingerprint, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
    return (
        <div className="min-h-screen bg-vault-bg transition-colors duration-500 overflow-hidden">
            {/* Hero Section */}
            <section className="relative px-6 pt-24 md:pt-40 pb-32 md:pb-52 text-left max-w-7xl mx-auto">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-vault-accent/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
                
                <div className="relative z-10 max-w-4xl space-y-10 md:space-y-14">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-vault-accent/10 border border-vault-accent/20 text-vault-accent text-[11px] font-black uppercase tracking-[0.3em]"
                    >
                        <Sparkles size={16} /> Neural Observation 2.0
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-zinc-50"
                    >
                        Your memories, <br/>
                        <span className="premium-gradient-text italic">witnessed.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-600 dark:text-zinc-400 max-w-2xl font-medium leading-relaxed"
                    >
                        A high-fidelity sanctuary for your lived experiences. Private, secure, and entirely yours. 
                        Let the neural engine decode the patterns of your journey.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        <Link to="/login" className="btn-primary !px-10 !py-6 !text-lg !rounded-3xl shadow-2xl">
                            Initialize Your Vault <ArrowRight size={24} />
                        </Link>
                        <a href="#features" className="btn-secondary !px-10 !py-6 !text-lg !rounded-3xl">
                            Our Philosophy
                        </a>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-10 hidden lg:block opacity-40"
                >
                    <div className="glass-card !p-6 border-vault-accent/20 rotate-3">
                        <Lock size={32} className="text-vault-accent mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-vault-accent">Zero-Access Architecture</p>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section id="features" className="relative py-32 md:py-52 px-6 bg-slate-50/50 dark:bg-zinc-900/30 border-y border-vault-border">
                <div className="max-w-7xl mx-auto space-y-24">
                    <div className="text-center max-w-2xl mx-auto space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Beyond <span className="premium-gradient-text">Chronicling.</span></h2>
                        <p className="text-zinc-500 font-medium">We've reimagined the digital diary as a neural extension of your own mind.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Fingerprint size={32} className="text-vault-accent" />}
                            title="Biological Ownership"
                            description="Your memories are your biological property. We provide the infrastructure; you provide the soul."
                        />
                        <FeatureCard
                            icon={<Eye size={32} className="text-cyan-500" />}
                            title="The Neutral Observer"
                            description="AI without judgment. It mirrors your emotional state back to you, helping you see yourself clearly."
                        />
                        <FeatureCard
                            icon={<Sparkles size={32} className="text-orange-500" />}
                            title="Semantic Recall"
                            description="Query your past naturally. Ask about trends, feelings, or specific moments without complex searching."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 md:py-52 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="relative group overflow-hidden rounded-[3rem] md:rounded-[4rem] bg-zinc-900 dark:bg-zinc-100 p-12 md:p-24 text-zinc-50 dark:text-zinc-900 shadow-2xl">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-vault-accent/20 via-transparent to-transparent opacity-50 pointer-events-none" />
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <h3 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">Privacy is <br/> our <span className="text-vault-accent">Architecture.</span></h3>
                                <p className="text-lg md:text-xl opacity-70 font-medium leading-relaxed">
                                    No one sees your vault but you. Not even our engineers. Your data belongs to you—at rest, in transit, and forever.
                                </p>
                                <Link to="/login" className="btn-primary !bg-white dark:!bg-zinc-950 !text-zinc-950 dark:!text-white w-fit !px-12 !py-6 !rounded-3xl hover:scale-105">
                                    Get Your Key
                                </Link>
                            </div>
                            <div className="hidden md:flex justify-end">
                                <div className="w-64 h-64 rounded-full border border-vault-accent/30 flex items-center justify-center animate-pulse">
                                    <Shield size={100} className="text-vault-accent opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-vault-border text-center space-y-10">
                <div className="flex items-center justify-center gap-2">
                    <Sparkles size={18} className="text-vault-accent" />
                    <span className="text-lg font-black tracking-tighter premium-gradient-text">LifeVault</span>
                </div>
                <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">
                    Built for the human experience &bull; 2026
                </p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-card !bg-vault-card group border border-vault-border p-12 space-y-8 hover:border-vault-accent/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-vault-accent/5"
    >
        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
            {icon}
        </div>
        <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tight">{title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{description}</p>
        </div>
    </motion.div>
);

export default Landing;
