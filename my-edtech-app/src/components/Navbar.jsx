import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import axios from 'axios';


export default function Navbar() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.get('/api/users/logout');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-semibold text-black tracking-wide"
          >
            Edu
            <span className='text-orange-500'>tech</span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-500 font-medium">Home</Link>
            <Link to="/courses" className="text-gray-700 hover:text-orange-500 font-medium">Courses</Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-500 font-medium">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-500 font-medium">Contact</Link>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-orange-500 font-medium"
                >
                  Dashboard
                </Link>

                

                {user.role === 'instructor' && (
                  <Link
                    to="/create-course"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Create Course
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
