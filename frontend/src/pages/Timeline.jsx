import { useState, useEffect } from 'react';
import { memoryAPI } from '../services/api';
import { Calendar, Trash2, Edit2, X, Upload, Plus, Sparkles } from 'lucide-react';
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
            toast.success("Memory deleted.");
        } catch (err) {
            console.error("Failed to delete", err);
            toast.error("Failed to delete memory.");
        } finally {
            setMemoryToDelete(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-60 space-y-8">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-vault-accent/10 border-t-vault-accent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-vault-accent animate-pulse" size={24} />
                </div>
            </div>
            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Synchronizing with Sanctuary</p>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-16 relative pb-32 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <header className="space-y-4 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vault-accent/10 text-vault-accent text-[10px] font-black uppercase tracking-widest border border-vault-accent/20">
                        <Calendar size={12} /> The Eternal Log
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter leading-none">Your <span className="premium-gradient-text">Timeline.</span></h2>
                    <p className="text-zinc-500 text-lg font-medium italic">A private sanctuary for the moments that define you.</p>
                </header>
                <Link to="/add" className="btn-primary group">
                    <Plus size={24} className="group-hover:rotate-180 transition-transform duration-700" />
                    <span>Archive New Moment</span>
                </Link>
            </div>

            {memories.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card text-center py-32 space-y-8 border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 shadow-none"
                >
                    <div className="mx-auto w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center text-zinc-400">
                        <Calendar size={40} />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xl font-medium">Your vault is awaiting its first entry.</p>
                        <p className="text-zinc-400 mt-2">No memories have been stored yet.</p>
                    </div>
                    <Link to="/add" className="btn-primary inline-flex items-center gap-2">
                        <Plus size={20} />
                        Get Started
                    </Link>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-10"
                >
                    {memories.map(memory => (
                        <motion.div key={memory.id} variants={itemVariants}>
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
                title="Delete Memory"
                message="Are you sure you want to delete this memory? This action cannot be undone and it will be permanently removed from your vault."
                confirmText="Delete Memory"
                cancelText="Keep Memory"
                isDestructive={true}
                onConfirm={confirmDelete}
                onCancel={() => setMemoryToDelete(null)}
            />
        </div>
    );
};

const MemoryCard = ({ memory, onDelete, onEdit }) => {
    return (
        <div className="glass-card group hover:scale-[1.01] hover:border-vault-accent/30 relative overflow-hidden flex flex-col md:flex-row gap-10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-vault-accent/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>

            <div className="flex-1 space-y-8">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-5">
                        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-3xl text-zinc-500 border border-zinc-200/50 dark:border-zinc-800">
                            <Calendar size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-zinc-900 dark:text-zinc-100 text-2xl font-black tracking-tighter">
                                {new Date(memory.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </span>
                            <span className="text-xs text-zinc-400 font-black uppercase tracking-[0.2em]">
                                {new Date(memory.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                                <span className="px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                                    {memory.mood}
                                </span>
                                {memory.ai_detected_emotion && (
                                    <span className={`px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border italic ${memory.emotion_mismatch_flag ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                        AI: {memory.ai_detected_emotion}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-2 rounded-2xl border border-white/20 dark:border-zinc-800 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                            <button onClick={onEdit} className="p-2.5 text-zinc-400 hover:text-vault-accent hover:bg-vault-accent/10 rounded-xl transition-all" title="Refine">
                                <Edit2 size={20} />
                            </button>
                            <button onClick={() => onDelete(memory.id)} className="p-2.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all" title="Expunge">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <p className="text-zinc-800 dark:text-zinc-200 leading-[1.8] whitespace-pre-wrap text-2xl font-light tracking-wide italic">
                        "{memory.content}"
                    </p>
                </div>

                {memory.reflection && (
                    <div className="glass-panel space-y-3 bg-vault-accent/[0.02] border-vault-accent/10">
                        <div className="flex items-center gap-2 text-vault-accent text-[10px] font-black uppercase tracking-widest">
                            <Sparkles size={12} /> AI Reflection
                        </div>
                        <p className="text-zinc-400 dark:text-zinc-500 text-sm italic leading-relaxed">
                            {memory.reflection}
                        </p>
                    </div>
                )}
            </div>

            {memory.image_url && (
                <div className="md:w-80 shrink-0">
                    <div className="rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-zinc-800 shadow-3xl h-full min-h-[300px] relative group/img cursor-zoom-in">
                        <img
                            src={memory.image_url}
                            alt="Visual Context"
                            className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000 scale-105 group-hover/img:scale-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
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
            toast.success("Reflection refined.");
            onSuccess();
        } catch (err) {
            console.error(err);
            toast.error("An error occurred during refinement.");
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/60 backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-3xl shadow-3xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20 dark:border-zinc-800"
            >
                <div className="px-10 py-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="space-y-1">
                        <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">Refine Reflection</h3>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Adjusting the echoes of the past</p>
                    </div>
                    <button onClick={onClose} className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
                        <X size={28} />
                    </button>
                </div>

                <div className="p-10 overflow-y-auto custom-scrollbar">
                    <form id="edit-form" onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-6">
                            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-vault-accent"></span> Current Frequency
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {moods.map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => { setMood(m); setIsCustomMood(false); }}
                                        className={`px-6 py-3 rounded-full text-xs font-black transition-all duration-500 uppercase tracking-widest ${mood === m && !isCustomMood
                                            ? 'bg-vault-accent text-white shadow-xl shadow-vault-accent/30 scale-105'
                                            : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => { setMood('Other'); setIsCustomMood(true); }}
                                    className={`px-6 py-3 rounded-full text-xs font-black transition-all duration-500 uppercase tracking-widest ${isCustomMood
                                        ? 'bg-vault-accent text-white shadow-xl shadow-vault-accent/30 scale-105'
                                        : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
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
                                            placeholder="Describe your emotional frequency..."
                                            value={customMood}
                                            onChange={(e) => setCustomMood(e.target.value)}
                                            className="input-field italic"
                                            autoFocus
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="space-y-6">
                            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-vault-accent"></span> Inner Dialogue
                            </label>
                            <textarea
                                className="input-field min-h-[250px] resize-none text-xl font-light leading-relaxed p-8 bg-zinc-50/30 dark:bg-zinc-950/20"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-6">
                            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-vault-accent"></span> Visual Context
                            </label>
                            {!preview ? (
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-16 cursor-pointer hover:border-vault-accent/50 hover:bg-vault-accent/5 transition-all group duration-700">
                                    <div className="bg-white dark:bg-zinc-800 p-5 rounded-[1.5rem] mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-xl border border-zinc-100 dark:border-zinc-800">
                                        <Upload className="text-zinc-400 group-hover:text-vault-accent" size={32} />
                                    </div>
                                    <span className="text-zinc-500 font-black group-hover:text-vault-accent tracking-tight">Replace Visual Context</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            ) : (
                                <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-zinc-800 group shadow-2xl">
                                    <img src={preview} alt="Update Preview" className="w-full h-auto object-cover max-h-[400px]" />
                                    <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center backdrop-blur-md">
                                        <div className="flex gap-6">
                                            <label className="bg-white text-zinc-900 px-8 py-4 rounded-2xl font-black cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-3xl text-sm flex items-center gap-2">
                                                <Upload size={20} /> Change
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => { setImage(null); setPreview(null); }}
                                                className="bg-rose-500 text-white px-8 py-4 rounded-2xl font-black hover:scale-110 active:scale-95 transition-all shadow-3xl text-sm flex items-center gap-2"
                                            >
                                                <X size={20} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="px-10 py-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end gap-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-bold transition-all px-6 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        Discard Changes
                    </button>
                    <button
                        form="edit-form"
                        disabled={isSubmitting}
                        className="btn-primary !px-12 !py-4 shadow-2xl shadow-vault-accent/40"
                    >
                        {isSubmitting ? (
                            <><div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" /> Refining...</>
                        ) : 'Save Refinement'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Timeline;
