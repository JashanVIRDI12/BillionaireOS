import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    if (user?.phoneNumber) return user.phoneNumber;
    return 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Profile Avatar */}
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            getInitials()
          )}
        </div>
        
        {/* Name and Chevron */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
            {getDisplayName()}
          </span>
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-medium">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    getInitials()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || user?.phoneNumber || 'Signed in'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;