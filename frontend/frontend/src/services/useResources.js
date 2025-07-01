import { useState } from 'react';
import { resourcesService } from '../services';

export const useResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchResources = async () => {
        try {
          setLoading(true);
          const response = await resourcesService.getAllResources();
          setResources(response.data.resources);
        } catch (err) {
          setError('Failed to fetch resources');
          console.error('Error fetching resources:', err);
        } finally {
          setLoading(false);
        }
    };


    return {
        resources,
        loading,
        error,
        fetchResources
    };
};