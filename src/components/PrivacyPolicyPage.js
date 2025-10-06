import React from 'react';
import { Shield, Lock, Eye, Database, Globe, Mail, Calendar } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const lastUpdated = "October 6, 2024";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-light text-black">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Information We Collect */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Information We Collect</h2>
            </div>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <div>
                <h3 className="text-lg font-medium text-black mb-3">Personal Information</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Email address and authentication credentials</li>
                  <li>• Profile information you choose to provide</li>
                  <li>• Location data (with your consent) for personalized features</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black mb-3">Usage Data</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Journal entries, goals, habits, and net worth data</li>
                  <li>• AI interaction data for improving our services</li>
                  <li>• App usage patterns and feature preferences</li>
                  <li>• Device information and browser type</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>We use your information to:</p>
              <ul className="space-y-2 ml-4">
                <li>• Provide and improve our AI-powered productivity features</li>
                <li>• Personalize your experience based on your goals and preferences</li>
                <li>• Generate intelligent insights and recommendations</li>
                <li>• Ensure the security and integrity of our services</li>
                <li>• Communicate important updates and feature announcements</li>
                <li>• Analyze usage patterns to enhance our platform</li>
              </ul>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Data Protection & Security</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="space-y-2 ml-4">
                <li>• End-to-end encryption for sensitive data</li>
                <li>• Secure Firebase infrastructure with enterprise-grade security</li>
                <li>• Regular security audits and vulnerability assessments</li>
                <li>• Access controls and authentication protocols</li>
                <li>• Data backup and recovery systems</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Data Sharing & Third Parties</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p><strong>We do not sell your personal data.</strong> We may share information only in these limited circumstances:</p>
              <ul className="space-y-2 ml-4">
                <li>• With AI service providers (OpenRouter/DeepSeek) for generating insights</li>
                <li>• With Firebase/Google for secure data storage and authentication</li>
                <li>• When required by law or to protect our legal rights</li>
                <li>• With your explicit consent for specific integrations</li>
              </ul>
              <p className="mt-4">
                All third-party services we use are bound by strict data protection agreements and comply with privacy regulations.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Your Privacy Rights</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>You have the right to:</p>
              <ul className="space-y-2 ml-4">
                <li>• Access and download your personal data</li>
                <li>• Correct or update your information</li>
                <li>• Delete your account and associated data</li>
                <li>• Opt out of non-essential data processing</li>
                <li>• Request data portability</li>
                <li>• Withdraw consent for location-based features</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at the email address provided below.
              </p>
            </div>
          </section>

          {/* Cookies & Analytics */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Cookies & Analytics</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>We use cookies and similar technologies to:</p>
              <ul className="space-y-2 ml-4">
                <li>• Remember your preferences and settings</li>
                <li>• Analyze app performance and usage patterns</li>
                <li>• Provide personalized experiences</li>
                <li>• Ensure security and prevent fraud</li>
              </ul>
              <p className="mt-4">
                You can control cookie settings through your browser preferences. Note that disabling certain cookies may limit app functionality.
              </p>
            </div>
          </section>

          {/* Updates to Policy */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Policy Updates</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. 
                We will notify you of significant changes through the app or via email. Your continued use of Billionaire OS 
                after such modifications constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Contact Us</h2>
            </div>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                If you have questions about this privacy policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> privacy@billionaireos.com</p>
                <p><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                We aim to respond to all privacy-related inquiries within 48 hours.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
