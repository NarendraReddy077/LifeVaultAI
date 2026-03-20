import { useState, useEffect } from 'react';
import { profileAPI, memoryAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { User, Bell, Shield, LogOut, Moon, Sun, Download, Save, CheckCircle, Settings as SettingsIcon, ShieldCheck, Database, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const [profile, setProfile] = useState({ full_name: '', bio: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await profileAPI.getMe();
                setProfile({
                    full_name: res.data.full_name || '',
                    bio: res.data.bio || ''
                });
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await profileAPI.updateMe(profile);
            setSaveStatus('success');
            toast.success("Profile saved successfully.");
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (err) {
            console.error('Failed to update profile', err);
            toast.error("Failed to update profile.");
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const handleExport = async () => {
        try {
            const res = await memoryAPI.exportMemories();
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `lifevault_export_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            toast.success("Memories exported successfully.");
        } catch (err) {
            console.error('Failed to export memories', err);
            toast.error('Failed to export data.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-60 space-y-10 text-center px-6">
            <div className="relative group">
                <div className="w-28 h-28 border-8 border-vault-accent/5 border-t-vault-accent rounded-full animate-spin transition-all duration-1000 group-hover:border-t-fuchsia-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <SettingsIcon className="text-vault-accent animate-pulse" size={32} />
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-zinc-500 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Syncing Configuration</p>
                <p className="text-zinc-400 text-xs italic font-medium opacity-50">Accessing vault protocols...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-20 pb-40">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-b border-zinc-100 dark:border-zinc-800 pb-16">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-vault-accent/10 text-vault-accent text-[11px] font-black uppercase tracking-[0.3em] border border-vault-accent/20">
                        <ShieldCheck size={16} strokeWidth={2} /> Security Paradigm
                    </div>
                    <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-none">Your <span className="premium-gradient-text">Matrix.</span></h2>
                    <p className="text-zinc-500 font-medium text-xl leading-relaxed italic max-w-xl">Configure your neural interface and maintain absolute data sovereignty.</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 md:block hidden">Toggle Ambient Mode</p>
                    <button
                        onClick={toggleTheme}
                        className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:text-vault-accent hover:border-vault-accent hover:scale-105 transition-all shadow-2xl active:scale-95 group"
                    >
                        {theme === 'light' ? <Moon size={32} className="group-hover:rotate-12 transition-transform duration-500" /> : <Sun size={32} className="group-hover:rotate-90 transition-transform duration-500" />}
                    </button>
                </div>
            </div>

            <div className="space-y-16">
                <form onSubmit={handleUpdateProfile} className="glass-card !p-12 md:!p-20 space-y-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vault-accent/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none group-hover:bg-vault-accent/10 transition-colors duration-1000" />

                    <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-vault-accent border border-zinc-100 dark:border-zinc-800 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                            <User size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tighter">Identity Core</h3>
                            <p className="text-xs text-zinc-400 font-black uppercase tracking-widest opacity-40">Profile Metadata</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 md:gap-20">
                        <div className="space-y-6">
                            <label className="flex items-center gap-3 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">
                                <Zap size={14} className="text-vault-accent" /> Neural Designation
                            </label>
                            <input
                                type="text"
                                className="input-field !py-5 !text-lg bg-white dark:bg-zinc-900/40 focus:bg-white dark:focus:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm"
                                placeholder="Your full name"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-6">
                            <label className="flex items-center gap-3 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">
                                <ShieldCheck size={14} className="text-vault-accent" /> Cognitive Narrative
                            </label>
                            <textarea
                                className="input-field !py-5 !text-lg bg-white dark:bg-zinc-900/40 focus:bg-white dark:focus:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm min-h-[160px] resize-none italic"
                                placeholder="A brief summary of your persona..."
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-zinc-50 dark:border-zinc-900">
                        <div className="min-h-[30px]">
                            {saveStatus === 'success' && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center text-emerald-500 text-xs font-black uppercase tracking-[0.3em]"
                                >
                                    <CheckCircle size={18} className="mr-3" /> Protocol Synchronized
                                </motion.span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary !px-12 !py-5 !rounded-[2rem] active:scale-95 group/btn shadow-[0_15px_40px_-10px_rgba(251,191,36,0.3)] !text-lg"
                        >
                            <span className="flex items-center gap-4">
                                {saving ? (
                                    <div className="w-6 h-6 border-4 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                                ) : <Save size={22} className="group-hover:rotate-12 transition-transform duration-500" />}
                                <span>{saving ? 'Synchronizing...' : 'Update Protocol'}</span>
                            </span>
                        </button>
                    </div>
                </form>

                <div className="grid md:grid-cols-2 gap-10">
                    <section className="glass-card !p-12 space-y-10 flex flex-col justify-between group hover:border-vault-accent/30 transition-all duration-700">
                        <div className="space-y-6">
                            <div className="flex items-center gap-5 text-vault-accent">
                                <div className="p-4 rounded-3xl bg-vault-accent/10 border border-vault-accent/20 group-hover:scale-110 transition-transform duration-500">
                                    <Database size={28} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tighter">Data Sovereignty</h3>
                            </div>
                            <p className="text-sm text-zinc-500 leading-relaxed italic opacity-80">
                                Absolute ownership of your temporal trail. Extract your complete memory architecture as a decentralized, encrypted JSON anchor.
                            </p>
                        </div>
                        <button
                            onClick={handleExport}
                            className="w-full flex items-center justify-center gap-4 py-6 rounded-3xl border-4 border-dashed border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:bg-vault-accent/5 hover:border-vault-accent/40 hover:text-vault-accent transition-all font-black text-xs uppercase tracking-[0.3em] active:scale-95"
                        >
                            <Download size={22} />
                            <span>Extract Neural Data</span>
                        </button>
                    </section>

                    <section className="glass-card !p-12 space-y-10 flex flex-col justify-between group hover:border-rose-500/30 transition-all duration-700">
                        <div className="space-y-6">
                            <div className="flex items-center gap-5 text-rose-500">
                                <div className="p-4 rounded-3xl bg-rose-500/5 border border-rose-500/10 group-hover:scale-110 transition-transform duration-500">
                                    <LogOut size={28} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tighter">Link Termination</h3>
                            </div>
                            <p className="text-sm text-zinc-500 leading-relaxed italic opacity-80">
                                Deauthorize the current session and securely decouple your cognitive interface from the LifeVault network protocols.
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-4 w-full py-6 rounded-3xl text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 transition-all font-black text-xs uppercase tracking-[0.3em] active:scale-95"
                        >
                            <LogOut size={22} />
                            <span>Sever Neural Link</span>
                        </button>
                    </section>
                </div>
            </div>

            <div className="text-center opacity-30 space-y-6">
                <div className="flex items-center justify-center gap-10">
                    <div className="h-px w-20 bg-zinc-300 dark:bg-zinc-800"></div>
                    <Sparkles size={16} className="text-vault-accent" />
                    <div className="h-px w-20 bg-zinc-300 dark:bg-zinc-800"></div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-500">Quantum Grade Encryption Protcl &bull; v2.0.4</p>
            </div>
        </div>
    );
};

export default Settings;
