import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/useAuth';
import { resourcesService } from '../services';
import { Star, MapPin, Phone, Clock, Loader } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from './common';



/**
 * This is the component that renders the directory and resources
 * page. It fetches the resources from the backend and displays them
 * @returns 
 */
const DirectoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [resources, setResources] = useState([]);        
    
    // Loading and error states
    const [loading, setLoading] = useState({
        posts: false,
        businesses: false,
        resources: false
    });
    const [error, setError] = useState(null);
        
    
    const filteredResources = resources.filter(resource =>
        searchTerm === '' || 
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchResources = async () => {
        try {
          setLoading(prev => ({ ...prev, resources: true }));
          const response = await resourcesService.getAllResources();
          setResources(response.data.resources);
        } catch (err) {
          setError('Failed to fetch resources');
          console.error('Error fetching resources:', err);
        } finally {
          setLoading(prev => ({ ...prev, resources: false }));
        }
    };

    
     // Initial data fetch
     useEffect(() => {
        fetchResources();
    }, []);

    return (
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
    )
};

export default DirectoryPage;