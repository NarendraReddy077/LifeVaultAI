import { useState, useEffect } from 'react';
import { memoryAPI } from '../services/api';
import { Calendar, Trash2, Edit2, X, Upload, Plus, Sparkles, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const Timeline = () => {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMemory, setEditingMemory] = useState(null);
    const [memoryToDelete, setMemoryToDelete] = useState(null);

    const fetchMemories = async () => {
        try {
            const res = await memoryAPI.getMemories();
            setMemories(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    const requestDelete = (id) => {
        setMemoryToDelete(id);
    };

    const confirmDelete = async () => {
        if (!memoryToDelete) return;

        try {
            await memoryAPI.deleteMemory(memoryToDelete);
            setMemories(memories.filter(m => m.id !== memoryToDelete));
            toast.success("Memory expunged from vault.");
        } catch (err) {
            console.error("Failed to delete", err);
            toast.error("Failed to expunge memory.");
        } finally {
            setMemoryToDelete(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-60 space-y-8">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-vault-accent/10 border-t-vault-accent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-vault-accent animate-pulse" size={28} />
                </div>
            </div>
            <div className="space-y-3 text-center">
                <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Synchronizing with Sanctuary</p>
                <p className="text-zinc-400 text-[10px] italic font-medium">Accessing encrypted archives...</p>
            </div>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="space-y-20 md:space-y-32 relative pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                <header className="space-y-6 max-w-2xl">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-vault-accent/10 text-vault-accent text-[11px] font-black uppercase tracking-[0.3em] border border-vault-accent/20"
                    >
                        <Calendar size={14} /> The Eternal Log
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
                    >
                        Your <span className="premium-gradient-text">Timeline.</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 dark:text-zinc-400 text-xl font-medium italic leading-relaxed"
                    >
                        A high-fidelity sanctuary for the moments that define your narrative.
                    </motion.p>
                </header>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link to="/add" className="btn-primary !px-10 !py-6 !rounded-3xl group text-base">
                        <Plus size={24} className="group-hover:rotate-180 transition-transform duration-700" />
                        <span>Archive Moment</span>
                    </Link>
                </motion.div>
            </div>

            {memories.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card text-center py-40 space-y-10 border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10 shadow-none flex flex-col items-center"
                >
                    <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-[2.5rem] flex items-center justify-center text-zinc-400 shadow-inner">
                        <Calendar size={48} />
                    </div>
                    <div className="space-y-3">
                        <p className="text-zinc-500 text-2xl font-black tracking-tight">Your vault is awaiting its first entry.</p>
                        <p className="text-zinc-400 font-medium italic">No echoes have been recorded yet.</p>
                    </div>
                    <Link to="/add" className="btn-primary !px-12 !py-5 !rounded-2xl inline-flex items-center gap-3">
                        <Plus size={24} />
                        Get Started
                    </Link>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-16 md:space-y-24 relative"
                >
                    <div className="absolute left-[39px] top-6 bottom-6 w-px bg-zinc-100 dark:bg-zinc-800 hidden md:block" />
                    
                    {memories.map(memory => (
                        <motion.div key={memory.id} variants={itemVariants} className="relative md:pl-24">
                            <div className="absolute left-6 top-8 w-8 h-8 rounded-full bg-vault-bg border-4 border-zinc-100 dark:border-zinc-800 hidden md:block z-10 group-hover:border-vault-accent transition-colors duration-500" />
                            <MemoryCard
                                memory={memory}
                                onDelete={requestDelete}
                                onEdit={() => setEditingMemory(memory)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <AnimatePresence>
                {editingMemory && (
                    <EditModal
                        memory={editingMemory}
                        onClose={() => setEditingMemory(null)}
                        onSuccess={() => {
                            setEditingMemory(null);
                            fetchMemories();
                        }}
                    />
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={!!memoryToDelete}
                title="Expunge Memory"
                message="Are you certain you want to expunge this moment? This protocol is irreversible and will permanently delete the visual and textual data from your sanctuary."
                confirmText="Expunge Protocol"
                cancelText="Retain Memory"
                isDestructive={true}
                onConfirm={confirmDelete}
                onCancel={() => setMemoryToDelete(null)}
            />
        </div>
    );
};

const MemoryCard = ({ memory, onDelete, onEdit }) => {
    return (
        <div className="glass-card group hover:scale-[1.01] hover:border-vault-accent/40 relative overflow-hidden flex flex-col lg:flex-row gap-12 !p-10 md:!p-16 transition-all duration-700">
            <div className="absolute top-0 right-0 w-80 h-80 bg-vault-accent/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none group-hover:bg-vault-accent/10 transition-colors duration-1000"></div>

            <div className="flex-1 space-y-10">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                    <div className="flex items-center space-x-6">
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-vault-accent shadow-inner">
                            <Clock size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-zinc-100 text-3xl font-black tracking-tighter">
                                {new Date(memory.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-black uppercase tracking-[0.4em] mt-1">
                                {new Date(memory.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} &bull; Anchor Set
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-wrap gap-2 max-w-[300px] justify-end">
                            <span className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                {memory.mood}
                            </span>
                            {memory.ai_detected_emotion && (
                                <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border italic shadow-sm flex items-center gap-2 ${memory.emotion_mismatch_flag ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                    <Sparkles size={12} /> AI: {memory.ai_detected_emotion}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white/10 dark:bg-black/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 dark:border-zinc-800">
                            <button onClick={onEdit} className="p-3 text-zinc-400 hover:text-vault-accent hover:bg-vault-accent/10 rounded-xl transition-all" title="Refine Protocol">
                                <Edit2 size={20} />
                            </button>
                            <button onClick={() => onDelete(memory.id)} className="p-3 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all" title="Expunge Data">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <p className="text-slate-800 dark:text-zinc-200 leading-[1.8] whitespace-pre-wrap text-2xl md:text-3xl font-light tracking-wide italic">
                        "{memory.content}"
                    </p>
                </div>

                {memory.reflection && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 md:p-10 rounded-[2.5rem] space-y-5 bg-vault-accent/[0.03] border-l-4 border-vault-accent relative group/reflection"
                    >
                        <div className="flex items-center gap-2.5 text-vault-accent text-[11px] font-black uppercase tracking-[0.3em]">
                            <Sparkles size={14} className="animate-pulse" /> Neural Synthesis
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg italic leading-relaxed font-medium">
                            {memory.reflection}
                        </p>
                    </motion.div>
                )}
            </div>

            {memory.image_url && (
                <div className="lg:w-96 xl:w-[450px] shrink-0">
                    <div className="rounded-[3rem] overflow-hidden border-[12px] border-white dark:border-zinc-900 shadow-2xl h-full min-h-[400px] relative group/img cursor-zoom-in transition-all duration-700 group-hover:border-vault-accent/20">
                        <img
                            src={memory.image_url}
                            alt="Visual Context"
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover/img:scale-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-0 transition-opacity duration-1000 pointer-events-none" />
                    </div>
                </div>
            )}
        </div>
    );
};

const EditModal = ({ memory, onClose, onSuccess }) => {
    const [content, setContent] = useState(memory.content);
    const [mood, setMood] = useState(memory.mood);
    const [customMood, setCustomMood] = useState('');
    const [isCustomMood, setIsCustomMood] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(memory.image_url);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const moods = ['Happy', 'Peaceful', 'Anxious', 'Sad', 'Excited', 'Frustrated', 'Neutral'];

    useEffect(() => {
        if (!moods.includes(memory.mood)) {
            setIsCustomMood(true);
            setCustomMood(memory.mood);
            setMood('Other');
        }
    }, [memory.mood]);

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
        if (image) formData.append('image', image);

        try {
            await memoryAPI.updateMemory(memory.id, formData);
            toast.success("Reflection refined in vault.");
            onSuccess();
        } catch (err) {
            console.error(err);
            toast.error("An error occurred during archival refinement.");
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-zinc-950/80 backdrop-blur-2xl"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-vault-card rounded-[4rem] w-full max-w-5xl shadow-3xl overflow-hidden flex flex-col max-h-[92vh] border border-white/10 dark:border-zinc-800"
            >
                <div className="px-12 py-10 border-b border-vault-border flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-vault-accent text-[10px] font-black uppercase tracking-[0.4em]">
                            <Sparkles size={14} /> Refinement Mode
                        </div>
                        <h3 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">Recalibrate Memory</h3>
                    </div>
                    <button onClick={onClose} className="p-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-3xl transition-all group">
                        <X size={32} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>

                <div className="p-12 overflow-y-auto custom-scrollbar flex-1">
                    <form id="edit-form" onSubmit={handleSubmit} className="space-y-16">
                        <div className="space-y-8">
                            <label className="flex items-center gap-3 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">
                                <span className="w-2 h-2 rounded-full bg-vault-accent animate-pulse"></span> Emotional Frequency
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {moods.map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => { setMood(m); setIsCustomMood(false); }}
                                        className={`px-8 py-4 rounded-2xl text-[11px] font-black transition-all duration-500 uppercase tracking-widest ${mood === m && !isCustomMood
                                            ? 'bg-vault-accent text-zinc-950 shadow-xl shadow-vault-accent/30 scale-105'
                                            : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-100 dark:border-zinc-800 hover:border-vault-accent/30'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => { setMood('Other'); setIsCustomMood(true); }}
                                    className={`px-8 py-4 rounded-2xl text-[11px] font-black transition-all duration-500 uppercase tracking-widest ${isCustomMood
                                        ? 'bg-vault-accent text-zinc-950 shadow-xl shadow-vault-accent/30 scale-105'
                                        : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-100 dark:border-zinc-800 hover:border-vault-accent/30'
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
                                            placeholder="Specify emotional state..."
                                            value={customMood}
                                            onChange={(e) => setCustomMood(e.target.value)}
                                            className="input-field italic !text-lg"
                                            autoFocus
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="space-y-8">
                            <label className="flex items-center gap-3 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">
                                <span className="w-2 h-2 rounded-full bg-vault-accent"></span> Inner Narrative
                            </label>
                            <textarea
                                className="input-field min-h-[300px] resize-none text-2xl font-light leading-relaxed p-10 bg-zinc-50/50 dark:bg-zinc-900/20"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-8">
                            <label className="flex items-center gap-3 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1">
                                <span className="w-2 h-2 rounded-full bg-vault-accent"></span> Visual Synthesis
                            </label>
                            {!preview ? (
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-20 cursor-pointer hover:border-vault-accent hover:bg-vault-accent/5 transition-all group duration-700 bg-zinc-50/30 dark:bg-zinc-900/10">
                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-xl border border-vault-border">
                                        <Upload className="text-zinc-400 group-hover:text-vault-accent" size={40} />
                                    </div>
                                    <span className="text-xl font-black text-zinc-500 group-hover:text-vault-accent tracking-tighter">Update Optical Anchor</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            ) : (
                                <div className="relative rounded-[3.5rem] overflow-hidden border-[12px] border-white dark:border-zinc-800 group shadow-2xl">
                                    <img src={preview} alt="Update Preview" className="w-full h-auto object-cover max-h-[500px]" />
                                    <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center backdrop-blur-xl">
                                        <div className="flex gap-8 scale-90 group-hover:scale-100 transition-all duration-700">
                                            <label className="bg-white text-zinc-950 px-10 py-5 rounded-3xl font-black cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-3xl flex items-center gap-3">
                                                <Upload size={24} /> New Source
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => { setImage(null); setPreview(null); }}
                                                className="bg-rose-500 text-white px-10 py-5 rounded-3xl font-black hover:scale-110 active:scale-95 transition-all shadow-3xl flex items-center gap-3"
                                            >
                                                <X size={24} /> Expunge
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="px-12 py-10 border-t border-vault-border bg-zinc-50/80 dark:bg-zinc-900/80 flex flex-col sm:flex-row justify-end gap-6 backdrop-blur-md">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary !bg-transparent !border-transparent !text-zinc-400 hover:!text-zinc-900 dark:hover:!text-zinc-100"
                    >
                        Cancel Refinement
                    </button>
                    <button
                        form="edit-form"
                        disabled={isSubmitting}
                        className="btn-primary !px-16 !py-5 shadow-2xl shadow-vault-accent/30"
                    >
                        {isSubmitting ? (
                            <><div className="w-6 h-6 border-4 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" /> Calibrating...</>
                        ) : 'Save Protocol'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Timeline;
