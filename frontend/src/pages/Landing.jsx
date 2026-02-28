import { Link } from 'react-router-dom';
import { Shield, Brain, Sparkles, Image as ImageIcon } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="px-6 py-24 text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8">
                    Your memories, <span className="text-vault-accent">interpreted</span> by AI over time.
                </h1>
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    LifeVault AI is a private space for your thoughts. Our reflective AI helps you see emotional patterns without ever giving advice or judgment.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <Link to="/login" className="btn-primary flex items-center justify-center space-x-2">
                        <span>Start Your Vault</span>
                    </Link>
                    <a href="#about" className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all border border-gray-100">
                        Learn More
                    </a>
                </div>
            </section>

            {/* Highlights */}
            <section id="about" className="bg-gray-50 py-24 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <HighlightCard
                        icon={<Shield className="text-vault-accent" />}
                        title="Privacy First"
                        description="Your data is user-scoped and secure. Privacy is architectural, not just a policy."
                    />
                    <HighlightCard
                        icon={<Brain className="text-vault-accent" />}
                        title="Reflective AI"
                        description="Our AI is a neutral observer, mirroring your patterns for self-reflection."
                    />
                    <HighlightCard
                        icon={<ImageIcon className="text-vault-accent" />}
                        title="Private Media"
                        description="Images stay local to your vault, stored in private buckets with signed URL access."
                    />
                    <HighlightCard
                        icon={<Sparkles className="text-vault-accent" />}
                        title="Dynamic Insights"
                        description="Weekly summaries and long-term pattern detection help you understand yourself better."
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
                &copy; 2026 LifeVault AI. All rights reserved. Built for people, not for data.
            </footer>
        </div>
    );
};

const HighlightCard = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
);

export default Landing;
