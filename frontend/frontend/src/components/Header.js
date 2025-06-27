// Header component for the frontend application

import React, { useState } from 'react';
import { useAuth } from '../services/useAuth'; // Custom authentication hook
import { LogOut, Menu, X, Search } from 'lucide-react';
import Login from './Login';
import { Register } from './Register';

/**
 * 
 * @returns Header component that displays the site logo, title, search bar, and user authentication options.
 * It includes responsive design for mobile and desktop views.
 */
const Header = () => {
    const { user, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    // ActiveTab looks like a global variable for multiple components
    const [activeTab, setActiveTab] = useState('home');
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

     // Auth modal states
      const [showLogin, setShowLogin] = useState(false);
      const [showRegister, setShowRegister] = useState(false);
    
    // Auth handlers
    const handleLogin = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

   const handleLogout = async () => {
        await logout();
        setActiveTab('home');
    };

    
  const closeAuthModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };


    return (
               
        <header className="bg-white shadow-sm border-b">
            {/* Authentication Modals */}
            {/* show Login Modal if the function is called*/}

            {showLogin && (
                <Login 
                onClose={closeAuthModals} 
                switchToRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }} 
                />
            )}
            
            {/* show Register Modal if the function is called*/}
            {showRegister && (
                <Register 
                onClose={closeAuthModals} 
                switchToLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }} 
                />
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-yellow-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">African Community Alberta</h1>
                    <p className="text-sm text-gray-500">Connecting Our Community</p>
                </div>
                </div>
                
                <div className="hidden md:flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {user ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                        <button 
                        onClick={handleLogout}
                        className="p-2 text-gray-600 hover:text-gray-900 flex items-center gap-1"
                        title="Logout"
                        >
                        <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                    ) : (
                    <div className="flex items-center gap-2">
                        <button 
                        onClick={handleLogin}
                        className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded"
                        >
                        Sign In
                        </button>
                        <button 
                        onClick={handleRegister}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                        >
                        Join
                        </button>
                    </div>
                    )}
                </div>
                </div>

                <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
            </div>
        </header>
    )
}

export default Header;