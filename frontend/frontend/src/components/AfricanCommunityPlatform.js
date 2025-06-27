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
  
  /*// Loading and error states
  const [loading, setLoading] = useState({
    posts: false,
    businesses: false,
    resources: false
  }); */
  const [error, setError] = useState(null);
 /*
  // Data states
  const [posts, setPosts] = useState([]);
  // used in the ForumPage component
  const [businesses, setBusinesses] = useState([]);
  // used in the BusinessesPage component
  const [resources, setResources] = useState([]);
  // used in the DirectoryPage component
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalBusinesses: 0,
    totalResources: 0,
    totalEvents: 0
  }); // used in the HomePage component

  // Form states : This is used in the ForumPage component
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  */
  const navigation = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'forum', name: 'Forum', icon: MessageSquare },
    { id: 'directory', name: 'Directory', icon: MapPin },
    { id: 'businesses', name: 'Businesses', icon: Building2 },
    { id: 'events', name: 'Events', icon: Calendar }
  ];
  /* // This is already used in the ForumPage component
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'newcomers', name: 'Newcomers' },
    { id: 'events', name: 'Events' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'housing', name: 'Housing' },
    { id: 'jobs', name: 'Jobs' },
    { id: 'general', name: 'General Discussion' }
  ];
  */
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
  };

  // Fetch data functions
  const fetchPosts = async () => {
    try {
      setLoading(prev => ({ ...prev, posts: true }));
      const response = await postsService.getAllPosts();
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(prev => ({ ...prev, posts: false }));
    }
  };

  const fetchBusinesses = async () => {
    try {
      setLoading(prev => ({ ...prev, businesses: true }));
      const response = await businessService.getAllBusinesses();
      setBusinesses(response.data);
    } catch (err) {
      setError('Failed to fetch businesses');
      console.error('Error fetching businesses:', err);
    } finally {
      setLoading(prev => ({ ...prev, businesses: false }));
    }
  };

  const fetchResources = async () => {
    try {
      setLoading(prev => ({ ...prev, resources: true }));
      const response = await resourcesService.getAllResources();
      setResources(response.data);
    } catch (err) {
      setError('Failed to fetch resources');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(prev => ({ ...prev, resources: false }));
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPosts();
    fetchBusinesses();
    fetchResources();
  }, []);

  // Update stats when data changes
  useEffect(() => {
    setStats({
      totalMembers: 2847, // This would come from user count API
      totalBusinesses: businesses.length,
      totalResources: resources.length,
      totalEvents: 34 // This would come from events API
    });
  }, [businesses.length, resources.length]);

  // Handle post creation
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLogin(true);
      return;
    }

    try {
      const response = await postsService.createPost(newPost);
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', content: '', category: 'general' });
      setShowCreatePost(false);
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
    }
  };

  // Handle voting
  const handleVote = async (postId, voteType) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    try {
      await postsService.votePost(postId, voteType);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, upvotes: post.upvotes + (voteType === 'up' ? 1 : -1) }
          : post
      ));
    } catch (err) {
      setError('Failed to vote');
      console.error('Error voting:', err);
    }
  };

  // Filter functions
  const filteredPosts = posts.filter(post => 
    (selectedCategory === 'all' || post.category === selectedCategory) &&
    (searchTerm === '' || 
     post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     post.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBusinesses = businesses.filter(business =>
    searchTerm === '' || 
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResources = resources.filter(resource =>
    searchTerm === '' || 
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader className="w-8 h-8 animate-spin text-green-600" />
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-600 mb-2">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="text-red-700 hover:text-red-800 font-semibold"
        >
          Try Again
        </button>
      )}
    </div>
  );
*/
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