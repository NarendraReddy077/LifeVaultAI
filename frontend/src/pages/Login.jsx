import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                const res = await authAPI.login({ email, password });
                localStorage.setItem('token', res.data.access_token);
                navigate('/timeline');
            } else {
                await authAPI.register({ email, password });
                alert("Registered! Now log in.");
                setIsLogin(true);
            }
        } catch (err) {
            console.error(err);
            alert("Auth failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-10 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-vault-accent">LifeVault AI</h1>
                    <p className="text-gray-500 mt-2">{isLogin ? 'Welcome back.' : 'Create your secure vault.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="btn-primary w-full mt-4 disabled:bg-gray-300"
                    >
                        {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-vault-accent font-medium hover:underline">
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
