import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const formatTimeLeft = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 48) return `Closes ${expiry.toLocaleDateString()}`;
    if (hours > 0) return `Closes in ${hours}h ${minutes}m`;
    return `Closes in ${minutes}m`;
};

const PollCard = ({ poll, votedOption }) => {
    const isClosed = poll.status === 'CLOSED';
    const totalVotes = poll.options?.reduce((sum, opt) => sum + opt.voteCount, 0) || 0;

    // Refresh countdown every minute
    const [, setTick] = useState(0);
    useEffect(() => {
        if (!isClosed && poll.expiryDate) {
            const interval = setInterval(() => setTick(t => t + 1), 60000);
            return () => clearInterval(interval);
        }
    }, [isClosed, poll.expiryDate]);

    const timeLeft = !isClosed && poll.expiryDate ? formatTimeLeft(poll.expiryDate) : null;

    return (
        <Link
            to={`/poll/${poll.id}`}
            className="group relative block bg-slate-900/50 rounded-2xl p-8 border border-white/5 glass transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col space-y-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-center w-max ${isClosed
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                        }`}>
                        {isClosed ? 'Closed' : 'Active'}
                    </span>

                    {votedOption && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-center w-max bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            Voted: {votedOption}
                        </span>
                    )}

                    {timeLeft && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase w-max bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {timeLeft}
                        </span>
                    )}
                </div>

                <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 opacity-60"></div>
                        </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[8px] text-slate-400 font-bold">
                        +{totalVotes}
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                {poll.title}
            </h3>

            <div className="flex items-center text-sm text-slate-400 mb-6">
                <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {poll.createdBy?.name || 'Anonymous'}
                </span>
                <span className="mx-3 text-slate-700">•</span>
                <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(poll.createdAt).toLocaleDateString()}
                </span>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-2xl font-black text-white leading-none">{totalVotes}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Votes Cast</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </div>
            </div>

            {/* Hover Background Accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </Link>
    );
};

export default PollCard;
