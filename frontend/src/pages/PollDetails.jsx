import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const PollDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        fetchPoll();

        // WebSocket setup for real-time updates
        let stompClient = null;
        let connected = false;

        try {
            const socket = new SockJS('http://localhost:8080/ws');
            stompClient = Stomp.over(socket);
            stompClient.debug = null;

            stompClient.connect({}, () => {
                connected = true;
                stompClient.subscribe(`/topic/polls/${id}`, (message) => {
                    const update = JSON.parse(message.body);
                    setPoll(prev => {
                        if (!prev) return prev;
                        const newOptions = prev.options.map(opt =>
                            opt.id === update.optionId ? { ...opt, voteCount: update.voteCount } : opt
                        );
                        return { ...prev, options: newOptions };
                    });
                });
            }, (error) => {
                console.warn('WebSocket connection failed, live updates disabled:', error);
            });
        } catch (error) {
            console.warn('WebSocket setup failed:', error);
        }

        return () => {
            if (stompClient && connected) {
                try { stompClient.disconnect(); } catch (e) { /* ignore */ }
            }
        };
    }, [id]);

    const fetchPoll = async () => {
        try {
            const response = await api.get(`/polls/${id}`);
            setPoll(response.data);
        } catch (error) {
            console.error('Error fetching poll:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (optionId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setVoting(true);
        try {
            const response = await api.post(`/polls/${id}/vote`, { optionId });
            if (response.data.success) {
                setHasVoted(true);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error casting vote');
        } finally {
            setVoting(false);
        }
    };

    const handleClosePoll = async () => {
        if (!window.confirm('Are you sure you want to close this poll?')) return;
        try {
            await api.post(`/polls/${id}/close`);
            fetchPoll();
        } catch (error) {
            alert('Error closing poll');
        }
    };

    const handleDeletePoll = async () => {
        if (!window.confirm('DANGER: This will delete the poll and all votes. Continue?')) return;
        try {
            await api.delete(`/polls/${id}`);
            navigate('/');
        } catch (error) {
            alert('Error deleting poll');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-indigo-400 font-medium">Loading poll details...</p>
            </div>
        );
    }

    if (!poll) return <div className="text-center mt-20 text-red-400">Poll not found.</div>;

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
    const isClosed = poll.status === 'CLOSED';

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <button
                onClick={() => navigate('/')}
                className="mb-8 flex items-center text-slate-400 hover:text-white transition-colors group"
            >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Poll Info & Options */}
                <div className="lg:col-span-2">
                    <div className="glass p-10 rounded-3xl border border-white/5 relative overflow-hidden mb-8">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isClosed ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    }`}>
                                    {poll.status}
                                </span>
                                <span className="text-slate-500 text-xs">•</span>
                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    By {poll.createdBy.name}
                                </span>
                            </div>

                            <h1 className="text-4xl font-extrabold text-white mb-10 leading-tight">
                                {poll.title}
                            </h1>

                            <div className="space-y-4">
                                {poll.options.map(option => {
                                    const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                                    const isActive = !isClosed && !hasVoted && !voting;

                                    return (
                                        <div key={option.id} className="group relative">
                                            <button
                                                onClick={() => handleVote(option.id)}
                                                disabled={!isActive}
                                                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 relative z-10 overflow-hidden
                                                    ${isActive
                                                        ? 'border-white/10 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5'
                                                        : 'border-white/5 cursor-default'}`}
                                            >
                                                {/* Progress Bar Background */}
                                                <div
                                                    className="absolute inset-0 bg-indigo-600/10 transition-all duration-1000 ease-out z-0"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>

                                                <div className="relative z-10 flex justify-between items-center">
                                                    <span className={`font-bold transition-colors ${isActive ? 'text-slate-200 group-hover:text-white' : 'text-slate-400'}`}>
                                                        {option.optionText}
                                                    </span>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                                            {option.voteCount} votes
                                                        </span>
                                                        <span className="text-lg font-black text-indigo-400">
                                                            {percentage.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {hasVoted && (
                                <div className="mt-10 animate-in p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/30 text-center">
                                    <p className="text-indigo-300 font-bold flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Thank you for voting! Results update in real-time.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Statistics & Meta */}
                <div className="space-y-8">
                    <div className="glass p-8 rounded-3xl border border-white/5">
                        <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Poll Statistics</h2>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Participation</span>
                                <span className="text-3xl font-black text-white">{totalVotes}</span>
                                <span className="text-xs text-indigo-400 block mt-1 font-medium">Individual Votes</span>
                            </div>

                            <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Start Date</span>
                                <span className="text-xl font-bold text-white">{new Date(poll.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>

                            <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Expiry Date</span>
                                <span className="text-xl font-bold text-red-400/80">
                                    {poll.expiryDate ? new Date(poll.expiryDate).toLocaleDateString() : 'No expiry'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {isAdmin() && (
                        <div className="glass p-8 rounded-3xl border border-red-500/10 bg-red-500/5">
                            <h2 className="text-sm font-black text-red-400/60 uppercase tracking-[0.2em] mb-8 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Admin Zone
                            </h2>
                            <div className="space-y-3">
                                {!isClosed && (
                                    <button
                                        onClick={handleClosePoll}
                                        className="w-full py-4 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white transition-all font-bold border border-orange-500/20 active:scale-95"
                                    >
                                        Close for Voting
                                    </button>
                                )}
                                <button
                                    onClick={handleDeletePoll}
                                    className="w-full py-4 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all font-bold border border-red-500/20 active:scale-95"
                                >
                                    Delete Permanently
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PollDetails;
