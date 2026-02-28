import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memoryAPI } from '../services/api';
import { Upload, X } from 'lucide-react';

const AddMemory = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('Neutral');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const moods = ['Happy', 'Peaceful', 'Anxious', 'Sad', 'Excited', 'Frustrated', 'Neutral'];

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
        const formData = new FormData();
        formData.append('content', content);
        formData.append('mood', mood);
        if (image) formData.append('image', image);

        try {
            await memoryAPI.createMemory(formData);
            navigate('/timeline');
        } catch (err) {
            console.error(err);
            alert("Failed to save memory. Please check your backend connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Capture a Memory</h2>
                <p className="text-gray-500 mt-2">Speak your truth. Your vault is private.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">How are you feeling?</label>
                    <div className="flex flex-wrap gap-2">
                        {moods.map(m => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setMood(m)}
                                className={`px-4 py-2 rounded-xl border text-sm transition-all ${mood === m ? 'bg-vault-accent text-white border-vault-accent' : 'bg-white text-gray-500 border-gray-200 hover:border-vault-accent'
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">What's on your mind?</label>
                    <textarea
                        className="input-field min-h-[200px] resize-none"
                        placeholder="Write freely..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Add a visual (Optional)</label>
                    {!preview ? (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-10 cursor-pointer hover:border-vault-accent transition-colors group">
                            <Upload className="text-gray-300 group-hover:text-vault-accent mb-2" />
                            <span className="text-sm text-gray-400 group-hover:text-vault-accent">Click to upload or drag and drop</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    ) : (
                        <div className="relative rounded-2xl overflow-hidden border border-gray-200">
                            <img src={preview} alt="Upload Preview" className="w-full h-auto object-cover max-h-64" />
                            <button
                                onClick={() => { setImage(null); setPreview(null); }}
                                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm hover:text-red-500 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <button
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:bg-gray-300 disabled:active:scale-100"
                >
                    {isSubmitting ? 'Saving to Vault...' : 'Capture Memory'}
                </button>
            </form>
        </div>
    );
};

export default AddMemory;
