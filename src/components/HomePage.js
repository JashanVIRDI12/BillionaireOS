import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Calendar, CheckSquare, DollarSign, Rocket, Briefcase, 
  Brain, TrendingUp, ArrowRight, Sparkles, FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import VariableProximity from './animations/VariableProximity';
import LiquidChrome from './effects/LiquidChrome';

const HomePage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { location } = useLocation();
  const [activeCategory, setActiveCategory] = useState('productivity');
  const heroContainerRef = useRef(null);

  // Detect Safari browser
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Feature categories - Based on actual app structure
  const featureCategories = {
    productivity: {
      title: "Productivity Suite",
      subtitle: "Essential tools for personal optimization",
      icon: TrendingUp,
      features: [
        {
          icon: Target,
          title: "Smart Journal",
          description: "AI-powered journaling with insights and trend analysis for daily reflection",
          action: () => onNavigate('vision')
        },
        {
          icon: Calendar,
          title: "Goal Mastery",
          description: "Transform dreams into achievable, trackable milestones with progress visualization",
          action: () => onNavigate('goals')
        },
        {
          icon: CheckSquare,
          title: "Habit Builder",
          description: "Build lasting habits with intelligent tracking systems and behavioral insights",
          action: () => onNavigate('habits')
        },
        {
          icon: DollarSign,
          title: "Net Worth Tracker",
          description: "Monitor and grow your financial empire with precision tracking and insights",
          action: () => onNavigate('networth')
        }
      ]
    },
    intelligence: {
      title: "AI Intelligence Suite",
      subtitle: "Advanced AI-powered insights and analysis",
      icon: Brain,
      features: [
        {
          icon: Rocket,
          title: "Business Intelligence",
          description: "AI-powered business insights, opportunity discovery, and market trend analysis",
          action: () => onNavigate('business')
        },
        {
          icon: Briefcase,
          title: "Career Intelligence",
          description: "Advanced career analytics, professional development, and market insights",
          action: () => onNavigate('profession')
        },
        {
          icon: FileText,
          title: "Resume Intelligence",
          description: "AI-powered resume analysis, ATS optimization, and job matching algorithms",
          action: () => onNavigate('resume')
        }
      ]
    }
  };



  return (
    <div className="min-h-screen bg-gray-200">
      {/* Hero Section */}
      <section 
        ref={heroContainerRef}
        className="relative overflow-hidden pt-20 sm:pt-32 pb-24 sm:pb-40"
      >
        {/* Liquid Chrome Background */}
        <div className="absolute inset-0">
          <LiquidChrome 
            baseColor={[0.15, 0.15, 0.15]}
            speed={0.12}
            amplitude={0.25}
            frequencyX={2.5}
            frequencyY={2.5}
            interactive={true}
            style={{ opacity: 0.3 }}
          />
        </div>
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-grid-gray-100 opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 sm:mb-16"
            >
              <div className="group relative inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15 hover:border-white/30 overflow-hidden">
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600 group-hover:text-purple-500 transition-colors duration-300" />
                  <span className="text-xs sm:text-sm font-medium text-purple-800 group-hover:text-purple-700 transition-colors duration-300">Powered by Advanced AI</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 sm:mb-12 tracking-tight leading-tight px-2 sm:px-0">
                <div 
                  className="block font-black text-gray-900 py-2"
                  style={{
                    WebkitMask: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.7) 100%)',
                    mask: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.7) 100%)'
                  }}
                >
                  <VariableProximity
                    label="The AI Operating System"
                    fromFontVariationSettings="'wght' 600"
                    toFontVariationSettings="'wght' 900"
                    containerRef={heroContainerRef}
                    radius={120}
                    falloff="exponential"
                  />
                </div>
                <div 
                  className="font-black -mt-2 py-2"
                  style={{
                    background: 'linear-gradient(90deg, #9333ea, #2563eb, #0891b2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitMask: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.7) 100%)',
                    mask: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.7) 100%)'
                  }}
                >
                  <VariableProximity
                    label="for Wealth, Career & Growth"
                    fromFontVariationSettings="'wght' 700"
                    toFontVariationSettings="'wght' 900"
                    containerRef={heroContainerRef}
                    radius={100}
                    falloff="gaussian"
                  />
                </div>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
                Harness the power of artificial intelligence to optimize every aspect of your success journey. 
                From financial growth to career advancement and personal development.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 mt-8 sm:mt-12 px-4 sm:px-0"
            >
              <button
                onClick={() => onNavigate('business')}
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-500 flex items-center justify-center space-x-2 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 overflow-hidden w-full sm:w-auto"
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Experience AI Intelligence</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <button
                onClick={() => onNavigate('resume')}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium hover:bg-white/15 hover:border-white/25 transition-all duration-500 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 overflow-hidden w-full sm:w-auto"
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Try Resume Intelligence</span>
                </div>
              </button>
            </motion.div>

          </div>
        </div>
      </section>


      {/* Feature Categories */}
      <section className="py-12 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-3 sm:mb-4 px-4 sm:px-0">
              Two Powerful Suites
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Essential productivity tools and advanced AI-powered intelligence for complete optimization
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-8 sm:mb-12 px-4 sm:px-0">
            <div className="flex flex-col sm:inline-flex sm:flex-row bg-white rounded-2xl p-2 shadow-lg border border-gray-200 w-full sm:w-auto">
              {Object.entries(featureCategories).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto ${
                      activeCategory === key
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{category.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Category Features */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-12"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                {featureCategories[activeCategory].title}
              </h3>
              <p className="text-base sm:text-lg text-gray-600">
                {featureCategories[activeCategory].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featureCategories[activeCategory].features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={`${activeCategory}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={feature.action}
                  className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer touch-manipulation"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl mb-4 sm:mb-6 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-gray-900">
                    {feature.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-gray-900 font-medium group-hover:text-gray-900">
                    <span className="text-sm">Explore Feature</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4 sm:mb-6 px-4 sm:px-0">
              Ready to Transform Your Success Journey?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
              Join thousands of ambitious individuals who are already using AI to accelerate their wealth, 
              career, and personal growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4 sm:px-0">
              <button
                onClick={() => onNavigate('business')}
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-500 flex items-center justify-center space-x-2 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 overflow-hidden w-full sm:w-auto"
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  <Rocket className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Start Your AI Journey</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <button
                onClick={() => onNavigate('goals')}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium hover:bg-white/15 hover:border-white/25 transition-all duration-500 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 overflow-hidden w-full sm:w-auto"
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Set Your Goals</span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
