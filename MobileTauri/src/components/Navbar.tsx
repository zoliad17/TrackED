import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-[#800000] shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            
            <span className="text-white font-bold text-lg font-['Space_Mono']">TrackEd</span>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/classes"
              className={`text-white hover:text-gray-200 px-3 py-2 rounded-md ${
                location.pathname === '/classes' ? 'bg-red-900' : ''
              }`}
            >
              Classes
            </Link>
            <Link
              to="/logout"
              className={`text-white hover:text-gray-200 px-3 py-2 rounded-md ${
                location.pathname === '/logout' ? 'bg-red-900' : ''
              }`}
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;