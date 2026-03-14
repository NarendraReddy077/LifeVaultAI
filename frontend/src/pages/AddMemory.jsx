import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memoryAPI } from '../services/api';
import { Upload, X, Sparkles, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
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
        { name: 'Happy', color: 'bg-emerald-500', text: 'text-emerald-500' },
        { name: 'Peaceful', color: 'bg-blue-500', text: 'text-blue-500' },
        { name: 'Anxious', color: 'bg-amber-500', text: 'text-amber-500' },
        { name: 'Sad', color: 'bg-indigo-500', text: 'text-indigo-500' },
        { name: 'Excited', color: 'bg-fuchsia-500', text: 'text-fuchsia-500' },
        { name: 'Frustrated', color: 'bg-rose-500', text: 'text-rose-500' },
        { name: 'Neutral', color: 'bg-zinc-500', text: 'text-zinc-500' },
        { name: 'Other...', color: 'bg-vault-accent', text: 'text-vault-accent' }
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleMoodChange = (e) => {
        const val = e.target.value;
        setMood(val);
        setIsCustomMood(val === 'Other...');
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
            toast.success("Memory archived securely.");
            navigate('/timeline');
        } catch (err) {
            console.error(err);
            toast.error("An error occurred. Your sanctuary is safe, but we couldn't save this moment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-16 pb-32 pt-8">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-zinc-500 hover:text-vault-accent transition-all font-bold group px-4 py-2 rounded-2xl hover:bg-vault-accent/5"
                >
                    <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Timeline
                </button>
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-1000 ${i === 1 ? 'w-12 bg-vault-accent' : 'w-4 bg-zinc-200 dark:bg-zinc-800'}`}></div>
                    ))}
                </div>
            </div>

            <header className="space-y-6 text-left max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-vault-accent/10 text-vault-accent text-xs font-black uppercase tracking-[0.2em] border border-vault-accent/20 shadow-sm"
                >
                    <Sparkles size={16} /> New Chronicling
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl font-black tracking-tight leading-none"
                >
                    Capture the <span className="premium-gradient-text">Unspoken.</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 text-xl font-medium leading-relaxed"
                >
                    Transcribe your fleeting thoughts into timeless echoes. This space is encrypted, private, and entirely yours.
                </motion.p>
            </header>

            <motion.form
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                onSubmit={handleSubmit}
                className="glass-card space-y-12 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-vault-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <label className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-vault-accent"></span> Temporal Anchor
                        </label>
                        <input
                            type="date"
                            value={date}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDate(e.target.value)}
                            className="input-field cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                        />
                    </div>

                    <div className="space-y-6">
                        <label className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-vault-accent"></span> Current Frequency
                        </label>
                        <div className="space-y-4">
                            <div className="relative group">
                                <select
                                    value={mood}
                                    onChange={handleMoodChange}
                                    className="input-field appearance-none cursor-pointer pr-12"
                                >
                                    {moods.map(m => (
                                        <option key={m.name} value={m.name}>{m.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                    <ChevronLeft size={20} className="-rotate-90" />
                                </div>
                            </div>

                            <AnimatePresence>
                                {isCustomMood && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Describe your emotional state..."
                                            value={customMood}
                                            onChange={(e) => setCustomMood(e.target.value)}
                                            className="input-field italic"
                                            autoFocus
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <label className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-vault-accent"></span> Inner Dialogue
                    </label>
                    <textarea
                        className="input-field min-h-[350px] resize-none text-2xl font-light leading-relaxed p-10 bg-zinc-50/30 dark:bg-zinc-950/20"
                        placeholder="What shifted within you today?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-6">
                    <label className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-vault-accent"></span> Visual Context
                    </label>
                    {!preview ? (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-20 cursor-pointer hover:border-vault-accent/50 hover:bg-vault-accent/5 transition-all duration-700 group bg-zinc-50/20 dark:bg-zinc-950/10">
                            <div className="bg-white dark:bg-zinc-800 p-6 rounded-[2rem] mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 border border-zinc-100 dark:border-zinc-700">
                                <Upload className="text-zinc-400 group-hover:text-vault-accent w-10 h-10" />
                            </div>
                            <span className="text-xl font-black text-zinc-500 group-hover:text-vault-accent tracking-tight">Archive a Moment</span>
                            <span className="text-sm text-zinc-400 mt-3 font-bold uppercase tracking-wider opacity-60">Visual synthesis recommended</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden border-8 border-white dark:border-zinc-800 shadow-3xl group animate-in zoom-in-95 duration-1000">
                            <img src={preview} alt="Upload Preview" className="w-full h-auto object-cover max-h-[600px] grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" />
                            <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center backdrop-blur-xl">
                                <div className="flex gap-8">
                                    <label className="bg-white text-zinc-900 px-10 py-5 rounded-3xl font-black cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-3xl flex items-center gap-3 text-lg">
                                        <Upload size={24} /> Redefine
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => { setImage(null); setPreview(null); }}
                                        className="bg-rose-500 text-white px-10 py-5 rounded-3xl font-black hover:scale-110 active:scale-95 transition-all shadow-3xl flex items-center gap-3 text-lg"
                                    >
                                        <X size={24} /> Discard
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-10 flex flex-col items-center gap-8 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="btn-primary w-full max-w-md group"
                    >
                        {isSubmitting ? (
                            <><div className="w-7 h-7 border-4 border-white/20 border-t-white rounded-full animate-spin" /> Chronicling...</>
                        ) : (
                            <>
                                <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                                Commit to Vault
                            </>
                        )}
                    </button>
                    <div className="flex items-center gap-6 opacity-40">
                        <div className="h-px w-20 bg-zinc-300 dark:bg-zinc-700"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">End-to-End Encrypted Sanctuary</p>
                        <div className="h-px w-20 bg-zinc-300 dark:bg-zinc-700"></div>
                    </div>
                </div>
            </motion.form>
        </div>
    );
};

export default AddMemory;
