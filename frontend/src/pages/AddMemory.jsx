import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memoryAPI } from '../services/api';
import { Upload, X, Sparkles, ChevronLeft, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AddMemory = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('Neutral');
    const [customMood, setCustomMood] = useState('');
    const [isCustomMood, setIsCustomMood] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const moods = [
        'Happy', 'Peaceful', 'Anxious', 'Sad', 'Excited', 'Frustrated', 'Neutral'
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const finalMood = isCustomMood ? customMood : mood;

        const formData = new FormData();
        formData.append('content', content);
        formData.append('mood', finalMood);
        formData.append('created_at', date);
        if (image) formData.append('image', image);

        try {
            await memoryAPI.createMemory(formData);
            toast.success("Memory committed to your private vault.");
            navigate('/timeline');
        } catch (err) {
            console.error(err);
            toast.error("An error occurred during archival.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-16 pb-32">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-zinc-500 hover:text-vault-accent transition-all font-bold group px-4 py-2 rounded-2xl hover:bg-vault-accent/5"
                >
                    <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Timeline
                </button>
                <div className="flex gap-2.5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === 1 ? 'w-12 bg-vault-accent' : 'w-4 bg-zinc-200 dark:bg-zinc-800'}`}></div>
                    ))}
                </div>
            </div>

            <header className="space-y-6 text-left max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-vault-accent/10 text-vault-accent text-[11px] font-black uppercase tracking-[0.3em] border border-vault-accent/20"
                >
                    <Sparkles size={16} /> Neural Observation
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
                >
                    Commit to <br/> your <span className="premium-gradient-text">Sanctuary.</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 text-xl font-medium leading-relaxed italic"
                >
                    Transcribe the fleeting into the timeless. Every word is a coordinate in your personal history.
                </motion.p>
            </header>

            <motion.form
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                onSubmit={handleSubmit}
                className="space-y-20 relative"
            >
                <div className="glass-card !p-12 md:!p-16 space-y-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-vault-accent/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-colors duration-1000 group-hover:bg-vault-accent/10"></div>
                    
                    <div className="grid md:grid-cols-2 gap-12 md:gap-20">
                        <div className="space-y-8">
                            <label className="flex items-center gap-3 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">
                                <CalendarIcon size={14} className="text-vault-accent" /> Temporal Anchor
                            </label>
                            <input
                                type="date"
                                value={date}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setDate(e.target.value)}
                                className="input-field !text-lg !py-5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-8">
                            <label className="flex items-center gap-3 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">
                                <Sparkles size={14} className="text-vault-accent" /> Emotional Frequency
                            </label>
                            <div className="flex flex-wrap gap-2.5">
                                {moods.map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => { setMood(m); setIsCustomMood(false); }}
                                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${mood === m && !isCustomMood
                                            ? 'bg-vault-accent text-zinc-950 shadow-xl shadow-vault-accent/30 scale-105'
                                            : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-100 dark:border-zinc-800'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => { setIsCustomMood(true); setMood(''); }}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${isCustomMood
                                        ? 'bg-vault-accent text-zinc-950 shadow-xl shadow-vault-accent/30 scale-105'
                                        : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-100 dark:border-zinc-800'
                                        }`}
                                >
                                    Other
                                </button>
                            </div>

                            <AnimatePresence>
                                {isCustomMood && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Manually define frequency..."
                                            value={customMood}
                                            onChange={(e) => setCustomMood(e.target.value)}
                                            className="input-field italic !text-lg"
                                            autoFocus
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <label className="flex items-center gap-3 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">
                            <MessageSquare size={14} className="text-vault-accent" /> Inner Dialogue
                        </label>
                        <textarea
                            className="input-field min-h-[400px] resize-none text-2xl font-light leading-relaxed p-10 md:p-14 bg-zinc-50/20 dark:bg-zinc-950/10 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 italic"
                            placeholder="What resonates with you in this moment?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-8">
                        <label className="flex items-center gap-3 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">
                            <Upload size={14} className="text-vault-accent" /> Visual Synthesis
                        </label>
                        {!preview ? (
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[3rem] p-24 cursor-pointer hover:border-vault-accent/40 hover:bg-vault-accent/5 transition-all duration-700 group bg-zinc-50/10 dark:bg-zinc-950/10">
                                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-zinc-100 dark:border-zinc-800">
                                    <Upload className="text-zinc-300 group-hover:text-vault-accent w-12 h-12" />
                                </div>
                                <span className="text-2xl font-black text-zinc-400 group-hover:text-vault-accent tracking-tighter">Capture Visual Anchor</span>
                                <span className="text-xs text-zinc-400 mt-4 font-black uppercase tracking-[0.3em] opacity-40">Optical stabilization recommended</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        ) : (
                            <div className="relative rounded-[3rem] overflow-hidden border-[16px] border-white dark:border-zinc-800 shadow-3xl group animate-in zoom-in-95 duration-1000">
                                <img src={preview} alt="Upload Preview" className="w-full h-auto object-cover max-h-[700px] grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000" />
                                <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center backdrop-blur-xl">
                                    <div className="flex gap-10 scale-90 group-hover:scale-100 transition-all duration-700">
                                        <label className="bg-white text-zinc-950 px-12 py-6 rounded-3xl font-black cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-3xl flex items-center gap-4 text-xl">
                                            <Upload size={28} /> Change Source
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => { setImage(null); setPreview(null); }}
                                            className="bg-rose-500 text-white px-12 py-6 rounded-3xl font-black hover:scale-110 active:scale-95 transition-all shadow-3xl flex items-center gap-4 text-xl"
                                        >
                                            <X size={28} /> Discard Data
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-2 flex flex-col items-center gap-10">
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="btn-primary !w-full max-lg:!w-full max-w-lg !py-7 !rounded-[2.5rem] group !text-xl shadow-[0_20px_50px_-10px_rgba(251,191,36,0.4)]"
                    >
                        {isSubmitting ? (
                            <><div className="w-8 h-8 border-4 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" /> Synchronizing...</>
                        ) : (
                            <>
                                <Sparkles size={32} className="group-hover:rotate-12 transition-transform duration-500" />
                                Commit to Vault
                            </>
                        )}
                    </button>
                    <div className="flex items-center gap-10 opacity-30">
                        <div className="h-px w-24 bg-vault-border"></div>
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-500">Neural Encryption Protocol Active</p>
                        <div className="h-px w-24 bg-vault-border"></div>
                    </div>
                </div>
            </motion.form>
        </div>
    );
};

export default AddMemory;
