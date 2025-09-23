import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings, ChevronDown, Globe, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
const ProfileDropdown = ({ onLocationSettingsClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { location, getCountryName, getCurrencySymbol } = useLocation();

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

  const handleLocationSettings = () => {
    setIsOpen(false);
    if (onLocationSettingsClick) {
      onLocationSettingsClick();
    }
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
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center space-x-3 px-4 py-2.5 rounded-full hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
      >
        {/* Profile Avatar */}
        <div className="relative">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-9 h-9 rounded-full object-cover shadow-sm border-2 border-gray-100"
            />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-gray-900 to-black text-white rounded-full flex items-center justify-center text-sm font-medium shadow-sm">
              {getInitials()}
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        {/* Name and Chevron */}
        <div className="hidden sm:flex items-center space-x-2">
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900 max-w-24 truncate">
              {getDisplayName()}
            </div>
            <div className="text-xs text-gray-500">
              {location ? getCountryName() : 'Set location'}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-14 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-black text-white rounded-full flex items-center justify-center font-medium shadow-sm">
                      <span className="text-lg">{getInitials()}</span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {user?.email || user?.phoneNumber || 'Signed in'}
                  </p>
                  {location && (
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {getCountryName()} • {getCurrencySymbol()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 w-full px-6 py-3 text-sm text-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Profile</div>
                  <div className="text-xs text-gray-500">Manage your account</div>
                </div>
              </motion.button>
              
              <motion.button
                onClick={handleLocationSettings}
                whileHover={{ backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between w-full px-6 py-3 text-sm text-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Location</div>
                    <div className="text-xs text-gray-500">
                      {location ? `${getCountryName()}` : 'Not set'}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
              </motion.button>
              
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 w-full px-6 py-3 text-sm text-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-gray-500">Preferences & privacy</div>
                </div>
              </motion.button>
              
              <div className="border-t border-gray-100 my-2"></div>
              
              <motion.button
                onClick={handleLogout}
                whileHover={{ backgroundColor: "#fef2f2" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 w-full px-6 py-3 text-sm text-red-600 transition-colors"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Sign out</div>
                  <div className="text-xs text-red-400">End your session</div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProfileDropdown;