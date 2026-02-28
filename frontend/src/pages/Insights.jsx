import { useState, useEffect } from 'react';
import { insightAPI } from '../services/api';
import { Sparkles, Calendar } from 'lucide-react';

const Insights = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

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
        try {
            await insightAPI.generateWeekly();
            fetchInsights();
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400">Thinking...</div>;

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">AI Insights</h2>
                    <p className="text-gray-500 mt-2">Patterns detected across your timeline.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Sparkles size={18} />
                    <span>{isGenerating ? 'Generating...' : 'New Summary'}</span>
                </button>
            </div>

            <div className="grid gap-8">
                {insights.length === 0 ? (
                    <div className="card text-center py-20 text-gray-400">
                        No insights yet. Capture more memories to see patterns emerge.
                    </div>
                ) : (
                    insights.map(insight => (
                        <div key={insight.id} className="card bg-white overflow-hidden">
                            <div className={`p-1 ${insight.type === 'weekly' ? 'bg-vault-sky' : 'bg-vault-herb'}`} />
                            <div className="p-8">
                                <div className="flex items-center space-x-2 text-sm text-vault-muted mb-4">
                                    <Calendar size={14} />
                                    <span>{insight.time_range} • {insight.type.toUpperCase()}</span>
                                </div>
                                <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {insight.content}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Insights;
