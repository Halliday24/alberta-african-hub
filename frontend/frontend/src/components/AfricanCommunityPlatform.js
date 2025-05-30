// frontend/src/components/AfricanCommunityPlatform.js
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MessageSquare, 
  MapPin, 
  Building2, 
  Calendar, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronUp, 
  ChevronDown, 
  MessageCircle, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  Globe,
  Plus,
  Loader,
  LogOut
} from 'lucide-react';
import { useAuth } from '../services/useAuth';
import { postsService, businessService, resourcesService } from '../services';
import Login from './Login';
import { Register } from './Register';

const AfricanCommunityPlatform = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
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

  // Data states
  const [posts, setPosts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalBusinesses: 0,
    totalResources: 0,
    totalEvents: 0
  });

  // Form states
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  const navigation = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'forum', name: 'Forum', icon: MessageSquare },
    { id: 'directory', name: 'Directory', icon: MapPin },
    { id: 'businesses', name: 'Businesses', icon: Building2 },
    { id: 'events', name: 'Events', icon: Calendar }
  ];

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'newcomers', name: 'Newcomers' },
    { id: 'events', name: 'Events' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'housing', name: 'Housing' },
    { id: 'jobs', name: 'Jobs' },
    { id: 'general', name: 'General Discussion' }
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

  const renderHome = () => (
    <div className="space-y-8">
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
                  <span>{post.user?.username || 'Anonymous'}</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <span>{post.upvotes || 0} upvotes</span>
                  <span>{post.comments?.length || 0} comments</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <button 
          onClick={() => setActiveTab('forum')}
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
          onClick={() => setActiveTab('businesses')}
          className="mt-4 text-green-600 hover:text-green-700 font-semibold"
        >
          Explore All Businesses →
        </button>
      </div>
    </div>
  );

  const renderForum = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        <button 
          onClick={() => user ? setShowCreatePost(true) : setShowLogin(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Post
        </button>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                type="text"
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                placeholder="Post content"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 h-32 resize-none"
                required
              />
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {categories.filter(cat => cat.id !== 'all').map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts */}
      {loading.posts ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message="Failed to load posts" onRetry={fetchPosts} />
      ) : (
        <div className="space-y-4">
          {filteredPosts.length > 0 ? filteredPosts.map(post => (
            <div key={post._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1">
                  <button 
                    onClick={() => handleVote(post._id, 'up')}
                    className="p-1 hover:bg-gray-100 rounded"
                    disabled={!user}
                  >
                    <ChevronUp className="w-5 h-5 text-gray-500 hover:text-green-600" />
                  </button>
                  <span className="font-semibold text-lg">{post.upvotes || 0}</span>
                  <button 
                    onClick={() => handleVote(post._id, 'down')}
                    className="p-1 hover:bg-gray-100 rounded"
                    disabled={!user}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500 hover:text-red-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.user?.username || 'Anonymous'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments?.length || 0} comments
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              No posts found. {selectedCategory !== 'all' && 'Try changing the category filter.'}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderDirectory = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Community Directory</h1>
      
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search churches, grocery stores, and resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Resources Grid */}
      {loading.resources ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message="Failed to load resources" onRetry={fetchResources} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.length > 0 ? filteredResources.map(resource => (
            <div key={resource._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{resource.name}</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mt-1">
                    {resource.type === 'church' ? 'Church' : 'Grocery Store'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm">{resource.rating || 4.5}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{resource.address}</span>
                </div>
                {resource.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{resource.phone}</span>
                  </div>
                )}
                {resource.hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{resource.hours}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">{resource.reviews?.length || 0} reviews</span>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No resources found. Try a different search term.
            </div>
          )}
        </div>
      )}

      {/* Map Placeholder */}
      <div className="bg-gray-200 rounded-lg p-8 text-center">
        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Interactive Map</h3>
        <p className="text-gray-500">Visual representation of nearby resources and businesses</p>
        <p className="text-sm text-gray-400 mt-2">(Google Maps integration will be implemented)</p>
      </div>
    </div>
  );

  const renderBusinesses = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-3xl font-bold">African-Owned Businesses</h1>
        <button 
          onClick={() => user ? alert('Business listing form coming soon!') : setShowLogin(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          List Your Business
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search businesses by name, category, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Business Grid */}
      {loading.businesses ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message="Failed to load businesses" onRetry={fetchBusinesses} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBusinesses.length > 0 ? filteredBusinesses.map(business => (
            <div key={business._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{business.name}</h3>
                  <p className="text-gray-600">by {business.owner}</p>
                  <span className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full mt-1">
                    {business.category}
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm">{business.rating || 4.5}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{business.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{business.address}</span>
                </div>
                {business.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{business.email}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{business.website}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-500">{business.reviews?.length || 0} reviews</span>
                <button className="text-green-600 hover:text-green-700 font-semibold text-sm">
                  View Details
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No businesses found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-3xl font-bold">Community Events</h1>
        <button 
          onClick={() => user ? alert('Event creation form coming soon!') : setShowLogin(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Sample Events - would be replaced with real API data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">African Heritage Month Celebration</h3>
            <p className="text-gray-700">Join us for an evening of music, dance, and cultural celebration</p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>June 15, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>6:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Calgary Community Centre</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">234 attending</span>
              <button 
                onClick={() => user ? alert('RSVP functionality coming soon!') : setShowLogin(true)}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
              >
                RSVP
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Business Networking Mixer</h3>
            <p className="text-gray-700">Connect with African entrepreneurs and business owners</p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>June 22, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>7:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Edmonton Chamber of Commerce</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">89 attending</span>
              <button 
                onClick={() => user ? alert('RSVP functionality coming soon!') : setShowLogin(true)}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
              >
                RSVP
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Newcomer Orientation Workshop</h3>
            <p className="text-gray-700">Essential information for new arrivals to Alberta</p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>June 28, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>2:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Calgary Settlement Services</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">156 attending</span>
              <button 
                onClick={() => user ? alert('RSVP functionality coming soon!') : setShowLogin(true)}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
              >
                RSVP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHome();
      case 'forum': return renderForum();
      case 'directory': return renderDirectory();
      case 'businesses': return renderBusinesses();
      case 'events': return renderEvents();
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Authentication Modals */}
      {showLogin && (
        <Login 
          onClose={closeAuthModals} 
          switchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }} 
        />
      )}
      
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
      <header className="bg-white shadow-sm border-b">
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