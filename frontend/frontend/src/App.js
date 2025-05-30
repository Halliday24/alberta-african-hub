import React from 'react';
import { AuthProvider } from './services/useAuth';
import AfricanCommunityPlatform from './components/AfricanCommunityPlatform';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AfricanCommunityPlatform />
        <h1 className="text-4xl text-red-500">Tailwind is working!</h1>

      </div>
    </AuthProvider>
  );
}

export default App;
