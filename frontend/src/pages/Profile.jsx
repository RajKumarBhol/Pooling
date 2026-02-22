import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import PollCard from '../components/PollCard';

const Profile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('voted'); // 'voted' or 'created'

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/users/me/history');
                setProfileData(response.data);
                if (response.data.role === 'ROLE_ADMIN') {
                    setActiveTab('created');
                }
            } catch (error) {
                console.error('Failed to fetch profile history:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-indigo-400 font-medium">Loading profile...</p>
            </div>
        );
    }

    if (!profileData) {
        return <div className="text-center mt-20 text-red-400">Failed to load profile data.</div>;
    }

    const { createdPolls, votedPolls } = profileData;

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Profile Header */}
            <div className="glass p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>

                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-2xl shadow-indigo-500/20 shrink-0">
                    <div className="w-full h-full bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400">
                        {profileData.name.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="relative z-10 text-center md:text-left flex-1">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-4">
                        {profileData.role === 'ROLE_ADMIN' ? 'Poll Creator' : 'Voter Enthusiast'}
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2">{profileData.name}</h1>
                    <p className="text-slate-400 font-medium text-lg mb-6">{profileData.email}</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="px-6 py-3 bg-slate-900/50 rounded-2xl border border-white/5 flex flex-col items-center md:items-start">
                            <span className="text-2xl font-black text-white">{votedPolls.length}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Votes Cast</span>
                        </div>
                        {profileData.role === 'ROLE_ADMIN' && (
                            <div className="px-6 py-3 bg-slate-900/50 rounded-2xl border border-white/5 flex flex-col items-center md:items-start">
                                <span className="text-2xl font-black text-white">{createdPolls.length}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Polls Created</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-8 bg-slate-900/50 p-2 rounded-2xl w-max mx-auto md:mx-0 border border-white/5">
                {profileData.role === 'ROLE_ADMIN' && (
                    <button
                        onClick={() => setActiveTab('created')}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'created'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Created Polls
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('voted')}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'voted'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    Voting History
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[40vh]">
                {activeTab === 'created' && profileData.role === 'ROLE_ADMIN' && (
                    <div className="animate-in">
                        {createdPolls.length === 0 ? (
                            <div className="text-center py-20 glass rounded-[2.5rem] border border-dashed border-white/10">
                                <p className="text-slate-400 text-lg">You haven't created any polls yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {createdPolls.map(poll => (
                                    <PollCard key={`created-${poll.id}`} poll={poll} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'voted' && (
                    <div className="animate-in">
                        {votedPolls.length === 0 ? (
                            <div className="text-center py-20 glass rounded-[2.5rem] border border-dashed border-white/10">
                                <p className="text-slate-400 text-lg">You haven't participated in any polls yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {votedPolls.map(vp => (
                                    <PollCard key={`voted-${vp.poll.id}`} poll={vp.poll} votedOption={vp.selectedOptionText} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
