import React from 'react';
import { FileText, Scale, AlertTriangle, Shield, Users, Zap, Calendar, Mail } from 'lucide-react';

const TermsConditionsPage = () => {
  const lastUpdated = "October 6, 2024";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-light text-black">Terms & Conditions</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Please read these terms carefully before using Billionaire OS. By using our service, you agree to these terms.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Acceptance of Terms</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                By accessing and using Billionaire OS ("the Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These terms apply to all users of the Service, including without limitation users who are browsers, 
                vendors, customers, merchants, and/or contributors of content.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Service Description</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Billionaire OS is an AI-powered personal development platform that provides:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• Productivity tools including journaling, goal tracking, and habit building</li>
                <li>• AI-powered intelligence features for business and career insights</li>
                <li>• Net worth tracking and financial planning tools</li>
                <li>• Resume analysis and career development features</li>
                <li>• Personalized recommendations based on user data and AI analysis</li>
              </ul>
              <p>
                The Service is provided "as is" and we reserve the right to modify, suspend, or discontinue 
                any part of the Service at any time.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">User Accounts & Responsibilities</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>To use certain features of the Service, you must create an account. You agree to:</p>
              <ul className="space-y-2 ml-4">
                <li>• Provide accurate, current, and complete information during registration</li>
                <li>• Maintain the security of your password and account</li>
                <li>• Accept responsibility for all activities under your account</li>
                <li>• Notify us immediately of any unauthorized use of your account</li>
                <li>• Use the Service only for lawful purposes and in accordance with these terms</li>
              </ul>
              <p>
                You are responsible for all content you submit, including journal entries, goals, and personal data. 
                We are not responsible for any loss or corruption of your data.
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Acceptable Use Policy</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>You agree not to use the Service to:</p>
              <ul className="space-y-2 ml-4">
                <li>• Violate any applicable laws or regulations</li>
                <li>• Infringe on intellectual property rights of others</li>
                <li>• Upload malicious code, viruses, or harmful content</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Use the Service for commercial purposes without authorization</li>
                <li>• Share false, misleading, or defamatory information</li>
                <li>• Interfere with or disrupt the Service or servers</li>
                <li>• Create multiple accounts to circumvent restrictions</li>
              </ul>
            </div>
          </section>

          {/* AI Services & Data Usage */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">AI Services & Data Usage</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Our AI-powered features use third-party services to provide insights and recommendations. 
                By using these features, you understand that:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• AI-generated content is for informational purposes only</li>
                <li>• We do not guarantee the accuracy of AI insights or recommendations</li>
                <li>• You should not rely solely on AI advice for important decisions</li>
                <li>• Your data may be processed by AI service providers under strict privacy agreements</li>
                <li>• AI features may have usage limits or require additional fees in the future</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Intellectual Property</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The Service and its original content, features, and functionality are owned by Billionaire OS 
                and are protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws.
              </p>
              <p>
                You retain ownership of your personal data and content. By using the Service, you grant us 
                a limited license to use your data to provide and improve our services as described in our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Disclaimers & Limitations</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>No Warranty:</strong> The Service is provided "as is" without any warranty of any kind. 
                We disclaim all warranties, whether express or implied, including merchantability, fitness for 
                a particular purpose, and non-infringement.
              </p>
              <p>
                <strong>Financial Advice:</strong> Billionaire OS is not a financial advisor. Net worth tracking 
                and financial features are for informational purposes only. Always consult qualified professionals 
                for financial advice.
              </p>
              <p>
                <strong>Career Guidance:</strong> Career intelligence features provide general insights and should 
                not replace professional career counseling or job search services.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> In no event shall Billionaire OS be liable for any 
                indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Termination</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We may terminate or suspend your account and access to the Service immediately, without prior 
                notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
              <p>
                You may terminate your account at any time by contacting us. Upon termination, your right to 
                use the Service will cease immediately, and we may delete your account and data.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Changes to Terms</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of significant 
                changes through the Service or via email. Your continued use of the Service after such 
                modifications constitutes acceptance of the updated terms.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-light text-black">Governing Law</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which 
                Billionaire OS operates, without regard to conflict of law provisions. Any disputes arising 
                from these terms will be resolved through binding arbitration.
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
                If you have questions about these Terms & Conditions, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> legal@billionaireos.com</p>
                <p><strong>Subject Line:</strong> Terms & Conditions Inquiry</p>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                We aim to respond to all legal inquiries within 48 hours.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
