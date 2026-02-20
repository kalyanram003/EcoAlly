import { ArrowLeft, Shield, FileText, Eye, Lock, Users, Database, AlertTriangle, Mail } from "lucide-react";
import { useState } from "react";

interface PrivacyTermsPageProps {
  onBack: () => void;
}

export function PrivacyTermsPage({ onBack }: PrivacyTermsPageProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");

  const privacySections = [
    {
      title: "Information We Collect",
      icon: <Database className="w-5 h-5" />,
      content: `We collect information that you provide directly to us, including:
      
• Profile information (name, email, school details)
• Educational progress and achievements
• Content you create (challenge submissions, quiz responses)
• Usage data to improve our services

We do NOT collect sensitive personal information beyond what's necessary for the educational experience.`
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="w-5 h-5" />,
      content: `Your information is used to:
      
• Provide personalized learning experiences
• Track educational progress and achievements
• Enable collaboration with classmates and teachers
• Improve our platform and develop new features
• Ensure safety and security of our community

We never sell your personal information to third parties.`
    },
    {
      title: "Information Sharing",
      icon: <Users className="w-5 h-5" />,
      content: `We may share your information only with:
      
• Your teachers and school administrators (for educational purposes)
• Your parents/guardians (progress reports and achievements)
• Our trusted service providers (with strict data protection agreements)
• Legal authorities (only when required by law)

Your information is never shared for commercial purposes.`
    },
    {
      title: "Data Security",
      icon: <Lock className="w-5 h-5" />,
      content: `We protect your information through:
      
• Industry-standard encryption for data transmission
• Secure servers with regular security updates
• Limited access to personal information
• Regular security audits and monitoring
• Automatic logout after periods of inactivity

However, no online platform can guarantee 100% security.`
    },
    {
      title: "Your Rights",
      icon: <Shield className="w-5 h-5" />,
      content: `You have the right to:
      
• Access your personal information
• Request corrections to inaccurate data
• Delete your account and associated data
• Opt-out of certain communications
• Request a copy of your data

Contact your teacher or school administrator to exercise these rights.`
    }
  ];

  const termsSections = [
    {
      title: "Acceptable Use",
      icon: <Users className="w-5 h-5" />,
      content: `By using EcoLearn, you agree to:
      
• Use the platform for educational purposes only
• Respect other users and maintain a positive environment
• Provide accurate information when registering
• Not share your account with others
• Follow your school's technology and behavior policies
• Report any inappropriate content or behavior`
    },
    {
      title: "User Content",
      icon: <FileText className="w-5 h-5" />,
      content: `When you submit content (photos, videos, text):
      
• You retain ownership of your original content
• You grant EcoLearn permission to use it for educational purposes
• Content must be appropriate and related to environmental topics
• We may remove content that violates our guidelines
• You're responsible for ensuring you have rights to submit content`
    },
    {
      title: "Academic Integrity",
      icon: <Shield className="w-5 h-5" />,
      content: `EcoLearn promotes honest learning:
      
• Complete quizzes and challenges independently
• Submit only your own work for challenges
• Don't share quiz answers with other students
• Use the platform to genuinely learn about environmental topics
• Report any cheating or dishonest behavior`
    },
    {
      title: "Platform Availability",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `Please note that:
      
• EcoLearn may occasionally be unavailable for maintenance
• We strive for 99.9% uptime but cannot guarantee continuous access
• Your school may restrict access during certain hours
• Some features may be limited based on your user type
• We reserve the right to modify features with notice`
    },
    {
      title: "Account Termination",
      icon: <Lock className="w-5 h-5" />,
      content: `Accounts may be suspended or terminated for:
      
• Violation of these terms of service
• Inappropriate behavior or content
• Extended inactivity (as determined by your school)
• At your request or your parent/guardian's request
• Upon graduation or leaving the institution

You'll receive notice before any account termination when possible.`
    }
  ];

  const currentSections = activeTab === "privacy" ? privacySections : termsSections;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="ml-2">
            <h1 className="text-xl font-semibold text-gray-900">Privacy & Terms</h1>
            <p className="text-sm text-gray-600">Your rights and responsibilities</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "privacy"
                ? "bg-white text-[#2ECC71] shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Shield className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "terms"
                ? "bg-white text-[#2ECC71] shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Service
          </button>
        </div>

        {/* Last Updated */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">
                {activeTab === "privacy" ? "Privacy Policy" : "Terms of Service"}
              </h3>
              <p className="text-sm text-blue-600">Last updated: September 2024</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
          {activeTab === "privacy" ? (
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Your Privacy Matters</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                EcoLearn is committed to protecting the privacy of students, teachers, and educational institutions. 
                This policy explains what information we collect, how we use it, and your rights regarding your data. 
                We follow strict educational privacy standards including COPPA and FERPA guidelines.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="font-semibold text-gray-900 mb-3">Terms of Service</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                By using EcoLearn, you agree to these terms of service. These terms outline your rights and 
                responsibilities when using our educational platform. Please read them carefully and discuss 
                any questions with your teacher or school administrator.
              </p>
            </div>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          {currentSections.map((section, index) => (
            <details key={index} className="bg-white rounded-xl border border-gray-100">
              <summary className="p-4 cursor-pointer hover:bg-gray-50 rounded-xl font-medium text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#2ECC71]/10 rounded-lg flex items-center justify-center text-[#2ECC71]">
                  {section.icon}
                </div>
                <span className="flex-1">{section.title}</span>
                <div className="w-5 h-5 text-gray-400">→</div>
              </summary>
              <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </details>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-6 h-6" />
            <h3 className="font-semibold">Questions or Concerns?</h3>
          </div>
          <p className="text-white/90 text-sm mb-4">
            If you have questions about privacy or terms, please contact your teacher or school administrator. 
            They can help clarify any concerns and ensure your experience with EcoLearn is safe and positive.
          </p>
          <div className="bg-white/20 rounded-lg p-3">
            <p className="text-sm">
              <strong>For Parents:</strong> Contact your child's teacher for information about data collection and usage in the classroom.
            </p>
          </div>
        </div>

        {/* Age Notice */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-medium text-amber-800">Important Notice</h3>
          </div>
          <p className="text-amber-700 text-sm">
            EcoLearn is designed for educational use under school supervision. Students under 13 require 
            parental consent and teacher oversight for account creation and platform usage.
          </p>
        </div>
      </div>
    </div>
  );
}