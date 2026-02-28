import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Timeline from './pages/Timeline';
import AddMemory from './pages/AddMemory';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Insights from './pages/Insights';
import AskAI from './pages/AskAI';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />

                <Route path="/timeline" element={
                    <PrivateRoute>
                        <Layout><Timeline /></Layout>
                    </PrivateRoute>
                } />

                <Route path="/add" element={
                    <PrivateRoute>
                        <Layout><AddMemory /></Layout>
                    </PrivateRoute>
                } />

                <Route path="/insights" element={
                    <PrivateRoute>
                        <Layout><Insights /></Layout>
                    </PrivateRoute>
                } />

                <Route path="/ask" element={
                    <PrivateRoute>
                        <Layout><AskAI /></Layout>
                    </PrivateRoute>
                } />

                <Route path="/settings" element={
                    <PrivateRoute>
                        <Layout><Settings /></Layout>
                    </PrivateRoute>
                } />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
