 // Initial code from main component
 /*// Loading spinner component
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
import  { Loader } from "lucide-react";
/**
 * These are the common components that are used across the application.
 * @returns 
 */
// Loading spinner component
export const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader className="w-8 h-8 animate-spin text-green-600" />
        </div>
    );
}

// Error message component
export const ErrorMessage = ({ message, onRetry }) => {
    return (
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
    )
};

