import { useState, useEffect } from 'react';
import { insightAPI } from '../services/api';
import { Sparkles, Calendar, ChevronDown, Binary, Trash2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const Insights = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('weekly');
    const [customDate, setCustomDate] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [insightToDelete, setInsightToDelete] = useState(null);

    const fetchInsights = async () => {
        try {
            const res = await insightAPI.getInsights();
            setInsights(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setShowDropdown(false);
        try {
            let startDate = null;
            let endDate = null;

            if (selectedPeriod === 'custom_week' || selectedPeriod === 'custom_month') {
                if (!customDate) {
                    toast.error("Please select a valid period.");
                    setIsGenerating(false);
                    return;
                }

                if (selectedPeriod === 'custom_week') {
                    const year = parseInt(customDate.substring(0, 4));
                    const week = parseInt(customDate.substring(6, 8));
                    const jan4 = new Date(year, 0, 4);
                    const startOfWeek = new Date(year, 0, 4 + (week - 1) * 7 - (jan4.getDay() || 7) + 1);
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);

                    startDate = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;
                    endDate = `${endOfWeek.getFullYear()}-${String(endOfWeek.getMonth() + 1).padStart(2, '0')}-${String(endOfWeek.getDate()).padStart(2, '0')}`;
                } else if (selectedPeriod === 'custom_month') {
                    const year = parseInt(customDate.split('-')[0]);
                    const month = parseInt(customDate.split('-')[1]) - 1;
                    const startOfMonth = new Date(year, month, 1);
                    const endOfMonth = new Date(year, month + 1, 0);

                    startDate = `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}-01`;
                    endDate = `${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`;
                }
            }

            await insightAPI.generateInsight(selectedPeriod, startDate, endDate);
            await fetchInsights();
            toast.success("New reflection synthesized.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate insight.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async () => {
        if (!insightToDelete) return;
        try {
            await insightAPI.deleteInsight(insightToDelete);
            setInsights(insights.filter(i => i.id !== insightToDelete));
            toast.success("Reflection dissolved.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete reflection.");
        } finally {
            setInsightToDelete(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-60 space-y-8 text-center px-6">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-vault-accent/10 border-t-vault-accent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="text-vault-accent animate-pulse" size={28} />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-fuchsia-500/20 rounded-full blur-xl animate-pulse" />
            </div>
            <div className="space-y-3">
                <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Neural Synchronization</p>
                <p className="text-zinc-400 text-xs italic font-medium">Accessing subconscious threads...</p>
            </div>
        </div>
    );

    const periodOptions = [
        { id: 'weekly', label: 'Past 7 Days' },
        { id: 'monthly', label: 'Past 30 Days' },
        { id: 'custom_week', label: 'Specific Week' },
        { id: 'custom_month', label: 'Specific Month' }
    ];

    return (
        <div className="space-y-16 relative pb-32 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
                <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vault-accent/10 text-vault-accent text-[10px] font-black uppercase tracking-[0.3em] border border-vault-accent/20">
                        <Binary size={12} /> Neural Synthesis Engine
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter leading-none">Your <span className="premium-gradient-text">Insights.</span></h2>
                    <p className="text-zinc-500 font-medium text-lg leading-relaxed italic">Revealing the emergent patterns and subterranean threads of your lived experience.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex items-center gap-3">
                        <div className="relative w-full sm:w-auto">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                disabled={isGenerating}
                                className="w-full sm:w-60 flex items-center justify-between gap-4 px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:border-vault-accent transition-all shadow-xl shadow-zinc-200/50 dark:shadow-none"
                            >
                                <span className="flex items-center gap-3">
                                    <Calendar size={18} className="text-vault-accent" />
                                    {periodOptions.find(p => p.id === selectedPeriod)?.label}
                                </span>
                                <ChevronDown size={18} className={`text-zinc-400 transition-transform duration-500 ${showDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute left-0 sm:right-0 mt-3 w-full sm:w-64 glass-morphism dark:bg-zinc-900/90 rounded-[2rem] shadow-2xl overflow-hidden z-30"
                                    >
                                        <div className="p-2">
                                            {periodOptions.map(option => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => {
                                                        setSelectedPeriod(option.id);
                                                        setCustomDate('');
                                                        setShowDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-5 py-4 text-sm font-bold rounded-2xl transition-all ${selectedPeriod === option.id ? 'bg-vault-accent text-white shadow-lg shadow-vault-accent/30' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <AnimatePresence>
                            {(selectedPeriod === 'custom_week' || selectedPeriod === 'custom_month') && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20, width: 0 }}
                                    animate={{ opacity: 1, x: 0, width: 'auto' }}
                                    exit={{ opacity: 0, x: -20, width: 0 }}
                                    className="overflow-hidden"
                                >
                                    <input
                                        type={selectedPeriod === 'custom_week' ? "week" : "month"}
                                        className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-vault-accent transition-all shadow-xl shadow-zinc-200/50 dark:shadow-none"
                                        value={customDate}
                                        onChange={(e) => setCustomDate(e.target.value)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || ((selectedPeriod === 'custom_week' || selectedPeriod === 'custom_month') && !customDate)}
                        className="btn-primary flex items-center justify-center gap-3 active:scale-95 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        {isGenerating ? (
                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> <span className="relative">Synthesizing...</span></>
                        ) : (
                            <>
                                <Zap size={20} className="relative group-hover:rotate-12 transition-transform" />
                                <span className="relative">Reflect</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid gap-12">
                {insights.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card text-center py-40 space-y-10 border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/[0.03] shadow-none rounded-[3rem]"
                    >
                        <div className="relative mx-auto w-24 h-24 group">
                            <div className="absolute inset-0 bg-vault-accent/10 blur-3xl rounded-full scale-150 group-hover:bg-vault-accent/20 transition-colors duration-1000" />
                            <div className="relative w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center text-zinc-300 border border-zinc-100 dark:border-zinc-800 shadow-2xl transition-transform duration-700 group-hover:rotate-12">
                                <Binary size={40} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-zinc-900 dark:text-zinc-100 text-3xl font-black tracking-tighter">Insufficient Data Stream.</p>
                            <p className="text-zinc-500 font-medium max-w-sm mx-auto text-lg leading-relaxed italic">The neural observer requires more temporal anchors to map your cognitive topology.</p>
                        </div>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {insights.map((insight, index) => (
                            <motion.div
                                key={insight.id}
                                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ delay: index * 0.05, duration: 0.7 }}
                                className="glass-card group relative overflow-hidden !p-0 hover:scale-[1.01] hover:border-vault-accent/20 transition-all duration-700"
                            >
                                <div className="p-10 md:p-16">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
                                        <div className="flex items-center gap-8">
                                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110 ${insight.type === 'weekly' || insight.type === 'custom_week' ? 'bg-gradient-to-br from-vault-accent to-blue-600 text-white shadow-vault-accent/30' : 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-emerald-500/30'}`}>
                                                <Sparkles size={32} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-zinc-900 dark:text-zinc-100 text-4xl font-black tracking-tighter leading-none mb-3">{insight.time_range}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border italic ${insight.type === 'weekly' || insight.type === 'custom_week' ? 'text-vault-accent bg-vault-accent/10 border-vault-accent/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'}`}>
                                                        {insight.type.replace('custom_', '')} Synthesis
                                                    </span>
                                                    <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                                                        {new Date(insight.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setInsightToDelete(insight.id)}
                                            className="self-start p-4 text-zinc-300 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100 duration-500"
                                            title="Dissolve Synthesis"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>

                                    <div className="relative pl-12">
                                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-vault-accent/50 via-fuchsia-500/50 to-transparent" />
                                        <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-vault-accent shadow-[0_0_10px_rgba(139,92,246,0.5)]" />

                                        <div className="max-w-none">
                                            <p className="text-zinc-800 dark:text-zinc-200 leading-[2.2] whitespace-pre-wrap text-2xl font-light tracking-wide italic">
                                                "{insight.content}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-wrap items-center justify-between gap-6 opacity-60 group-hover:opacity-100 transition-opacity duration-1000">
                                        <div className="flex items-center gap-4 text-zinc-400">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 transition-transform group-hover:translate-x-1" />)}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Topology Verified</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-4 py-2 bg-vault-accent/5 rounded-full border border-vault-accent/10">
                                            <Sparkles size={14} className="text-vault-accent" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-vault-accent">Observer-01</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`h-1 w-full bg-gradient-to-r ${insight.type === 'weekly' || insight.type === 'custom_week' ? 'from-vault-accent via-fuchsia-500 to-vault-accent' : 'from-emerald-400 via-teal-400 to-emerald-400'} animate-mesh bg-[length:200%_auto]`} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <ConfirmModal
                isOpen={!!insightToDelete}
                title="Dissolve Reflection"
                message="Are you sure you want to dissolve this AI synthesis? The patterns identified will remain in your memories, but this specific reflection will be lost to the void."
                confirmText="Dissolve"
                cancelText="Preserve"
                isDestructive={true}
                onConfirm={handleDelete}
                onCancel={() => setInsightToDelete(null)}
            />
        </div>
    );
};

export default Insights;
