import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden"
                    >
                        {/* Decorative background element */}
                        {isDestructive && (
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                        )}

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-vault-accent/10 text-vault-accent'}`}>
                                    <AlertTriangle size={24} />
                                </div>
                                <button
                                    onClick={onCancel}
                                    className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-锌-100 mb-2">{title}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                                {message}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                <button
                                    onClick={onCancel}
                                    className="px-6 py-2.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors order-2 sm:order-1"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg hover:scale-105 active:scale-95 order-1 sm:order-2 ${isDestructive
                                            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                                            : 'bg-vault-accent hover:bg-vault-accent/90 shadow-vault-accent/30'
                                        }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
