import { useState, useEffect } from 'react';
import { postsService } from '../services';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsService.getAllPosts();
      setPosts(response.data.posts);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await postsService.createPost(postData);
      setPosts([response.data, ...posts]);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create post');
      
    }
  };

  const votePost = async (postId, voteType) => {
    try {
      await postsService.votePost(postId, voteType);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, upvotes: post.upvotes + (voteType === 'up' ? 1 : -1) }
          : post
      ));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to vote');
    }
  };

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    votePost,
  };
};