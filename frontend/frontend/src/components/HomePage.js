import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/useAuth';
import { LogOut, Star, Loader } from 'lucide-react';
import Login from './Login';
import { Register } from './Register';
import UserProfile from './UserProfile';
import ForumPage from './ForumPage';
import BusinessesPage from './BusinessesPage';
import DirectoryPage from './DirectoryPage';
import EventsPage from './EventsPage';
import { LoadingSpinner, ErrorMessage } from './common';
import {     usePosts   } from '../services/usePosts';
import {   useBusinesses  } from '../services/useBusinesses';
import {   useResources  } from '../services/useResources';
import {   useEvents  } from '../services/useEvents';


/**
 * This is the component that renders the home page of the website.
 * @param {Function} setActiveTab - Function to change the active tab in parent component
 * @returns 
 */
const HomePage = ({ setActiveTab }) => {
    const { user, logout } = useAuth();
    const { posts, fetchPosts} = usePosts();
    const { businesses, fetchBusinesses } = useBusinesses();
    const { resources, fetchResources } = useResources();
    const { events, fetchEvents } = useEvents();
    // Auth modal states
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    
    // Loading and error states
    const [loading, setLoading] = useState({
        posts: false,
        businesses: false,
        resources: false
    });
    const [error, setError] = useState(null);

    //const [posts, setPosts] = useState([]);
    //const [businesses, setBusinesses] = useState([]);
    //const [resources, setResources] = useState([]);
    //const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalBusinesses: 0,
        totalResources: 0,
        totalEvents: 0
      });
    
   const handleLogout = async () => {
        await logout();
        if (setActiveTab) {
            setActiveTab('home');
        }
    };

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

    const handleUserProfile = () => {
        if (setActiveTab) {
            setActiveTab('userProfile');
        }
    };
    
    // Handle navigation to different sections
    const handleViewAllDiscussions = () => {
        if (setActiveTab) {
            setActiveTab('forum');
        }
    };

    const handleViewAllBusinesses = () => {
        if (setActiveTab) {
            setActiveTab('businesses');
        }
    };

    const handleViewAllResources = () => {
        if (setActiveTab) {
            setActiveTab('directory');
        }
    };

    const handleViewAllEvents = () => {
        if (setActiveTab) {
            setActiveTab('events');
        }
    };
    // Initial data fetch
    useEffect(() => {
        fetchPosts();
        fetchBusinesses();
        fetchResources();
        fetchEvents();
    }, []);
    
    // Update stats when data changes 
    // Place the values to be updated in an array, this tells 
    // React when to re-run the useEffect code 
    useEffect(() => {
      setStats({
        totalMembers: 2847, // This would come from user count API
        totalBusinesses: businesses.length,
        totalResources: resources.length,
        totalEvents: events.length
      });
    }, [businesses.length, resources.length, events.length]);

    // Format date function// Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInHours < 48) return '1 day ago';
        return `${Math.floor(diffInHours / 24)} days ago`;
    };


    return (
        <div className="space-y-8">
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
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white p-8 rounded-lg">
                <h1 className="text-4xl font-bold mb-4">Welcome to Our African Community in Alberta</h1>
                <p className="text-xl mb-6">Connecting hearts, sharing stories, building bridges across Alberta's diverse African community.</p>
                {user ? (
                <div className="flex items-center gap-4">
                    <span className="text-lg">Welcome back, {user.username}!</span>
                    <button 
                    onClick={handleLogout}
                    className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                    <LogOut className="w-4 h-4" />
                    Logout
                    </button>
                </div>
                ) : (
                <div className="flex gap-4">
                    <button 
                    onClick={handleLogin}
                    className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                    Sign In
                    </button>
                    <button 
                    onClick={handleRegister}
                    className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                    >
                    Join Community
                    </button>
                </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.totalMembers.toLocaleString()}</div>
                <div className="text-gray-600">Community Members</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">{stats.totalBusinesses}</div>
                <div className="text-gray-600">Local Businesses</div>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.totalResources}</div>
                <div className="text-gray-600">Community Resources</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.totalEvents}</div>
                <div className="text-gray-600">Upcoming Events</div>
                </div>
            </div>

            {/* Recent Posts Preview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Recent Community Discussions</h2>
                {loading.posts ? (
                <LoadingSpinner />
                ) : error ? (
                <ErrorMessage message="Failed to load recent posts" onRetry={fetchPosts} />
                ) : (
                <div className="space-y-4">
                    {posts.slice(0, 3).map(post => (
                    <div key={post._id} className="border-l-4 border-green-500 pl-4 py-2">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <p className="text-gray-600 text-sm">{post.content.substring(0, 100)}...</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span onClick={handleUserProfile} className="cursor-pointer hover:text-green-600">{post.user?.username || 'Anonymous'}</span>
                        <span>{formatDate(post.createdAt)}</span>
                        <span>{post.upvotes || 0} upvotes</span>
                        <span>{post.comments?.length || 0} comments</span>
                        </div>
                    </div>
                    ))}
                </div>
                )}
                <button 
                onClick={handleViewAllDiscussions}
                className="mt-4 text-green-600 hover:text-green-700 font-semibold"
                >
                View All Discussions →
                </button>
            </div>

            {/* Featured Businesses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Featured Businesses</h2>
                {loading.businesses ? (
                <LoadingSpinner />
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {businesses.slice(0, 3).map(business => (
                    <div key={business._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-lg">{business.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{business.category}</p>
                        <p className="text-sm">{business.description}</p>
                        <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm">{business.rating || 4.5} ({business.reviews?.length || 0} reviews)</span>
                        </div>
                    </div>
                    ))}
                </div>
                )}
                <button 
                onClick={handleViewAllBusinesses}
                className="mt-4 text-green-600 hover:text-green-700 font-semibold"
                >
                Explore All Businesses →
                </button>
            </div>

            {/* Community Resources Preview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Community Resources</h2>
                {loading.resources ? (
                <LoadingSpinner />
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resources.slice(0, 3).map(resource => (
                    <div key={resource._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{resource.category}</p>
                        <p className="text-sm">{resource.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span>{resource.type}</span>
                        <span>•</span>
                        <span>{resource.address}</span>
                        </div>
                    </div>
                    ))}
                </div>
                )}
                <button 
                onClick={handleViewAllResources}
                className="mt-4 text-green-600 hover:text-green-700 font-semibold"
                >
                Browse All Resources →
                </button>
            </div>

            {/* Upcoming Events Preview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
                {loading.events ? (
                <LoadingSpinner />
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {events.slice(0, 3).map(event => (
                    <div key={event._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{event.category}</p>
                        <p className="text-sm">{event.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{event.location.address}</span>
                        </div>
                    </div>
                    ))}
                </div>
                )}
                <button 
                onClick={handleViewAllEvents}
                className="mt-4 text-green-600 hover:text-green-700 font-semibold"
                >
                View All Events →
                </button>
            </div>
        </div>
  )
};

export default HomePage;