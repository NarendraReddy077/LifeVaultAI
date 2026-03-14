import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, ChevronRight, UserPlus, LogIn } from 'lucide-react';

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
                toast.success("Registered! Now log in.");
                setIsLogin(true);
            }
        } catch (err) {
            console.error(err);
            toast.error("Authentication failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 overflow-hidden relative">
            {/* Background blur effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-vault-accent/10 blur-[120px] rounded-full animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-500/10 blur-[100px] rounded-full animate-float transition-delay-[2s]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="glass-card !p-12 shadow-2xl border-white/40 dark:border-zinc-800 shadow-vault-accent/10">
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center justify-center p-4 bg-vault-accent rounded-3xl shadow-xl shadow-vault-accent/30 text-white mb-4">
                            <Sparkles size={32} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">LifeVault AI</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                            {isLogin ? 'Initialize your neural connection.' : 'Configure your secure vault access.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Identity Access</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-vault-accent transition-colors" size={20} />
                                <input
                                    type="email"
                                    className="input-field !pl-12 !py-4 text-base font-bold bg-zinc-50/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-900"
                                    placeholder="you@frequency.network"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Vault Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-vault-accent transition-colors" size={20} />
                                <input
                                    type="password"
                                    className="input-field !pl-12 !py-4 text-base font-bold bg-zinc-50/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-900"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="btn-primary w-full py-5 text-lg font-black mt-4 disabled:opacity-50 transition-all rounded-[1.5rem] shadow-xl shadow-vault-accent/30 flex items-center justify-center gap-3 active:scale-95"
                        >
                            {loading ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Finalizing...</>
                            ) : (
                                <>{isLogin ? <LogIn size={20} /> : <UserPlus size={20} />} {isLogin ? 'Access Vault' : 'Generate Identity'}</>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-zinc-400 text-sm font-medium">
                            {isLogin ? "New to the vault?" : "Neural key already exists?"}
                        </p>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="mt-2 text-vault-accent font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 mx-auto hover:gap-3 transition-all"
                        >
                            {isLogin ? 'Register New Identity' : 'Proceed to Access'} <ChevronRight size={14} />
                        </button>
                    </div>
                </div>

                <div className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 opacity-50">
                    Secure Architecture &bull; 256-bit Encryption
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
