import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 px-6 py-4 mb-4 glass border-b border-white/5">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                        PollMaster
                    </span>
                </Link>

                <div className="flex items-center space-x-8">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center space-x-8">
                                <Link
                                    to="/"
                                    className={`text-sm font-semibold transition-colors ${isActive('/') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Dashboard
                                </Link>
                                {isAdmin() && (
                                    <Link
                                        to="/create-poll"
                                        className={`text-sm font-semibold transition-colors ${isActive('/create-poll') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Create Poll
                                    </Link>
                                )}
                            </div>

                            <div className="flex items-center space-x-4 border-l border-white/10 pl-8">
                                <Link to="/profile" className="flex items-center space-x-3 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
                                    <div className={`w-8 h-8 rounded-lg ${isActive('/profile') ? 'bg-indigo-500/20 border-indigo-500' : 'bg-slate-800 border-white/5'} flex items-center justify-center text-xs font-bold text-indigo-400 border group-hover:border-indigo-500/50 transition-colors`}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`text-sm font-medium ${isActive('/profile') ? 'text-indigo-400' : 'text-slate-200'} hidden sm:inline group-hover:text-white transition-colors`}>
                                        {user.name}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-all border border-red-500/20 active:scale-95"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
