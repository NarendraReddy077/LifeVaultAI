import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Camera, Home, BarChart2, MessageSquare, Settings, LogOut, Sparkles, User, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <div className="min-h-screen bg-vault-bg text-vault-text transition-colors duration-300 flex flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <aside className="w-80 bg-vault-card border-r border-vault-border hidden md:flex flex-col sticky top-0 h-screen transition-colors duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vault-accent via-fuchsia-500 to-vault-accent animate-mesh bg-[length:200%_auto]" />

                <div className="p-12 flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-vault-accent blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative bg-vault-accent p-3 rounded-[1.25rem] shadow-2xl shadow-vault-accent/40 group-hover:rotate-12 transition-transform duration-700">
                            <Sparkles size={26} className="text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 leading-none">LifeVault</h1>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-vault-accent">Neural Core</span>
                    </div>
                </div>

                <nav className="flex-1 px-8 space-y-3 mt-6">
                    <NavLink to="/timeline" icon={<Home size={22} />} label="Timeline" active={isActive('/timeline')} />
                    <NavLink to="/add" icon={<Camera size={22} />} label="Archive" active={isActive('/add')} />
                    <NavLink to="/insights" icon={<BarChart2 size={22} />} label="Deep Insights" active={isActive('/insights')} />
                    <NavLink to="/ask" icon={<MessageSquare size={22} />} label="Neural Query" active={isActive('/ask')} />
                </nav>

                <div className="p-8 mt-auto space-y-6">
                    <div className="space-y-2">
                        <NavLink to="/settings" icon={<Settings size={22} />} label="Vault Settings" active={isActive('/settings')} />
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-4 w-full px-5 py-4 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest group"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Terminate Session</span>
                        </button>
                    </div>

                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-colors" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-3 ml-1">Privacy Protocol</p>
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-emerald-500 animate-ping opacity-20 rounded-full" />
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                            <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">End-to-End Secure</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Nav */}
            <nav className="md:hidden bg-vault-card/80 backdrop-blur-xl border-t border-vault-border fixed bottom-0 left-0 right-0 h-20 flex items-center justify-around px-6 z-50 transition-colors duration-300">
                <MobileNavLink to="/timeline" icon={<Home size={26} />} active={isActive('/timeline')} />
                <MobileNavLink to="/insights" icon={<BarChart2 size={26} />} active={isActive('/insights')} />
                <Link to="/add" className="bg-vault-accent p-4 rounded-3xl shadow-xl shadow-vault-accent/40 -translate-y-6 active:scale-95 transition-all text-white">
                    <Camera size={26} />
                </Link>
                <MobileNavLink to="/ask" icon={<MessageSquare size={26} />} active={isActive('/ask')} />
                <MobileNavLink to="/settings" icon={<Settings size={26} />} active={isActive('/settings')} />
            </nav>

            {/* Header for Mobile */}
            <header className="md:hidden bg-vault-card/80 backdrop-blur-xl px-8 py-6 border-b border-vault-border flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-vault-accent" />
                    <h1 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">LifeVault</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:text-vault-accent transition-colors">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <Link to="/settings" className="p-2 text-zinc-500 hover:text-vault-accent transition-colors">
                        <User size={20} />
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 md:pb-0 pb-24 overflow-y-auto relative">
                {/* Desktop Top Header Actions */}
                <div className="hidden md:flex absolute top-8 right-12 z-40 items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-3 bg-vault-card border border-vault-border rounded-2xl text-zinc-500 hover:text-vault-accent hover:border-vault-accent transition-all shadow-sm group"
                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        {theme === 'light' ? <Moon size={20} className="group-hover:rotate-12 transition-transform" /> : <Sun size={20} className="group-hover:rotate-90 transition-transform" />}
                    </button>
                    <Link
                        to="/settings"
                        className="p-3 bg-vault-card border border-vault-border rounded-2xl text-zinc-500 hover:text-vault-accent hover:border-vault-accent transition-all shadow-sm group"
                        title="Profile Settings"
                    >
                        <User size={20} className="group-hover:scale-110 transition-transform" />
                    </Link>
                </div>

                <div className="max-w-5xl mx-auto px-8 py-16">
                    {children}
                </div>
            </main>
        </div>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center space-x-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 font-bold group ${active
            ? 'bg-vault-accent text-white shadow-xl shadow-vault-accent/20 translate-x-1'
            : 'text-zinc-500 hover:text-vault-accent hover:bg-vault-accent/5'
            }`}
    >
        <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
            {icon}
        </span>
        <span>{label}</span>
    </Link>
);

const MobileNavLink = ({ to, icon, active }) => (
    <Link to={to} className={`p-3 rounded-2xl transition-all relative ${active ? 'text-vault-accent' : 'text-zinc-400'
        }`}>
        {icon}
        {active && (
            <motion.div
                layoutId="active-mobile-tab"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-vault-accent rounded-full"
            />
        )}
    </Link>
);

export default Layout;
