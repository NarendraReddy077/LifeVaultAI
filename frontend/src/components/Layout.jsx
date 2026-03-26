import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Camera, Home, BarChart2, MessageSquare, Settings, LogOut, Sparkles, User, Sun, Moon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-vault-bg text-vault-text transition-colors duration-500 flex flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <aside className="w-72 bg-vault-card border-r border-vault-border hidden md:flex flex-col sticky top-0 h-screen transition-colors duration-500 overflow-hidden z-50">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vault-accent via-amber-500 to-orange-500 animate-mesh bg-[length:200%_auto]" />

                <div className="p-10 flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-vault-accent blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative bg-vault-accent p-2.5 rounded-2xl shadow-xl shadow-vault-accent/40 group-hover:rotate-6 transition-transform duration-500">
                            <Sparkles size={22} className="text-zinc-950" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-tighter leading-none premium-gradient-text">LifeVault</h1>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-1">Neural Core 2.0</span>
                    </div>
                </div>

                <nav className="flex-1 px-6 space-y-1.5 mt-4">
                    <NavLink to="/timeline" icon={<Home size={20} />} label="Timeline" active={isActive('/timeline')} />
                    <NavLink to="/add" icon={<Plus size={20} />} label="Add Memory" active={isActive('/add')} />
                    <NavLink to="/insights" icon={<BarChart2 size={20} />} label="Deep Insights" active={isActive('/insights')} />
                    <NavLink to="/ask" icon={<MessageSquare size={20} />} label="Neural Query" active={isActive('/ask')} />
                </nav>

                <div className="p-6 mt-auto space-y-4">
                    <div className="pt-4 border-t border-vault-border space-y-1">
                        <NavLink to="/settings" icon={<Settings size={18} />} label="Configuration" active={isActive('/settings')} />
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3.5 w-full px-4 py-3.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 rounded-xl transition-all font-bold text-[11px] uppercase tracking-[0.2em] group"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </div>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl -mr-8 -mt-8 group-hover:bg-emerald-500/10 transition-colors" />
                        <div className="flex items-center gap-2.5">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-emerald-500 animate-ping opacity-20 rounded-full" />
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Encrypted Link</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Nav */}
            <nav className="md:hidden bg-vault-card/90 backdrop-blur-2xl border-t border-vault-border fixed bottom-0 left-0 right-0 h-20 flex items-center justify-around px-4 z-50 shadow-2xl safe-bottom">
                <MobileNavLink to="/timeline" icon={<Home size={22} />} active={isActive('/timeline')} />
                <MobileNavLink to="/insights" icon={<BarChart2 size={22} />} active={isActive('/insights')} />
                <Link to="/add" className="bg-vault-accent p-4 rounded-2xl shadow-xl shadow-vault-accent/30 -translate-y-8 active:scale-90 transition-all text-zinc-950 border-4 border-vault-bg">
                    <Plus size={26} />
                </Link>
                <MobileNavLink to="/ask" icon={<MessageSquare size={22} />} active={isActive('/ask')} />
                <MobileNavLink to="/settings" icon={<Settings size={22} />} active={isActive('/settings')} />
            </nav>

            {/* Header for Mobile */}
            <header className="md:hidden bg-vault-card/80 backdrop-blur-xl px-6 py-4 border-b border-vault-border flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-vault-accent" />
                    <h1 className="text-lg font-black tracking-tighter premium-gradient-text">LifeVault</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:text-vault-accent transition-colors">
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                    <Link to="/settings" className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 overflow-hidden">
                        <User size={16} />
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 md:pb-0 pb-24 overflow-y-auto relative">
                {/* Desktop Top Header Actions */}
                <div className="hidden md:flex absolute top-10 right-10 z-30 items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-3 bg-vault-card border border-vault-border rounded-xl text-zinc-500 hover:text-vault-accent hover:border-vault-accent transition-all shadow-sm group"
                    >
                        {theme === 'light' ? <Moon size={18} className="group-hover:rotate-12 transition-transform" /> : <Sun size={18} className="group-hover:rotate-90 transition-transform" />}
                    </button>
                    <Link
                        to="/settings"
                        className="p-3 bg-vault-card border border-vault-border rounded-xl text-zinc-500 hover:text-vault-accent hover:border-vault-accent transition-all shadow-sm group"
                    >
                        <User size={18} className="group-hover:scale-110 transition-transform" />
                    </Link>
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold group ${active
            ? 'bg-vault-accent/10 dark:bg-vault-accent/15 text-vault-accent border border-vault-accent/20 dark:border-vault-accent/30 shadow-sm shadow-vault-accent/5'
            : 'text-zinc-500 hover:text-vault-accent hover:bg-vault-accent/5 dark:hover:bg-vault-accent/10'
            }`}
    >
        <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
            {icon}
        </span>
        <span className="text-[13px] tracking-tight">{label}</span>
        {active && (
            <motion.div layoutId="sidebar-nav-blob" className="ml-auto w-1 h-1 bg-vault-accent rounded-full" />
        )}
    </Link>
);

const MobileNavLink = ({ to, icon, active }) => (
    <Link to={to} className={`p-2 rounded-xl transition-all relative ${active ? 'text-vault-accent' : 'text-zinc-400'}`}>
        {icon}
        {active && (
            <motion.div
                layoutId="active-mobile-tab"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-vault-accent rounded-full"
            />
        )}
    </Link>
);

export default Layout;
