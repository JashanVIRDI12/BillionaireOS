import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Wand2, Loader2, Briefcase, Sparkles } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import SoothingLoader from './SoothingLoader';
import { analyzeResume } from '../services/resumeIntelligence';

const ResumePage = () => {
  const { getLocationContext } = useLocation();
  const [activeTab, setActiveTab] = useState('analyze');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // All form states in one object to prevent re-renders
  const [formData, setFormData] = useState({
    // Build form
    summary: '',
    experience: '',
    skills: '',
    education: '',
    // Analyze form
    resumeText: '',
    jobDesc: ''
  });

  // Single update function to prevent focus issues
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'build', label: 'Build', icon: FileText },
    { id: 'analyze', label: 'Analyze', icon: Wand2 },
  ];

  const handleAnalyze = async () => {
    if (!formData.resumeText.trim()) {
      setError('Please paste your resume to analyze');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await analyzeResume(formData.resumeText, formData.jobDesc, getLocationContext());
      if (analysis.success) {
        setResult(analysis.analysis);
      } else {
        setError(analysis.error || 'Failed to analyze resume');
      }
    } catch (e) {
      setError('Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Resume Builder & Analyzer
          </h1>
          <div className="w-16 h-0.5 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create a clean resume and get AI-powered feedback, ATS insights, and job-match recommendations.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex bg-gray-50 rounded-xl p-1 border border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Build Tab Content */}
        {activeTab === 'build' && (
          <div className="space-y-6">
            <div className="bg-white sm:border sm:border-gray-200 sm:rounded-xl p-4 sm:p-6 sm:shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-lg font-medium text-gray-900">Summary</h2>
              </div>
              <textarea
                rows={4}
                value={formData.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder="2-3 sentences spotlighting your strengths, achievements, and goals"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="bg-white sm:border sm:border-gray-200 sm:rounded-xl p-4 sm:p-6 sm:shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-lg font-medium text-gray-900">Experience</h2>
              </div>
              <textarea
                rows={6}
                value={formData.experience}
                onChange={(e) => updateField('experience', e.target.value)}
                placeholder={`Role, Company — YYYY–YYYY\n• Impact-driven bullet\n• Quantified result (e.g., increased signups by 32%)`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white sm:border sm:border-gray-200 sm:rounded-xl p-4 sm:p-6 sm:shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-medium text-gray-900">Skills</h2>
                </div>
                <textarea
                  rows={4}
                  value={formData.skills}
                  onChange={(e) => updateField('skills', e.target.value)}
                  placeholder="e.g., React, Product Strategy, SQL, Leadership"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div className="bg-white sm:border sm:border-gray-200 sm:rounded-xl p-4 sm:p-6 sm:shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-medium text-gray-900">Education</h2>
                </div>
                <textarea
                  rows={4}
                  value={formData.education}
                  onChange={(e) => updateField('education', e.target.value)}
                  placeholder="Degree, School, Year — notable coursework or awards"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            <div className="text-sm text-gray-500 text-center">Tip: Keep bullets impact-focused and quantified. Use strong verbs and outcomes.</div>
          </div>
        )}

        {/* Analyze Tab Content */}
        {activeTab === 'analyze' && (
          <div className="space-y-6">
            <div className="bg-white sm:border sm:border-gray-200 sm:rounded-xl p-4 sm:p-6 sm:shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-lg font-medium text-gray-900">Your Resume</h2>
              </div>
              <textarea
                rows={8}
                value={formData.resumeText}
                onChange={(e) => updateField('resumeText', e.target.value)}
                placeholder="Paste your resume text here for AI analysis..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="bg-white sm:border sm:border-gray-200 sm:rounded-xl p-4 sm:p-6 sm:shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-lg font-medium text-gray-900">Target Job (Optional)</h2>
              </div>
              <textarea
                rows={5}
                value={formData.jobDesc}
                onChange={(e) => updateField('jobDesc', e.target.value)}
                placeholder="Paste a job description to tailor recommendations and compute job match score..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Analyze with AI</span>
                </>
              )}
            </button>
            {loading && (
              <SoothingLoader message="Evaluating strengths, gaps, ATS fit, and tailored improvements..." />
            )}

            {/* Results */}
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {result.summary && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
                  </div>
                )}

                {result.ats && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">ATS & Match</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">ATS Readability</div>
                        <div className="text-lg font-medium text-gray-900">{result.ats.readability}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Keyword Coverage</div>
                        <div className="text-lg font-medium text-gray-900">{result.ats.keywordCoverage}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Job Match</div>
                        <div className="text-lg font-medium text-gray-900">{result.ats.jobMatch}</div>
                      </div>
                    </div>
                  </div>
                )}

                {result.strengths && result.strengths.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Strengths</h3>
                    <ul className="space-y-2">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.gaps && result.gaps.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Gaps & Risks</h3>
                    <ul className="space-y-2">
                      {result.gaps.map((g, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.improvements && result.improvements.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Improvement Suggestions</h3>
                    <ul className="space-y-2">
                      {result.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.rewrittenBullets && result.rewrittenBullets.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Rewritten Bullets</h3>
                    <div className="space-y-2">
                      {result.rewrittenBullets.map((b, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded text-sm text-gray-800">
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResumePage;
