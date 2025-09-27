import React from "react";
import { Lightbulb, TrendingUp, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FirstTimeGuide - Onboarding guide for Business Intelligence and Career Intelligence
 *
 * Props:
 * - open: boolean (show/hide guide)
 * - onClose: function (close handler)
 * - type: 'business' | 'profession'
 */
export default function FirstTimeGuide({ open, onClose, type }) {
  const guides = {
    business: {
      title: "Welcome to Business Intelligence",
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      intro:
        "Unlock actionable insights to launch, analyze, and validate your business ideas with AI-powered tools.",
      steps: [
        {
          label: "Generate Business Ideas",
          desc: "Get tailored startup ideas based on your interests and market context.",
        },
        {
          label: "Analyze Market Trends",
          desc: "Understand industry trends, opportunities, and challenges for your chosen sector.",
        },
        {
          label: "Competitor Analysis",
          desc: "Identify and compare top competitors to refine your strategy.",
        },
        {
          label: "Revenue Models",
          desc: "Explore proven revenue models and discover what fits your business.",
        },
        {
          label: "MVP Validation",
          desc: "Validate your product idea with AI-driven feedback and actionable steps.",
        },
      ],
      tips: [
        "Try example prompts for instant inspiration.",
        "Switch tabs to explore each intelligence tool.",
        "All results are tailored to your location and market context.",
      ],
    },
    profession: {
      title: "Welcome to Career Intelligence",
      icon: <Brain className="w-8 h-8 text-violet-600" />,
      intro:
        "Supercharge your career with AI-driven insights on salary, job trends, skills, and growth strategies.",
      steps: [
        {
          label: "Salary Analysis",
          desc: "See how your compensation compares in your market and get negotiation tips.",
        },
        {
          label: "Job Market Trends",
          desc: "Explore in-demand roles, skills, and growth opportunities in your field.",
        },
        {
          label: "Career Path Recommendations",
          desc: "Get personalized advancement strategies and step-by-step action plans.",
        },
        {
          label: "Skills Gap Analysis",
          desc: "Identify missing skills and get learning recommendations to boost your profile.",
        },
      ],
      tips: [
        "Insights adapt to your location and profession.",
        "Use example queries for quick exploration.",
        "Switch tabs to access all intelligence tools.",
      ],
    },
  };

  const guide = guides[type] || guides.business;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
              onClick={onClose}
              aria-label="Close guide"
            >
              <span aria-hidden>×</span>
            </button>
            <div className="flex items-center gap-3 mb-4">
              {guide.icon}
              <h2 className="text-xl font-semibold text-gray-900">
                {guide.title}
              </h2>
            </div>
            <p className="text-gray-600 mb-6">{guide.intro}</p>
            <ol className="mb-6 space-y-3">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <span className="font-medium text-gray-900">{step.label}</span>
                    <div className="text-gray-500 text-sm">{step.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="bg-gray-50 rounded-lg p-4 mb-2">
              <div className="text-gray-700 font-medium mb-1">Tips for getting started:</div>
              <ul className="list-disc ml-6 text-gray-500 text-sm space-y-1">
                {guide.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
            <button
              className="mt-4 w-full bg-gray-900 text-white rounded-lg py-2 font-semibold hover:bg-gray-800 transition"
              onClick={onClose}
            >
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
