import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Calendar, CheckSquare, DollarSign, Rocket, Briefcase, 
  Brain, TrendingUp, ArrowRight, Users, 
  Shield, Zap, Globe, Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';

const HomePage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { location } = useLocation();
  const [currentFeature, setCurrentFeature] = useState(0);
  // Compact mode to keep homepage short and premium
  const [compact] = useState(true);
  
  // Debug location object
  console.log('Location object:', location);

  // Hero features carousel
  const heroFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Get personalized insights for your career and business growth",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Track your progress with beautiful, actionable dashboards",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Goal Achievement",
      description: "Turn your dreams into structured, achievable milestones",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Rocket,
      title: "Business Growth",
      description: "Discover opportunities and validate your next big idea",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  // Main features
  const productivityFeatures = [
    {
      id: 'vision',
      icon: Target,
      title: 'Smart Journal',
      description: 'AI-powered journaling with insights and trend analysis',
      benefits: ['Daily reflection tracking', 'Mood & energy insights', 'Personal growth analytics'],
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'goals',
      icon: Calendar,
      title: 'Goal Mastery',
      description: 'Transform dreams into achievable, trackable milestones',
      benefits: ['North Star goal setting', 'Progress visualization', 'Achievement celebrations'],
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'habits',
      icon: CheckSquare,
      title: 'Habit Builder',
      description: 'Build lasting habits with intelligent tracking systems',
      benefits: ['Streak tracking', 'Habit stacking', 'Behavioral insights'],
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 'networth',
      icon: DollarSign,
      title: 'Wealth Tracker',
      description: 'Monitor and grow your financial empire with precision',
      benefits: ['Net worth tracking', 'Investment insights', 'Financial goal planning'],
      color: 'from-emerald-400 to-emerald-600'
    }
  ];

  const intelligenceFeatures = [
    {
      id: 'business',
      icon: Rocket,
      title: 'Business Intelligence',
      description: 'AI-powered business insights and opportunity discovery',
      benefits: ['Market trend analysis', 'Competitor research', 'Revenue model optimization', 'MVP validation'],
      color: 'from-purple-400 to-purple-600',
      premium: true
    },
    {
      id: 'profession',
      icon: Briefcase,
      title: 'Career Intelligence',
      description: 'Advanced career analytics and professional development',
      benefits: ['Salary benchmarking', 'Skills gap analysis', 'Career path planning', 'Job market insights'],
      color: 'from-indigo-400 to-indigo-600',
      premium: true
    }
  ];

  // Badges (startup-friendly, no vanity metrics)
  const stats = [
    { icon: Rocket, value: 'Private Beta', label: 'Invite-only access' },
    { icon: Shield, value: 'Privacy-first', label: 'Your data stays yours' },
    { icon: Zap, value: 'Fast & Minimal', label: 'Built for speed' },
    { icon: Globe, value: 'Global-ready', label: 'Timezones & currencies' }
  ];

  // Auto-rotate hero features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  const FeatureCard = ({ feature, index, category }) => (
    <div
      className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 p-8 hover:border-gray-900 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
      onClick={() => onNavigate(feature.id)}
    >
      {feature.premium && (
        <div className="absolute top-6 right-6">
          <div className="text-xs text-gray-500 font-light">
            AI Powered
          </div>
        </div>
      )}
      
      <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
        <feature.icon className="w-4 h-4 text-white" />
      </div>
      
      <h3 className="text-xl font-light text-gray-900 mb-3">
        {feature.title}
      </h3>
      
      <p className="text-gray-500 mb-6 leading-relaxed font-light text-sm">
        {feature.description}
      </p>
      
      <ul className="space-y-2 mb-8">
        {feature.benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start text-xs text-gray-400 font-light">
            <div className="w-1 h-1 bg-gray-300 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
            {benefit}
          </li>
        ))}
      </ul>
      
      <div className="flex items-center text-gray-900 text-sm font-light group-hover:translate-x-1 transition-transform duration-200">
        <span>Explore</span>
        <ArrowRight className="w-3 h-3 ml-2" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 text-gray-600"
                >
                  <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                  <span className="text-sm font-light">Personal Intelligence Suite</span>
                </motion.div>
                
                <h1 className="text-5xl lg:text-6xl font-light text-gray-900 leading-tight tracking-tight">
                  Transform Your
                  <span className="font-normal block bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Potential
                  </span>
                </h1>
                
                <p className="text-lg text-gray-500 leading-relaxed max-w-md font-light">
                  AI-powered insights for ambitious individuals seeking excellence in productivity and growth.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={() => onNavigate('business')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-3 font-light text-base transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <span>Explore Intelligence</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  onClick={() => onNavigate('vision')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 font-light text-base border border-gray-200 hover:border-gray-900 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <span>Start Journey</span>
                </motion.button>
              </div>

              {/* Compact Stats strip inside Hero */}
              {compact && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xl font-light bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stat.value}</div>
                      <div className="text-gray-500 text-xs font-light">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* User greeting */}
              {user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="border-l-2 border-gray-200 pl-4"
                >
                  <p className="text-gray-600 font-light text-sm">
                    Welcome back, <span className="text-gray-900">{user.displayName || 'Achiever'}</span>
                    {location && (
                      <span className="text-gray-400">
                        {location.city && location.country ? (
                          ` • ${location.city}, ${location.country}`
                        ) : location.name ? (
                          ` • ${location.name}`
                        ) : location.country ? (
                          ` • ${location.country}`
                        ) : location.timezone ? (
                          ` • ${location.timezone}`
                        ) : (
                          ' • Location set'
                        )}
                      </span>
                    )}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 p-12 shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-center space-y-6"
                  >
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center shadow-lg">
                      {React.createElement(heroFeatures[currentFeature].icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <div>
                      <h3 className="text-xl font-light text-gray-900 mb-2">
                        {heroFeatures[currentFeature].title}
                      </h3>
                      <p className="text-gray-500 text-sm font-light">
                        {heroFeatures[currentFeature].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Feature indicators */}
                <div className="flex justify-center space-x-1 mt-8">
                  {heroFeatures.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-1 h-1 transition-all duration-300 ${
                        index === currentFeature ? 'bg-gray-900 w-4 h-1' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Start actions (compact) */}
      {compact && (
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'vision', label: 'Write Journal' },
                { id: 'goals', label: 'Update Goals' },
                { id: 'business', label: 'Business Intel' },
                { id: 'profession', label: 'Career Intel' },
              ].map((q) => (
                <button
                  key={q.id}
                  onClick={() => onNavigate(q.id)}
                  className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-900 text-gray-900 text-sm py-2.5 rounded-lg transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section (expanded mode only) */}
      {!compact && (
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-light bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm font-light">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Productivity Features */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50/50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 text-gray-600 mb-6">
              <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
              <span className="text-sm font-light">Productivity Suite</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              Master Your Daily Life
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-light">
              Build lasting habits, achieve meaningful goals, and track your progress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {(compact ? productivityFeatures.slice(0, 2) : productivityFeatures).map((feature, index) => (
              <FeatureCard 
                key={feature.id} 
                feature={feature} 
                index={index} 
                category="productivity"
              />
            ))}
          </div>
          {compact && (
            <div className="text-center mt-10">
              <button
                onClick={() => onNavigate('goals')}
                className="inline-flex items-center px-5 py-2.5 text-sm bg-white border border-gray-200 hover:border-gray-900 text-gray-900 transition rounded-lg"
              >
                Explore more productivity
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Intelligence Features */}
      <section className="py-16 bg-gradient-to-b from-gray-50/50 to-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 text-gray-600 mb-6">
              <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
              <span className="text-sm font-light">AI Intelligence</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              Unlock Your Potential
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-light">
              Harness artificial intelligence to accelerate your career growth and business success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {(compact ? intelligenceFeatures.slice(0, 2) : intelligenceFeatures).map((feature, index) => (
              <FeatureCard 
                key={feature.id} 
                feature={feature} 
                index={index} 
                category="intelligence"
              />
            ))}
          </div>
          {compact && (
            <div className="text-center mt-10">
              <button
                onClick={() => onNavigate('business')}
                className="inline-flex items-center px-5 py-2.5 text-sm bg-white border border-gray-200 hover:border-gray-900 text-gray-900 transition rounded-lg"
              >
                Explore more intelligence
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section (expanded mode only) */}
      {!compact && (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50/30 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
                Why Billionaire OS?
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto font-light">
                Built for ambitious individuals who demand excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-16">
              {[
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  description: 'Optimized for speed and efficiency'
                },
                {
                  icon: Shield,
                  title: 'Privacy First',
                  description: 'Your data is encrypted and secure'
                },
                {
                  icon: Globe,
                  title: 'Global Ready',
                  description: 'Multiple currencies and timezones'
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-8 h-8 mx-auto mb-6 bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center shadow-lg">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-light text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm font-light">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-3xl lg:text-4xl font-light">
              Ready to Transform Your Life?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-light">
              Join thousands of ambitious individuals achieving their dreams.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => onNavigate('business')}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white text-gray-900 px-6 py-3 font-light text-base hover:bg-gray-100 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <span>Start with Intelligence</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                onClick={() => onNavigate('vision')}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white/10 backdrop-blur-sm text-white px-6 py-3 font-light text-base border border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
              >
                <span>Begin Journey</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
