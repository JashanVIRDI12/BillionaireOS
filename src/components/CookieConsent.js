import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set('cookie_consent', 'accepted', { expires: 365 });
    setShowConsent(false);
  };

  const declineCookies = () => {
    Cookies.set('cookie_consent', 'declined', { expires: 365 });
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-lg z-50"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                We use cookies to enhance your experience, provide authentication, and analyze our traffic. 
                By clicking "Accept", you consent to our use of cookies.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={declineCookies}
                className="px-4 py-2 text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={acceptCookies}
                className="px-4 py-2 text-sm bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all duration-200"
              >
                Accept Cookies
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;