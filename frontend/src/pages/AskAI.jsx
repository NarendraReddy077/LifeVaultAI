import { useState } from 'react';
import { memoryAPI } from '../services/api';
import { Send, MessageSquare } from 'lucide-react';

const AskAI = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await memoryAPI.askAI(query);
            setResponse(res.data.response);
        } catch (err) {
            console.error(err);
            setResponse("I'm sorry, I couldn't access your memories right now.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-200px)]">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Ask Your Past</h2>
                <p className="text-gray-500 mt-2">Semantically search your memories through natural conversation.</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pb-20">
                {!response && !loading && (
                    <div className="text-center py-20 text-gray-300">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Ask something like "How have I been feeling about work lately?"</p>
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center py-10">
                        <div className="animate-pulse text-vault-accent">Reflecting on your vault...</div>
                    </div>
                )}

                {response && (
                    <div className="card bg-vault-accent bg-opacity-5 border-vault-accent border-opacity-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="prose prose-slate text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {response}
                        </div>
                    </div>
                )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 pt-4">
                <form onSubmit={handleAsk} className="relative">
                    <input
                        type="text"
                        className="input-field pr-16 shadow-lg"
                        placeholder="Ask AI about your memories..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="absolute right-2 top-2 bottom-2 bg-vault-accent text-white px-4 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AskAI;
