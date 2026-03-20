import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, ChevronRight, UserPlus, LogIn, ShieldCheck } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                const res = await authAPI.login({ email, password });
                localStorage.setItem('token', res.data.access_token);
                navigate('/timeline');
            } else {
                await authAPI.register({ email, password });
                toast.success("Identity generated. Initialize access.");
                setIsLogin(true);
            }
        } catch (err) {
            console.error(err);
            toast.error("Authentication failed. Neural link rejected.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-1000 overflow-hidden relative">
            {/* Immersive background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-vault-accent/10 blur-[150px] rounded-full animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-500/5 blur-[120px] rounded-full animate-float transition-delay-[3s]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="glass-card !p-12 md:!p-16 shadow-2xl border-white/40 dark:border-zinc-800 shadow-vault-accent/5">
                    <div className="text-center mb-16 space-y-6">
                        <div className="inline-flex items-center justify-center p-6 bg-vault-accent rounded-[2.5rem] shadow-2xl shadow-vault-accent/30 text-zinc-950 mb-4 hover:scale-110 transition-transform duration-500">
                            <ShieldCheck size={48} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">LifeVault <span className="text-vault-accent">AI</span></h1>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium italic">
                                {isLogin ? 'Initialize your neural synchronization.' : 'Configure your secure vault interface.'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 ml-1">Identity Access</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-vault-accent transition-all duration-300" size={22} />
                                <input
                                    type="email"
                                    className="input-field !pl-14 !py-5 !text-lg bg-zinc-50/50 dark:bg-zinc-900/40 focus:bg-white dark:focus:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
                                    placeholder="your@neural.id"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 ml-1">Vault Master Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-vault-accent transition-all duration-300" size={22} />
                                <input
                                    type="password"
                                    className="input-field !pl-14 !py-5 !text-lg bg-zinc-50/50 dark:bg-zinc-900/40 focus:bg-white dark:focus:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="btn-primary w-full py-6 text-xl font-black mt-6 disabled:opacity-50 transition-all rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(251,191,36,0.3)] flex items-center justify-center gap-4 active:scale-95 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            {loading ? (
                                <><div className="w-6 h-6 border-4 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" /> Synchronizing...</>
                            ) : (
                                <>{isLogin ? <LogIn size={24} /> : <UserPlus size={24} />} {isLogin ? 'Access Vault' : 'Generate Identity'}</>
                            )}
                        </button>
                    </form>

                    <div className="mt-16 text-center border-t border-zinc-100 dark:border-zinc-800 pt-10">
                        <p className="text-zinc-400 text-sm font-medium italic">
                            {isLogin ? "Unregistered for the vault?" : "Neural key already exists?"}
                        </p>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="mt-4 text-vault-accent font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 mx-auto hover:gap-5 transition-all duration-500"
                        >
                            {isLogin ? 'Generate New Identity' : 'Proceed to Access'} <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="mt-12 text-center flex flex-col items-center gap-4 opacity-30">
                    <div className="flex items-center gap-6">
                        <div className="h-px w-10 bg-zinc-400"></div>
                        <Sparkles size={12} className="text-vault-accent" />
                        <div className="h-px w-10 bg-zinc-400"></div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
                        Quantum Secure Architecture &bull; 2048-bit Encryption
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
