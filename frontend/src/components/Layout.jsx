import { useNavigate, Link } from 'react-router-dom';
import { Camera, Home, BarChart2, MessageSquare, Settings, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <h1 className="text-xl font-bold text-vault-accent">LifeVault AI</h1>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <NavLink to="/timeline" icon={<Home size={20} />} label="Timeline" />
                    <NavLink to="/add" icon={<Camera size={20} />} label="Add Memory" />
                    <NavLink to="/insights" icon={<BarChart2 size={20} />} label="AI Insights" />
                    <NavLink to="/ask" icon={<MessageSquare size={20} />} label="Ask AI" />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <NavLink to="/settings" icon={<Settings size={20} />} label="Settings" />
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-vault-muted hover:text-red-500 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Nav */}
            <nav className="md:hidden bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around px-2 z-50">
                <MobileNavLink to="/timeline" icon={<Home size={24} />} />
                <MobileNavLink to="/add" icon={<Camera size={24} />} />
                <MobileNavLink to="/insights" icon={<BarChart2 size={24} />} />
                <MobileNavLink to="/ask" icon={<MessageSquare size={24} />} />
            </nav>

            {/* Header for Mobile */}
            <header className="md:hidden bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h1 className="text-lg font-bold text-vault-accent">LifeVault</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 md:pb-0 pb-20">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {children}
                </div>
            </main>
        </div>
    );
};

const NavLink = ({ to, icon, label }) => (
    <Link
        to={to}
        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-vault-muted hover:bg-gray-50 hover:text-vault-accent transition-all font-medium"
    >
        {icon}
        <span>{label}</span>
    </Link>
);

const MobileNavLink = ({ to, icon }) => (
    <Link to={to} className="p-2 text-vault-muted active:text-vault-accent transition-colors">
        {icon}
    </Link>
);

export default Layout;
