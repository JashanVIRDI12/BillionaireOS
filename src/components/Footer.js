import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Mail, Twitter, Github, Clock } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';

const Footer = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const { getCurrentTime, getTimezoneInfo } = useLocation();
  const [currentTime, setCurrentTime] = useState('');
  
  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTime('time'));
    };
    
    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [getCurrentTime]);
  
  const timezoneInfo = getTimezoneInfo();

  return (
    <footer className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-100/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.div 
              className="flex items-center space-x-3 mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                  Billionaire OS
                </h3>
                <p className="text-xs text-gray-500 font-medium -mt-0.5">
                  Personal Intelligence Suite
                </p>
              </div>
            </motion.div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              Empowering individuals with AI-powered productivity tools and intelligence insights 
              to achieve their personal and professional goals.
            </p>
          </div>

          {/* Productivity Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Productivity</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate('vision')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                >
                  Journal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('goals')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                >
                  Goals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('habits')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                >
                  Habits
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('networth')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                >
                  Net Worth
                </button>
              </li>
            </ul>
          </div>

          {/* Intelligence Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Intelligence</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate('business')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                >
                  Business Intelligence
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('profession')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-left"
                >
                  Career Intelligence
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright and Legal Links */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>© {currentYear} Billionaire OS</span>
                  <span>•</span>
                  <span>All rights reserved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>•</span>
                  <button 
                    onClick={() => onNavigate('privacy')}
                    className="text-gray-600 hover:text-gray-900 transition-colors underline-offset-2 hover:underline"
                  >
                    Privacy Policy
                  </button>
                  <span>•</span>
                  <button 
                    onClick={() => onNavigate('terms')}
                    className="text-gray-600 hover:text-gray-900 transition-colors underline-offset-2 hover:underline"
                  >
                    Terms & Conditions
                  </button>
                </div>
              </div>
              
              {/* Live Time Display */}
              {timezoneInfo && (
                <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  {/* <span className="font-medium">{currentTime}</span>
                  <span>•</span> */}
                  <span>{timezoneInfo.timezoneShort || timezoneInfo.offsetString}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Website"
              >
                <Globe className="w-4 h-4 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
