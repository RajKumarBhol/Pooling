import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import PollCard from '../components/PollCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const { user } = useAuth();

    const fetchPolls = useCallback(async (page = 0, search = '', append = false) => {
        try {
            if (page === 0) setLoading(true);
            else setLoadingMore(true);

            const params = { page, size: 9 };
            if (search.trim()) params.search = search.trim();

            const response = await api.get('/polls', { params });
            const data = response.data;

            // Handle both paginated (Page object) and plain array responses
            const pollsList = Array.isArray(data) ? data : (data.content || []);
            setPolls(prev => append ? [...prev, ...pollsList] : pollsList);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || pollsList.length);
            setCurrentPage(data.number || 0);
        } catch (error) {
            console.error('Error fetching polls:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchPolls(0, searchQuery);
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPolls(0, searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, fetchPolls]);

    const handleLoadMore = () => {
        fetchPolls(currentPage + 1, searchQuery, true);
    };

    const activePolls = polls.filter(p => p.status === 'ACTIVE');
    const closedPolls = polls.filter(p => p.status === 'CLOSED');
    const totalVotes = polls.reduce((sum, p) => sum + p.options.reduce((s, o) => s + o.voteCount, 0), 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-indigo-400 font-medium">Loading polls...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 via-slate-900/40 to-slate-900/40 p-16 mb-20 border border-white/5 glass">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
                        🚀 Real-time Polling Engine
                    </div>
                    <h1 className="text-6xl font-black text-white mb-8 leading-[1.1]">
                        Voice Your Opinions, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            See Live Results.
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                        Welcome back, <span className="text-white font-bold">{user?.name}</span>!
                        Join thousands of users sharing their voice on the most trending topics in tech, culture, and more.
                    </p>
                    <div className="flex flex-wrap gap-5">
                        {user?.role === 'ROLE_ADMIN' && (
                            <Link
                                to="/create-poll"
                                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/30 active:scale-95 flex items-center"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                </svg>
                                Create New Poll
                            </Link>
                        )}
                        <a
                            href="#active-polls"
                            className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 backdrop-blur-md active:scale-95"
                        >
                            Browse Discussions
                        </a>
                    </div>
                </div>

                {/* Visual Stats */}
                <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden xl:grid grid-cols-2 gap-4">
                    <div className="p-6 glass rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-colors">
                        <span className="text-3xl font-black text-white block mb-1">{totalElements}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Polls</span>
                    </div>
                    <div className="p-6 glass rounded-3xl border border-white/10 hover:border-purple-500/30 transition-colors">
                        <span className="text-3xl font-black text-white block mb-1">{totalVotes}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Votes Cast</span>
                    </div>
                    <div className="p-6 glass rounded-3xl border border-white/10 hover:border-green-500/30 transition-colors">
                        <span className="text-3xl font-black text-white block mb-1">{activePolls.length}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Now</span>
                    </div>
                    <div className="p-6 glass rounded-3xl border border-white/10 hover:border-pink-500/30 transition-colors">
                        <span className="text-3xl font-black text-white block mb-1">2.4k</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Users</span>
                    </div>
                </div>

                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]"></div>
            </section>

            {/* Platform Stats / How it Works Section */}
            <section className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">Instant Feedback</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Watch as the community reacts to topics in real-time with zero latency updates.</p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">Safe & Transparent</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Verified voting ensures every voice counts. Secure authentication maintains integrity.</p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 border border-pink-500/20">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 013 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">Democratic Tech</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Built with the modern stack to provide a seamless, performant voting experience.</p>
                </div>
            </section>

            {/* Search Bar */}
            <section id="active-polls" className="mb-12">
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search polls by title..."
                        className="w-full bg-slate-900/60 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-semibold placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all shadow-inner text-lg"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-500 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="text-center text-slate-500 text-sm mt-4 font-medium">
                        Showing results for "<span className="text-indigo-400">{searchQuery}</span>" — {totalElements} poll{totalElements !== 1 ? 's' : ''} found
                    </p>
                )}
            </section>

            {/* Active Polls Section */}
            <section className="mb-24">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-white flex items-center">
                        <span className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mr-5 border border-indigo-500/20">
                            <span className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse shadow-lg shadow-indigo-500/50"></span>
                        </span>
                        {searchQuery ? 'Search Results' : 'Live Discussions'}
                        <span className="ml-5 px-4 py-1.5 bg-slate-800 text-indigo-300 text-xs rounded-full font-black uppercase tracking-widest border border-white/5">
                            {activePolls.length} Active
                        </span>
                    </h2>
                </div>

                {polls.length === 0 ? (
                    <div className="glass p-20 rounded-[2.5rem] text-center border border-dashed border-white/10 relative overflow-hidden">
                        <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5">
                            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                            {searchQuery ? 'No polls found' : 'The stage is quiet...'}
                        </h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-10 text-lg leading-relaxed">
                            {searchQuery
                                ? `No polls matching "${searchQuery}". Try a different search term.`
                                : 'There are currently no active discussions. Be the first to spark a conversation!'
                            }
                        </p>
                        {!searchQuery && user?.role === 'ROLE_ADMIN' && (
                            <Link to="/create-poll" className="px-8 py-3 bg-indigo-600/10 text-indigo-400 font-bold rounded-xl border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all">
                                Launch Initial Poll
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {activePolls.map(poll => (
                                <PollCard key={poll.id} poll={poll} />
                            ))}
                        </div>

                        {/* Closed Polls inline */}
                        {closedPolls.length > 0 && (
                            <div className="mt-16">
                                <h2 className="text-2xl font-black text-slate-500 flex items-center mb-10">
                                    <span className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mr-4 text-slate-500 border border-white/5">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    Legacy Archives
                                    <span className="ml-4 px-3 py-1 bg-slate-800/50 text-slate-600 text-[10px] rounded-full font-black uppercase tracking-widest border border-white/5">
                                        {closedPolls.length} Closed
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                    {closedPolls.map(poll => (
                                        <PollCard key={poll.id} poll={poll} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Load More Button */}
                        {currentPage + 1 < totalPages && (
                            <div className="flex justify-center mt-16">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="px-12 py-4 bg-white/5 hover:bg-indigo-600/20 text-white font-bold rounded-2xl transition-all border border-white/10 hover:border-indigo-500/30 active:scale-95 disabled:opacity-50 flex items-center space-x-3"
                                >
                                    {loadingMore ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Loading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                            <span>Load More Polls</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
