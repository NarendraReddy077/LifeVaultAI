import { useState } from 'react';
import { User, Bell, Shield, LogOut } from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-12">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
                <p className="text-gray-500 mt-2">Manage your private vault and preferences.</p>
            </div>

            <div className="space-y-6">
                <section className="card space-y-4">
                    <div className="flex items-center space-x-3 text-vault-accent">
                        <User size={20} />
                        <h3 className="font-bold">Profile Information</h3>
                    </div>
                    <p className="text-sm text-gray-500">Your profile is user-scoped and private.</p>
                    <div className="pt-4 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-600">Email</span>
                            <span className="text-gray-900 font-medium">user@example.com</span>
                        </div>
                    </div>
                </section>

                <section className="card space-y-4">
                    <div className="flex items-center space-x-3 text-vault-accent">
                        <Shield size={20} />
                        <h3 className="font-bold">Privacy & Security</h3>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900">Row Level Security</p>
                            <p className="text-xs text-gray-500">Enabled by default for all your data.</p>
                        </div>
                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded">ACTIVE</span>
                    </div>
                </section>

                <button className="flex items-center justify-center space-x-2 w-full p-4 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 transition-colors font-medium">
                    <LogOut size={18} />
                    <span>Delete Account & Vault</span>
                </button>
            </div>
        </div>
    );
};

export default Settings;
