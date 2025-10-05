import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Calendar, CheckSquare, DollarSign, Rocket, Briefcase, 
  Brain, TrendingUp, ArrowRight, Users, Sparkles, Wand2,
  Shield, Zap, Globe, Award, FileText, BarChart3, PieChart,
  Lightbulb, Eye, Cpu, Network, Star
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
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section 
        ref={heroContainerRef}
        className="relative overflow-hidden pt-32 pb-40"
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
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-6 py-3 mb-12 shadow-xl hover:bg-white/25 hover:border-white/40 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Powered by Advanced AI</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-12 tracking-tight leading-tight">
                <div className="block font-black text-gray-900 py-2">
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
                    background: 'linear-gradient(135deg, rgba(147,51,234,0.9) 0%, rgba(37,99,235,0.8) 30%, rgba(8,145,178,0.9) 70%, rgba(6,182,212,0.8) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                    filter: 'drop-shadow(0 2px 8px rgba(147,51,234,0.3))'
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
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Harness the power of artificial intelligence to optimize every aspect of your success journey. 
                From financial growth to career advancement and personal development.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 mt-12"
            >
              <button
                onClick={() => onNavigate('business')}
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 text-gray-900 px-8 py-4 rounded-2xl font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-500 flex items-center space-x-2 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Experience AI Intelligence</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <button
                onClick={() => onNavigate('resume')}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 text-gray-700 px-8 py-4 rounded-2xl font-medium hover:bg-white/15 hover:border-white/25 transition-all duration-500 flex items-center space-x-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 overflow-hidden"
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Try Resume Intelligence</span>
                </div>
              </button>
            </motion.div>

          </div>
        </div>
      </section>


      {/* Feature Categories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
              Two Powerful Suites
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential productivity tools and advanced AI-powered intelligence for complete optimization
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              {Object.entries(featureCategories).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
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
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {featureCategories[activeCategory].title}
              </h3>
              <p className="text-lg text-gray-600">
                {featureCategories[activeCategory].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCategories[activeCategory].features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={`${activeCategory}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={feature.action}
                  className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl mb-6 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-900">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed mb-4">
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
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-light mb-6">
              Ready to Transform Your Success Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join thousands of ambitious individuals who are already using AI to accelerate their wealth, 
              career, and personal growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => onNavigate('business')}
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-2xl font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-500 flex items-center space-x-2 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  <Rocket className="w-5 h-5" />
                  <span>Start Your AI Journey</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <button
                onClick={() => onNavigate('goals')}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 text-white px-8 py-4 rounded-2xl font-medium hover:bg-white/15 hover:border-white/25 transition-all duration-500 flex items-center space-x-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 overflow-hidden"
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Set Your Goals</span>
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
