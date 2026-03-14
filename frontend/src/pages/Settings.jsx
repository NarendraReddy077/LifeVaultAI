import { useState, useEffect } from 'react';
import { profileAPI, memoryAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { User, Bell, Shield, LogOut, Moon, Sun, Download, Save, CheckCircle } from 'lucide-react';
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
        <div className="flex flex-col items-center justify-center py-60 space-y-8 text-center px-6">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-vault-accent/10 border-t-vault-accent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Settings className="text-vault-accent animate-pulse" size={28} />
                </div>
            </div>
            <div className="space-y-3">
                <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Syncing Configuration</p>
                <p className="text-zinc-400 text-xs italic font-medium">Accessing vault protocols...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-16 pb-32 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vault-accent/10 text-vault-accent text-[10px] font-black uppercase tracking-[0.3em] border border-vault-accent/20">
                        <Shield size={12} /> Vault Configuration
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter leading-none">Your <span className="premium-gradient-text">Protocol.</span></h2>
                    <p className="text-zinc-500 font-medium text-lg leading-relaxed italic">Fine-tune your cognitive interface and data sovereignty.</p>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:text-vault-accent hover:border-vault-accent hover:scale-105 transition-all shadow-xl group"
                >
                    {theme === 'light' ? <Moon size={28} className="group-hover:rotate-12 transition-transform" /> : <Sun size={28} className="group-hover:rotate-90 transition-transform" />}
                </button>
            </div>

            <div className="space-y-8">
                <form onSubmit={handleUpdateProfile} className="glass-card space-y-10 !p-12 md:!p-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-vault-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-vault-accent/10 flex items-center justify-center text-vault-accent border border-vault-accent/20 shadow-xl shadow-vault-accent/5">
                            <User size={24} />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter">Identity Core</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">Universal Designation</label>
                            <input
                                type="text"
                                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border-2 border-zinc-100 dark:border-zinc-800 focus:border-vault-accent rounded-[1.5rem] px-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-100"
                                placeholder="Your full name"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">Cognitive Summary</label>
                            <textarea
                                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border-2 border-zinc-100 dark:border-zinc-800 focus:border-vault-accent rounded-[1.5rem] px-6 py-4 text-sm font-medium leading-relaxed resize-none min-h-[140px] outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-100 italic"
                                placeholder="A brief narrative of your persona..."
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6">
                        <div className="min-h-[24px]">
                            {saveStatus === 'success' && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center text-emerald-500 text-[10px] font-black uppercase tracking-widest"
                                >
                                    <CheckCircle size={14} className="mr-2" /> Protocol Updated
                                </motion.span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary !px-10 !py-4 active:scale-95 group/btn"
                        >
                            <span className="flex items-center gap-3">
                                {saving ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : <Save size={18} className="group-hover:rotate-12 transition-transform" />}
                                <span>{saving ? 'Synchronizing...' : 'Save Configuration'}</span>
                            </span>
                        </button>
                    </div>
                </form>

                <div className="grid md:grid-cols-2 gap-8">
                    <section className="glass-card !p-10 space-y-6 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-vault-accent">
                                <Download size={20} />
                                <h3 className="text-lg font-black tracking-tighter">Data Sovereignty</h3>
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed italic">
                                Absolute ownership of your temporal trail. Export your entire memory vault as a secure JSON anchor.
                            </p>
                        </div>
                        <button
                            onClick={handleExport}
                            className="w-full flex items-center justify-center space-x-3 p-5 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-vault-accent/5 hover:border-vault-accent/30 hover:text-vault-accent transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
                        >
                            <Download size={18} />
                            <span>Extract Vault Anchor</span>
                        </button>
                    </section>

                    <section className="glass-card !p-10 border-rose-100 dark:border-rose-900/20 space-y-6 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-rose-500">
                                <Shield size={20} />
                                <h3 className="text-lg font-black tracking-tighter">Session Protocol</h3>
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed italic">
                                Terminate the neural link and securely disconnect from the LifeVault matrix.
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center space-x-3 w-full p-5 rounded-2xl text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
                        >
                            <LogOut size={18} />
                            <span>Terminate Link</span>
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Settings;
