import React, { useState } from 'react';
import { useAuth } from '../services/useAuth'; // Custom authentication hoo
import { Home, 
  MessageSquare, 
  MapPin, 
  Building2, 
  Calendar
} from "lucide-react"
/*
This is the navigation component for the Alberta African Hub website. 
It includes a mobile menu that is hidden on larger screens. 
The navigation links are defined in the `navigation` array. 
The `useAuth` hook is used to handle user authentication.

The issue here is that it needs a global variable to keep track of the active tab.
I'm not sure how to do this with React.

*/
const Navigation = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
      
    const navigation = [
        { id: 'home', name: 'Home', icon: Home },
        { id: 'forum', name: 'Forum', icon: MessageSquare },
        { id: 'directory', name: 'Directory', icon: MapPin },
        { id: 'businesses', name: 'Businesses', icon: Building2 },
        { id: 'events', name: 'Events', icon: Calendar }
    ];

    // Auth modal states
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    // load error state
    const [error, setError] = useState(null);

    // Auth handlers
    const handleLogin = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    return (
        <div className={`lg:w-64 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Sidebar Navigation */}
        <nav className="bg-white rounded-lg shadow-sm p-4">
            <ul className="space-y-2">
            {navigation.map(item => {
                const Icon = item.icon;
                return (
                <li key={item.id}>
                    <button
                    onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setError(null);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    >
                    <Icon className="w-5 h-5" />
                    {item.name}
                    </button>
                </li>
                );
            })}
            </ul>
            
            {/* Mobile Auth Buttons */}
            {!user && (
            <div className="mt-4 pt-4 border-t border-gray-200 md:hidden">
                <div className="space-y-2">
                <button 
                    onClick={handleLogin}
                    className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    Sign In
                </button>
                <button 
                    onClick={handleRegister}
                    className="w-full text-left px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    Join Community
                </button>
                </div>
            </div>
            )}
        </nav>
        </div>
    )

}

export default Navigation;