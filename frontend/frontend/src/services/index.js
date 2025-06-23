import api from './api';

// Auth Services
export const authService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
};

// Posts Services
export const postsService = {
  getAllPosts: () => api.get('/posts'),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  votePost: (id, voteType) => api.post(`/posts/${id}/vote`, { voteType }),
};

// Comments Services
export const commentsService = {
  getCommentsByPost: (postId) => api.get(`/comments/post/${postId}`),
  createComment: (commentData) => api.post('/comments', commentData),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

// Business Services
export const businessService = {
  getAllBusinesses: () => api.get('/businesses'),
  getBusinessById: (id) => api.get(`/businesses/${id}`),
  createBusiness: (businessData) => api.post('/businesses', businessData),
  updateBusiness: (id, businessData) => api.put(`/businesses/${id}`, businessData),
  deleteBusiness: (id) => api.delete(`/businesses/${id}`),
};

// Resources Services
export const resourcesService = {
  getAllResources: () => api.get('/resources'),
  getResourcesByType: (type) => api.get(`/resources/type/${type}`),
  createResource: (resourceData) => api.post('/resources', resourceData),
  updateResource: (id, resourceData) => api.put(`/resources/${id}`, resourceData),
  deleteResource: (id) => api.delete(`/resources/${id}`),
};

export const eventService = {
  getAllEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  rsvpToEvent: (id, status) => api.post(`/events/${id}/rsvp`, { status }),
  getMyOrganizedEvents: () => api.get('/events/my/organized'),
  getMyAttendingEvents: () => api.get('/events/my/attending'),
};
