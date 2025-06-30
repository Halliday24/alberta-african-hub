
// frontend/src/components/EventsPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/useAuth'; // Custom authentication hook
import { Plus, Calendar, Clock, MapPin } from 'lucide-react'; // lucide-react icons
import { eventService } from '../services';


const EventsPage = () => {
    // get the user from the authentication context
    const { user, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [events, setEvents] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

      // Loading and error states
      const [loading, setLoading] = useState({
        posts: false,
        businesses: false,
        resources: false,
        events: false
    });

    const [error, setError] = useState(null);
    /**
     * This function would typically fetch events from an API and render them here.
     */
    const fetchEvents = async () => {
        try {
            setLoading(prev => ({ ...prev, events: true }));
            const response = await eventService.getAllEvents();
            console.log(response.data);
            setEvents(response.data.events);
        } catch (err) {
            setError('Failed to fetch events');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(prev => ({ ...prev, events: false }));
        }
    }


    
    
    const filteredEvents = events.filter(event =>
        searchTerm === '' || 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Initial data fetch
    useEffect(() => {
        fetchEvents();
    }, []);

    return (
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


        {/* Events Grid 
        {loading.resources ? (
            <LoadingSpinner />
        ) : error ? (
            <ErrorMessage message="Failed to load events" onRetry={fetchResources} />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? filteredEvents.map(event => (
                <div key={event._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-4">
                    <div>
                    <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
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
                No events found. Try a different search term.
                </div>
            )}
            </div>
        )}
        */}

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
}
export default EventsPage;