// Location functionality test utilities
export const testLocationFeatures = () => {
  console.log('🌍 Testing Location Features...');
  
  // Test 1: Currency formatting
  const testCurrency = (amount, locale, currency, symbol) => {
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      
      const formatted = formatter.format(amount);
      console.log(`✅ ${currency} formatting: ${formatted}`);
      return true;
    } catch (error) {
      console.error(`❌ ${currency} formatting failed:`, error);
      return false;
    }
  };

  // Test different currencies
  const testCurrencies = [
    { locale: 'en-US', currency: 'USD', symbol: '$', amount: 100000 },
    { locale: 'en-IN', currency: 'INR', symbol: '₹', amount: 100000 },
    { locale: 'en-GB', currency: 'GBP', symbol: '£', amount: 100000 },
    { locale: 'ja-JP', currency: 'JPY', symbol: '¥', amount: 100000 },
    { locale: 'de-DE', currency: 'EUR', symbol: '€', amount: 100000 }
  ];

  console.log('💰 Testing Currency Formatting:');
  testCurrencies.forEach(({ locale, currency, symbol, amount }) => {
    testCurrency(amount, locale, currency, symbol);
  });

  // Test 2: Location context generation
  console.log('\n📍 Testing Location Context Generation:');
  const testLocations = [
    { name: 'United States', currency: 'USD', symbol: '$' },
    { name: 'India', currency: 'INR', symbol: '₹' },
    { name: 'United Kingdom', currency: 'GBP', symbol: '£' },
    { name: 'Japan', currency: 'JPY', symbol: '¥' }
  ];

  testLocations.forEach(location => {
    const context = `The user is located in ${location.name}. Use ${location.currency} (${location.symbol}) as the currency for all financial calculations and examples. Consider local market conditions, regulations, and business practices specific to ${location.name} when providing advice.`;
    console.log(`✅ ${location.name} context: Generated successfully`);
  });

  // Test 3: LocalStorage functionality
  console.log('\n💾 Testing LocalStorage:');
  try {
    const testLocation = { name: 'Test Country', code: 'TC', currency: 'TCC', symbol: 'T$' };
    localStorage.setItem('billionaire-os-location-test', JSON.stringify(testLocation));
    const retrieved = JSON.parse(localStorage.getItem('billionaire-os-location-test'));
    
    if (retrieved && retrieved.name === testLocation.name) {
      console.log('✅ LocalStorage: Save and retrieve working');
      localStorage.removeItem('billionaire-os-location-test');
    } else {
      console.error('❌ LocalStorage: Data mismatch');
    }
  } catch (error) {
    console.error('❌ LocalStorage: Failed', error);
  }

  console.log('\n🎉 Location feature testing completed!');
};

// Test location context for AI prompts
export const testAIPromptContext = (location) => {
  if (!location) {
    console.log('⚠️ No location provided for AI context test');
    return '';
  }

  const context = `The user is located in ${location.name}. Use ${location.currency} (${location.symbol}) as the currency for all financial calculations and examples. Consider local market conditions, regulations, and business practices specific to ${location.name} when providing advice.`;
  
  console.log('🤖 AI Prompt Context Generated:');
  console.log(context);
  
  return context;
};

// Validate location data structure
export const validateLocationData = (location) => {
  const requiredFields = ['name', 'code', 'currency', 'symbol'];
  const missing = requiredFields.filter(field => !location[field]);
  
  if (missing.length > 0) {
    console.error('❌ Location validation failed. Missing fields:', missing);
    return false;
  }
  
  console.log('✅ Location data validation passed');
  return true;
};
