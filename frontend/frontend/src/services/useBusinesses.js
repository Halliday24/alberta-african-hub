import { useState, useEffect } from 'react';
import { businessService } from '../services';

export const useBusinesses = () => {

  // Businesses state
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusinesses = async () => {
    try {
        setLoading(true);
        const response = await businessService.getAllBusinesses();

        // Add a 500ms delay before setting data (adjust time as needed)
        //await new Promise(resolve => setTimeout(resolve, 500));
        setBusinesses(response.data.businesses);
        } catch (err) {
        setError('Failed to fetch businesses');
        console.error('Error fetching businesses:', err);
        } finally {
            setLoading(false);
        }
    };

    /* // Initial data fetch
     useEffect(() => {
        fetchBusinesses();
    }, []); */

  return {
    businesses,
    loading,
    error,
    fetchBusinesses
  };
};