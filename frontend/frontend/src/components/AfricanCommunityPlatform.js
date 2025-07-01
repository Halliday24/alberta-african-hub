// frontend/src/components/AfricanCommunityPlatform.js
import React, { useState, useEffect } from 'react';
import { 
  Home, MessageSquare, MapPin, Building2, Calendar } from 'lucide-react'; // lucide-react icons
/*Search, User, Menu, X, ChevronUp, ChevronDown, 
  MessageCircle, Clock, Star, Phone, Mail, Globe, 
  Plus, Loader, LogOut (already imported in the components it's used)
} from 'lucide-react'; // lucide-react icons*/
import { useAuth } from '../services/useAuth';
// import { postsService, businessService, resourcesService } from '../services';
import Login from './Login';
import { Register } from './Register';
import EventsPage from './EventsPage'; // event page tab
import Header from './Header'; // header component
import HomePage from './HomePage'; // home page tab
import ForumPage from './ForumPage'; // forum page tab
import DirectoryPage from './DirectoryPage'; // directory page tab
import BusinessesPage from './BusinessesPage'; // business page tab

const AfricanCommunityPlatform = () => {
  // used by Navbar component
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Auth modal states
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState(null);
  const navigation = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'forum', name: 'Forum', icon: MessageSquare },
    { id: 'directory', name: 'Directory', icon: MapPin },
    { id: 'businesses', name: 'Businesses', icon: Building2 },
    { id: 'events', name: 'Events', icon: Calendar }
  ];
  
  // Auth handlers
  const handleLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeAuthModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };
  /*
  const handleLogout = async () => {
    await logout();
    setActiveTab('home');
  };*/


  // all the render functions were once here
  /**
   * This renders the components based on the active tab
   * Might consider React Routing for better code organization
   * @returns 
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      //renderHome();
      case 'forum': return <ForumPage />;
      //renderForum();
      case 'directory': return <DirectoryPage />;
      //renderDirectory();
      case 'businesses': return <BusinessesPage />;
      //renderBusinesses();
      case 'events': return <EventsPage />;
      //renderEvents();
      default: return <HomePage />;
      //renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Header */}
      <Header /> 

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className={`lg:w-64 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
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

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfricanCommunityPlatform;