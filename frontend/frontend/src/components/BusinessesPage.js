
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/useAuth';
import { Plus, Star, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from './common';
import {   useBusinesses  } from '../services/useBusinesses';
import { businessService } from '../services';

const BusinessesPage = () => {
    //console.log(activeTab);

    const [searchTerm, setSearchTerm] = useState('');
    
    const { user, logout } = useAuth();
    // Auth modal states
    const [showLogin, setShowLogin] = useState(false);
    
    // Loading and error states
    /*const [loading, setLoading] = useState({
        posts: false,
        businesses: false,
        resources: false
    });*/
    // const [error, setError] = useState(null);
    
    // Businesses state
    // const [businesses, setBusinesses] = useState([]);
    const {
        businesses,
        loading,
        error,
        fetchBusinesses
      } = useBusinesses();
    const filteredBusinesses = businesses.filter(business =>
        searchTerm === '' || 
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /*const fetchBusinesses2 = async () => {
        try {
          setLoading(prev => ({ ...prev, businesses: true }));
          const response = await businessService.getAllBusinesses();

          // Add a 500ms delay before setting data (adjust time as needed)
          //await new Promise(resolve => setTimeout(resolve, 500));
          setBusinesses(response.data.businesses);
        } catch (err) {
          setError('Failed to fetch businesses');
          console.error('Error fetching businesses:', err);
        } finally {
          setLoading(prev => ({ ...prev, businesses: false }));
        }
    };*/

     // Initial data fetch
     useEffect(() => {
        fetchBusinesses();
    }, []);

    return (
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
                    <p className="text-gray-600">by {business.owner.username}</p>
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
    )
};


export default BusinessesPage;