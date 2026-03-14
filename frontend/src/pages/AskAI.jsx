import { useState, useRef, useEffect } from 'react';
import { memoryAPI } from '../services/api';
import { Send, MessageSquare, Sparkles, BrainCircuit, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AskAI = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!query.trim() || loading) return;

        setLoading(true);
        setResponse('');
        try {
            const res = await memoryAPI.askAI(query);
            setResponse(res.data.response);
        } catch (err) {
            console.error(err);
            setResponse("I'm sorry, I couldn't access your memories right now. The neural connection seems unstable.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (response || loading) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [response, loading]);

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-180px)] pb-10 pt-8">
            <header className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vault-accent/10 text-vault-accent text-[10px] font-black uppercase tracking-[0.3em] border border-vault-accent/20">
                        <BrainCircuit size={12} /> Semantic Search Engine
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter leading-none">Your <span className="premium-gradient-text">Past.</span></h2>
                    <p className="text-zinc-500 font-medium text-lg leading-relaxed italic">Engage in natural dialogue with your stored lived experiences.</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-10 pr-2">
                <AnimatePresence mode="wait">
                    {!response && !loading && (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="text-center py-20 space-y-10"
                        >
                            <div className="relative mx-auto w-24 h-24 group">
                                <div className="absolute inset-0 bg-vault-accent/10 blur-3xl rounded-full scale-150 animate-pulse" />
                                <div className="relative w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center text-zinc-300 border border-zinc-100 dark:border-zinc-800 shadow-3xl transition-transform duration-700 group-hover:rotate-12">
                                    <MessageSquare size={40} className="text-vault-accent opacity-40" />
                                </div>
                            </div>
                            <div className="space-y-6 max-w-lg mx-auto">
                                <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px]">Sample Inquiry Vectors</p>
                                <div className="grid gap-3">
                                    {["How have I been feeling about work lately?", "What were my main highlights from last month?", "Remind me about the time I felt most at peace."].map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setQuery(q)}
                                            className="w-full text-left px-6 py-4 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-100 dark:border-zinc-800 text-sm font-bold text-zinc-500 hover:border-vault-accent/50 hover:text-vault-accent transition-all duration-500 flex items-center justify-between group shadow-sm hover:shadow-xl"
                                        >
                                            <span className="italic">"{q}"</span>
                                            <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-40 space-y-8"
                        >
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-vault-accent/10 border-t-vault-accent rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BrainCircuit className="text-vault-accent animate-pulse" size={24} />
                                </div>
                            </div>
                            <div className="space-y-2 text-center">
                                <span className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em] animate-pulse">Scanning Temporal Layers</span>
                                <p className="text-zinc-400 text-[10px] italic font-medium">Mapping semantic relationships...</p>
                            </div>
                        </motion.div>
                    )}

                    {response && (
                        <motion.div
                            key="response"
                            initial={{ opacity: 0, scale: 0.98, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="glass-card !p-12 md:!p-16 border-vault-accent/20 bg-vault-accent/[0.01] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-vault-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                            <div className="absolute top-10 right-10 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-vault-accent/20 text-vault-accent p-3.5 rounded-2xl shadow-3xl group-hover:rotate-12 transition-transform duration-700">
                                <Sparkles size={24} />
                            </div>

                            <div className="max-w-none relative">
                                <div className="absolute left-[-40px] top-0 bottom-0 w-px bg-gradient-to-b from-vault-accent/50 to-transparent" />
                                <p className="text-zinc-800 dark:text-zinc-200 leading-[2] whitespace-pre-wrap text-2xl font-light tracking-wide italic">
                                    "{response}"
                                </p>
                            </div>

                            <div className="mt-12 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-vault-accent animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Neural Response Synthesized</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Ver. 02.14.alpha</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={scrollRef} />
            </div>

            <div className="mt-12 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 shadow-3xl">
                <form onSubmit={handleAsk} className="relative group flex items-center">
                    <input
                        type="text"
                        className="w-full bg-transparent px-8 py-6 text-xl font-light pr-24 outline-none transition-all placeholder:text-zinc-400 dark:text-zinc-100"
                        placeholder="Inquire about your past..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="absolute right-2 top-2 bottom-2 btn-primary !px-8 !rounded-[1.75rem] shadow-2xl shadow-vault-accent/40 flex items-center justify-center group/btn active:scale-95"
                    >
                        <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </form>
            </div>
            <p className="text-center text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] mt-8 opacity-40">Privacy protocol active • Neural observer context only</p>
        </div>
    );
};

export default AskAI;
