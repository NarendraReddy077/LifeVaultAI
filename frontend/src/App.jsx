import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Timeline from './pages/Timeline';
import AddMemory from './pages/AddMemory';
import Insights from './pages/Insights';
import AskAI from './pages/AskAI';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />

                <Route path="/timeline" element={
                    <PrivateRoute>
                        <Layout>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                <Timeline />
                            </motion.div>
                        </Layout>
                    </PrivateRoute>
                } />

                <Route path="/add" element={
                    <PrivateRoute>
                        <Layout>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <AddMemory />
                            </motion.div>
                        </Layout>
                    </PrivateRoute>
                } />

                <Route path="/insights" element={
                    <PrivateRoute>
                        <Layout>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                                <Insights />
                            </motion.div>
                        </Layout>
                    </PrivateRoute>
                } />

                <Route path="/ask" element={
                    <PrivateRoute>
                        <Layout>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                <AskAI />
                            </motion.div>
                        </Layout>
                    </PrivateRoute>
                } />

                <Route path="/settings" element={
                    <PrivateRoute>
                        <Layout>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                <Settings />
                            </motion.div>
                        </Layout>
                    </PrivateRoute>
                } />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AnimatePresence>
    );
};

import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            className: 'dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-700 shadow-xl rounded-2xl font-medium',
                            duration: 4000,
                        }}
                    />
                    <AnimatedRoutes />
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
