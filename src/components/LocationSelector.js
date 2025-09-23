import React, { useState } from 'react';
import { Globe, Search, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const LocationSelector = ({ onLocationSelect, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const countries = [
    { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
    { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
    { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$' },
    { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$' },
    { code: 'DE', name: 'Germany', currency: 'EUR', symbol: '€' },
    { code: 'FR', name: 'France', currency: 'EUR', symbol: '€' },
    { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥' },
    { code: 'SG', name: 'Singapore', currency: 'SGD', symbol: 'S$' },
    { code: 'AE', name: 'United Arab Emirates', currency: 'AED', symbol: 'د.إ' },
    { code: 'CH', name: 'Switzerland', currency: 'CHF', symbol: 'CHF' },
    { code: 'NL', name: 'Netherlands', currency: 'EUR', symbol: '€' },
    { code: 'SE', name: 'Sweden', currency: 'SEK', symbol: 'kr' },
    { code: 'NO', name: 'Norway', currency: 'NOK', symbol: 'kr' },
    { code: 'DK', name: 'Denmark', currency: 'DKK', symbol: 'kr' },
    { code: 'BR', name: 'Brazil', currency: 'BRL', symbol: 'R$' },
    { code: 'MX', name: 'Mexico', currency: 'MXN', symbol: '$' },
    { code: 'AR', name: 'Argentina', currency: 'ARS', symbol: '$' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R' },
    { code: 'KR', name: 'South Korea', currency: 'KRW', symbol: '₩' },
    { code: 'CN', name: 'China', currency: 'CNY', symbol: '¥' },
    { code: 'HK', name: 'Hong Kong', currency: 'HKD', symbol: 'HK$' },
    { code: 'TW', name: 'Taiwan', currency: 'TWD', symbol: 'NT$' },
    { code: 'TH', name: 'Thailand', currency: 'THB', symbol: '฿' },
    { code: 'MY', name: 'Malaysia', currency: 'MYR', symbol: 'RM' },
    { code: 'ID', name: 'Indonesia', currency: 'IDR', symbol: 'Rp' },
    { code: 'PH', name: 'Philippines', currency: 'PHP', symbol: '₱' },
    { code: 'VN', name: 'Vietnam', currency: 'VND', symbol: '₫' },
    { code: 'NZ', name: 'New Zealand', currency: 'NZD', symbol: 'NZ$' },
    { code: 'IL', name: 'Israel', currency: 'ILS', symbol: '₪' }
  ];

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const handleConfirm = async () => {
    if (selectedCountry && !isUpdating) {
      setIsUpdating(true);
      try {
        await onLocationSelect(selectedCountry);
      } catch (error) {
        console.error('Error selecting location:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-lg font-light text-gray-900">Select Your Location</h2>
              <p className="text-sm sm:text-xs text-gray-500">Choose your country for personalized experience</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 sm:pl-10 pr-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* Country List */}
        <div className="overflow-y-auto max-h-80 sm:max-h-64 p-2 sm:p-2">
          {filteredCountries.map((country) => (
            <motion.button
              key={country.code}
              onClick={() => handleCountrySelect(country)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className={`w-full flex items-center justify-between p-3 sm:p-2 rounded-lg transition-colors duration-150 touch-manipulation ${
                selectedCountry?.code === country.code
                  ? 'bg-gray-100 text-gray-900 border-2 border-black'
                  : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-3">
                <div className="text-3xl sm:text-2xl">
                  {country.code === 'US' && '🇺🇸'}
                  {country.code === 'IN' && '🇮🇳'}
                  {country.code === 'GB' && '🇬🇧'}
                  {country.code === 'CA' && '🇨🇦'}
                  {country.code === 'AU' && '🇦🇺'}
                  {country.code === 'DE' && '🇩🇪'}
                  {country.code === 'FR' && '🇫🇷'}
                  {country.code === 'JP' && '🇯🇵'}
                  {country.code === 'SG' && '🇸🇬'}
                  {country.code === 'AE' && '🇦🇪'}
                  {country.code === 'CH' && '🇨🇭'}
                  {country.code === 'NL' && '🇳🇱'}
                  {country.code === 'SE' && '🇸🇪'}
                  {country.code === 'NO' && '🇳🇴'}
                  {country.code === 'DK' && '🇩🇰'}
                  {country.code === 'BR' && '🇧🇷'}
                  {country.code === 'MX' && '🇲🇽'}
                  {country.code === 'AR' && '🇦🇷'}
                  {country.code === 'ZA' && '🇿🇦'}
                  {country.code === 'KR' && '🇰🇷'}
                  {country.code === 'CN' && '🇨🇳'}
                  {country.code === 'HK' && '🇭🇰'}
                  {country.code === 'TW' && '🇹🇼'}
                  {country.code === 'TH' && '🇹🇭'}
                  {country.code === 'MY' && '🇲🇾'}
                  {country.code === 'ID' && '🇮🇩'}
                  {country.code === 'PH' && '🇵🇭'}
                  {country.code === 'VN' && '🇻🇳'}
                  {country.code === 'NZ' && '🇳🇿'}
                  {country.code === 'IL' && '🇮🇱'}
                  {!['US', 'IN', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'SG', 'AE', 'CH', 'NL', 'SE', 'NO', 'DK', 'BR', 'MX', 'AR', 'ZA', 'KR', 'CN', 'HK', 'TW', 'TH', 'MY', 'ID', 'PH', 'VN', 'NZ', 'IL'].includes(country.code) && '🌍'}
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-base sm:text-sm">{country.name}</div>
                  <div className={`text-sm sm:text-xs ${selectedCountry?.code === country.code ? 'text-gray-600' : 'text-gray-500'}`}>
                    {country.currency} ({country.symbol})
                  </div>
                </div>
              </div>
              {selectedCountry?.code === country.code && (
                <Check className="w-6 h-6 sm:w-5 sm:h-5 text-black" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-4 border-t border-gray-100 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-3 sm:py-2 text-base sm:text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCountry || isUpdating}
            className={`w-full sm:flex-1 px-4 py-3 sm:py-2 text-base sm:text-sm rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 touch-manipulation ${
              selectedCountry && !isUpdating
                ? 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isUpdating ? (
              <>
                <div className="w-5 h-5 sm:w-4 sm:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Confirm</span>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LocationSelector;
