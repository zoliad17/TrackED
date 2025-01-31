import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RootLayout() {
const [isAuthenticated, setIsAuthenticated] = useState(null);
const [fontsLoaded, setFontsLoaded] = useState(false);
const navigate = useNavigate();

  // Load fonts
useEffect(() => {
    // Load Montserrat font from Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    link.onload = () => setFontsLoaded(true);
    return () => document.head.removeChild(link);
}, []);

  // Check authentication status
useEffect(() => {
    checkAuthStatus();
}, []);

const checkAuthStatus = () => {
    try {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
    } catch (error) {
    console.error('Error checking auth status:', error);
    setIsAuthenticated(false);
    }
};

  // Handle initial navigation
useEffect(() => {
    if (fontsLoaded && isAuthenticated !== null) {
    if (!isAuthenticated) {
        navigate('/login');
    }
    }
}, [fontsLoaded, isAuthenticated, navigate]);

  // Show nothing while loading
if (!fontsLoaded || isAuthenticated === null) {
    return null;
}

return (
    <div className="min-h-screen bg-white">
    {isAuthenticated && (
        <header className="border-b border-gray-200 bg-white shadow-sm">
            <div className="px-4 py-3">
            <h1 
            style={{ fontFamily: 'Montserrat' }}
            className="text-2xl font-semibold text-center text-[#1a365d]"
            >
            TrackEd
            </h1>
        </div>
        </header>
    )}
      {/* Outlet for React Router */}
    <main>
        {/* Router outlet will be rendered here */}
    </main>
    </div>
);
}