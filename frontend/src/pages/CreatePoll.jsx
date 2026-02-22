import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreatePoll = () => {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [expiryDate, setExpiryDate] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);
    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/polls', {
                title,
                options: options.filter(opt => opt.trim() !== ''),
                expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null
            });
            navigate('/');
        } catch (error) {
            alert('Error creating poll');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <button
                onClick={() => navigate('/')}
                className="mb-8 flex items-center text-slate-400 hover:text-white transition-colors group"
            >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </button>

            <div className="glass p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px]"></div>

                <div className="relative z-10">
                    <header className="mb-12">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
                            Admin Portal
                        </div>
                        <h1 className="text-4xl font-black text-white mb-4">Launch a New Poll</h1>
                        <p className="text-slate-400 font-medium">Define your question and options to start gathering community insights.</p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-500 uppercase tracking-widest block pl-1">The Question</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-5 text-white text-lg font-semibold placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all shadow-inner"
                                placeholder="e.g. What's the most important feature for our 2026 roadmap?"
                                required
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end pl-1">
                                <label className="text-sm font-black text-slate-500 uppercase tracking-widest block">Available Options</label>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Min. 2 Required</span>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {options.map((option, index) => (
                                    <div key={index} className="flex group animate-in" style={{ animationDelay: `${index * 50}ms` }}>
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                className="w-full bg-slate-800/30 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 outline-none transition-all"
                                                placeholder={`Option ${index + 1}`}
                                                required
                                            />
                                        </div>
                                        {options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                className="ml-4 p-4 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all border border-transparent hover:border-red-400/20"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addOption}
                                className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-black uppercase tracking-widest pl-1 mt-4 group transition-colors"
                            >
                                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-3 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                    </svg>
                                </span>
                                Add Option
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-500 uppercase tracking-widest block pl-1">Expiry Date <span className="text-slate-700 capitalize lowercase font-medium ml-2">(Optional)</span></label>
                                <input
                                    type="datetime-local"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div className="flex flex-col justify-end">
                                <p className="text-xs text-slate-500 mb-4 pl-1">
                                    By launching this poll, it will become immediately visible to all active users on the dashboard.
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            'Launch Poll →'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePoll;
