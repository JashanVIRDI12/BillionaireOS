import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Wand2, Loader2, Briefcase, Sparkles, Upload, Type } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import SoothingLoader from './SoothingLoader';
import FileUpload from './FileUpload';
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

  // Input method state for analyze tab
  const [inputMethod, setInputMethod] = useState('paste'); // 'paste' or 'upload'

  // Single update function to prevent focus issues
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle file upload text extraction
  const handleFileTextExtracted = (extractedText) => {
    updateField('resumeText', extractedText);
  };

  const tabs = [
    { id: 'build', label: 'Build', icon: FileText },
    { id: 'analyze', label: 'Analyze', icon: Wand2 },
  ];

  const handleAnalyze = async () => {
    if (!formData.resumeText.trim()) {
      setError('Please provide your resume text (paste or upload file) to analyze');
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
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-3 sm:mb-4 tracking-tight px-2">
            Resume Builder & Analyzer
          </h1>
          <div className="w-12 sm:w-16 h-0.5 bg-gray-900 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Create a clean resume and get AI-powered feedback, ATS insights, and job-match recommendations.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-10 flex justify-center px-2">
          <div className="inline-flex bg-gray-50 rounded-xl p-1 border border-gray-200 w-full sm:w-auto max-w-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex-1 sm:flex-initial ${
                    active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Build Tab Content */}
        {activeTab === 'build' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </div>
                <h2 className="text-base sm:text-lg font-medium text-gray-900">Summary</h2>
              </div>
              <textarea
                rows={4}
                value={formData.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder="2-3 sentences spotlighting your strengths, achievements, and goals"
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base resize-none"
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </div>
                <h2 className="text-base sm:text-lg font-medium text-gray-900">Experience</h2>
              </div>
              <textarea
                rows={6}
                value={formData.experience}
                onChange={(e) => updateField('experience', e.target.value)}
                placeholder={`Role, Company — YYYY–YYYY\n• Impact-driven bullet\n• Quantified result (e.g., increased signups by 32%)`}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base resize-none"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </div>
                  <h2 className="text-base sm:text-lg font-medium text-gray-900">Skills</h2>
                </div>
                <textarea
                  rows={4}
                  value={formData.skills}
                  onChange={(e) => updateField('skills', e.target.value)}
                  placeholder="e.g., React, Product Strategy, SQL, Leadership"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base resize-none"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </div>
                  <h2 className="text-base sm:text-lg font-medium text-gray-900">Education</h2>
                </div>
                <textarea
                  rows={4}
                  value={formData.education}
                  onChange={(e) => updateField('education', e.target.value)}
                  placeholder="Degree, School, Year — notable coursework or awards"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base resize-none"
                />
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-500 text-center px-4">Tip: Keep bullets impact-focused and quantified. Use strong verbs and outcomes.</div>
          </div>
        )}

        {/* Analyze Tab Content */}
        {activeTab === 'analyze' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </div>
                  <h2 className="text-base sm:text-lg font-medium text-gray-900">Your Resume</h2>
                </div>
                
                {/* Input Method Toggle */}
                <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200 w-full sm:w-auto">
                  <button
                    onClick={() => setInputMethod('paste')}
                    className={`flex items-center justify-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-initial ${
                      inputMethod === 'paste' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Type className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Paste Text</span>
                  </button>
                  <button
                    onClick={() => setInputMethod('upload')}
                    className={`flex items-center justify-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-initial ${
                      inputMethod === 'upload' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Upload File</span>
                  </button>
                </div>
              </div>
              
              {/* Paste Text Input */}
              {inputMethod === 'paste' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <textarea
                    rows={6}
                    value={formData.resumeText}
                    onChange={(e) => updateField('resumeText', e.target.value)}
                    placeholder="Paste your resume text here for AI analysis..."
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base resize-none"
                  />
                </motion.div>
              )}
              
              {/* File Upload Input */}
              {inputMethod === 'upload' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FileUpload onTextExtracted={handleFileTextExtracted} />
                  
                  {/* Show extracted text preview if available */}
                  {formData.resumeText && (
                    <div className="mt-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Extracted Text Preview</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-24 sm:max-h-32 overflow-y-auto">
                        <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                          {formData.resumeText.substring(0, 300)}
                          {formData.resumeText.length > 300 && '...'}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </div>
                <h2 className="text-base sm:text-lg font-medium text-gray-900">Target Job (Optional)</h2>
              </div>
              <textarea
                rows={4}
                value={formData.jobDesc}
                onChange={(e) => updateField('jobDesc', e.target.value)}
                placeholder="Paste a job description to tailor recommendations and compute job match score..."
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base resize-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 sm:py-4 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation"
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
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
                {result.summary && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Summary</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
                  </div>
                )}

                {result.ats && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-2">ATS & Match</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">ATS Readability</div>
                        <div className="text-base sm:text-lg font-medium text-gray-900">{result.ats.readability}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Keyword Coverage</div>
                        <div className="text-base sm:text-lg font-medium text-gray-900">{result.ats.keywordCoverage}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Job Match</div>
                        <div className="text-base sm:text-lg font-medium text-gray-900">{result.ats.jobMatch}</div>
                      </div>
                    </div>
                  </div>
                )}

                {result.strengths && result.strengths.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">Strengths</h3>
                    <ul className="space-y-2.5 sm:space-y-2">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start space-x-3 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.gaps && result.gaps.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">Gaps & Risks</h3>
                    <ul className="space-y-2.5 sm:space-y-2">
                      {result.gaps.map((g, i) => (
                        <li key={i} className="flex items-start space-x-3 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.improvements && result.improvements.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">Improvement Suggestions</h3>
                    <ul className="space-y-2.5 sm:space-y-2">
                      {result.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start space-x-3 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.rewrittenBullets && result.rewrittenBullets.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">Rewritten Bullets</h3>
                    <div className="space-y-3 sm:space-y-2">
                      {result.rewrittenBullets.map((b, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded text-sm text-gray-800 leading-relaxed">
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
                <div className="text-sm text-red-800 leading-relaxed">{error}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResumePage;
