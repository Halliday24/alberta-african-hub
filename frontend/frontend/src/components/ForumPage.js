
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/useAuth';
import {Plus, Loader, Clock, MessageCircle, User
, ChevronUp, ChevronDown
} from 'lucide-react';
import { postsService } from '../services';
import { LoadingSpinner, ErrorMessage } from './common';
import {   usePosts  } from '../services/usePosts';

const ForumPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const { user, logout } = useAuth();
    const {
        posts,
        loading,
        error,
        fetchPosts,
        createPost,
        votePost,
      } = usePosts();
    // Auth modal states
    const [showLogin, setShowLogin] = useState(false);
    // Loading and error states
    /*const [loading, setLoading] = useState({
        posts: false,
        businesses: false,
        resources: false
    });*/
    //const [error, setError] = useState(null);
    

    //const [posts, setPosts] = useState([]);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        category: 'general'
    });

    const categories = [
        { id: 'all', name: 'All Posts' },
        { id: 'newcomers', name: 'Newcomers' },
        { id: 'events', name: 'Events' },
        { id: 'food', name: 'Food & Dining' },
        { id: 'housing', name: 'Housing' },
        { id: 'jobs', name: 'Jobs' },
        { id: 'general', name: 'General Discussion' }
    ];
    
    // Fetch posts
    /*const fetchPosts2 = async () => {
        try {
          setLoading(prev => ({ ...prev, posts: true }));
          const response = await postsService.getAllPosts();
          setPosts(response.data.posts);
        } catch (err) {
          setError('Failed to fetch posts');
          console.error('Error fetching posts:', err);
        } finally {
          setLoading(prev => ({ ...prev, posts: false }));
        }
      };*/
    
    // Handle post creation
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!user) {
        setShowLogin(true);
        return;
        }

        try {
            const response = await postsService.createPost(newPost);
            //setPosts([response.data, ...posts]);
            setNewPost({ title: '', content: '', category: 'general' });
            setShowCreatePost(false);
        } catch (err) {
            //setError('Failed to create post');
            console.error('Error creating post:', err);
        }
    };

    // Handle voting
    /*const handleVote = async (postId, voteType) => {
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
    };*/

    // Filter functions
    const filteredPosts = posts.filter(post => 
        (selectedCategory === 'all' || post.category === selectedCategory) &&
        (searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

    
     // Initial data fetch
     useEffect(() => {
        fetchPosts();
    }, []);

    return (
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
                        onClick={() => votePost(post._id, 'up')}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={!user}
                    >
                        <ChevronUp className="w-5 h-5 text-gray-500 hover:text-green-600" />
                    </button>
                    <span className="font-semibold text-lg">{post.upvotes || 0}</span>
                    <button 
                        onClick={() => votePost(post._id, 'down')}
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
};

export default ForumPage;