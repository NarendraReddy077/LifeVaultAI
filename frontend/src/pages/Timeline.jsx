import { useState, useEffect } from 'react';
import { memoryAPI } from '../services/api';
import { Calendar, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Timeline = () => {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchMemories();
    }, []);

    if (loading) return <div className="text-center py-20 text-gray-400">Loading your memories...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Your Timeline</h2>
                    <p className="text-gray-500 mt-2">A record of your emotional journey.</p>
                </div>
            </div>

            {memories.length === 0 ? (
                <div className="card text-center py-20 space-y-4">
                    <p className="text-gray-400">Your vault is empty. Capture your first memory.</p>
                    <Link to="/add" className="btn-primary inline-block">Add Memory</Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {memories.map(memory => (
                        <MemoryCard key={memory.id} memory={memory} />
                    ))}
                </div>
            )}
        </div>
    );
};

const MemoryCard = ({ memory }) => {
    return (
        <div className="card group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Calendar size={14} />
                    <span>{new Date(memory.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${memory.emotion_mismatch_flag ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                        }`}>
                        {memory.ai_detected_emotion}
                    </span>
                </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">{memory.content}</p>

            {memory.image_url && (
                <div className="mb-6 rounded-xl overflow-hidden border border-gray-100">
                    <img src={memory.image_url} alt="Memory" className="w-full h-auto max-h-96 object-cover" />
                </div>
            )}

            {memory.reflection && (
                <div className="bg-gray-50 rounded-xl p-4 border-l-2 border-vault-accent italic text-gray-600 text-sm">
                    {memory.reflection}
                </div>
            )}
        </div>
    );
};

export default Timeline;
