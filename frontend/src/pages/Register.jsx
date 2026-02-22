import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await register(formData.name, formData.email, formData.password, formData.role);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[85vh] px-6">
            <div className="relative w-full max-w-xl">
                {/* Decorative Background Glows */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>

                <div className="glass p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative z-10 overflow-hidden">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-8 animate-in">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-black text-white mb-4">Join PollMaster</h1>
                        <p className="text-slate-400 font-medium">Create your account to start shaping discussions.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl mb-8 flex items-center animate-in">
                            <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block pl-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-semibold placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-inner"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block pl-1">I am a...</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-inner appearance-none"
                                >
                                    <option value="USER">Voter Enthusiast</option>
                                    <option value="ADMIN">Poll Creator (Admin)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block pl-1">Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-semibold placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-inner"
                                placeholder="name@domain.com"
                                required
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block pl-1">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-semibold placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-inner"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center text-lg mt-2"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    'Create Account →'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-400 font-medium">
                            Already part of the community?{' '}
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold ml-1">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
