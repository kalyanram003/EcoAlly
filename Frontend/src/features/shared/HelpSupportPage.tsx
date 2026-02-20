import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone, Search, BookOpen, Bug, Lightbulb, Users, FileText, Star } from "lucide-react";
import { useState } from "react";

interface HelpSupportPageProps {
  onBack: () => void;
}

export function HelpSupportPage({ onBack }: HelpSupportPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen className="w-5 h-5" />,
      questions: [
        {
          q: "How do I earn eco points?",
          a: "You can earn eco points by completing quizzes, participating in challenges, maintaining daily streaks, and discovering QR codes around your school or community."
        },
        {
          q: "What are the different user types?",
          a: "EcoLearn supports three user types: Students (participate in activities), Teachers (create content and monitor progress), and Admins (manage institutional settings)."
        },
        {
          q: "How do I join my school on EcoLearn?",
          a: "During registration, enter your institution's ID or name. Your teacher or admin will need to approve your account."
        }
      ]
    },
    {
      id: "gamification",
      title: "Points & Badges",
      icon: <Star className="w-5 h-5" />,
      questions: [
        {
          q: "How do badges work?",
          a: "Badges are earned by achieving specific milestones like completing your first quiz, maintaining streaks, or reaching point thresholds. Check your achievements section to see all available badges."
        },
        {
          q: "What can I do with eco points?",
          a: "Use eco points in the virtual store to unlock themes, avatars, power-ups, and streak shields. You can also compete with classmates on the leaderboard."
        },
        {
          q: "How do I maintain my streak?",
          a: "Complete at least one activity daily (quiz, challenge, or QR scan) to maintain your streak. Use streak shields to protect your streak if you miss a day."
        }
      ]
    },
    {
      id: "features",
      title: "App Features",
      icon: <Lightbulb className="w-5 h-5" />,
      questions: [
        {
          q: "How do QR codes work?",
          a: "Scan QR codes around your school or community using the built-in scanner. Each code reveals an eco-tip and rewards you with points. Look for EcoLearn QR codes on bulletin boards, classrooms, and outdoor areas."
        },
        {
          q: "Can I compete with my friends?",
          a: "Yes! Check the ranking tab to see how you compare with your classmates. You can also join teams and participate in collaborative challenges."
        },
        {
          q: "How do I submit challenge proof?",
          a: "For challenges requiring proof, take a photo or video of your eco-action and upload it through the challenge submission form. Teachers will review and approve submissions."
        }
      ]
    },
    {
      id: "account",
      title: "Account & Settings",
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          q: "How do I update my profile?",
          a: "Go to Profile → Settings → Edit Profile to update your name, avatar, and other details. Some information may require teacher/admin approval."
        },
        {
          q: "Can I change my username?",
          a: "Yes, you can change your username in the profile settings. Make sure it follows your school's guidelines."
        },
        {
          q: "How do I reset my password?",
          a: "Contact your teacher or school admin to reset your password. For security reasons, password resets require verification through your institution."
        }
      ]
    }
  ];

  const contactOptions = [
    {
      title: "Chat with Support",
      description: "Get instant help from our support team",
      icon: <MessageCircle className="w-6 h-6" />,
      action: "Start Chat",
      color: "bg-blue-500"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: <Mail className="w-6 h-6" />,
      action: "Send Email",
      color: "bg-green-500"
    },
    {
      title: "Report a Bug",
      description: "Found something not working?",
      icon: <Bug className="w-6 h-6" />,
      action: "Report Bug",
      color: "bg-red-500"
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => searchQuery === "" || 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
            <h1 className="text-xl font-semibold text-gray-900">Help & Support</h1>
            <p className="text-sm text-gray-600">Get help with EcoLearn</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
          />
        </div>

        {/* Quick Contact Options */}
        <div className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Need immediate help?</h2>
          <div className="space-y-3">
            {contactOptions.map((option, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center text-white`}>
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <div className="text-[#2ECC71] font-medium text-sm">
                  {option.action}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null 
                  ? "bg-[#2ECC71] text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id 
                    ? "bg-[#2ECC71] text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.icon}
                {category.title}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs
              .filter(category => selectedCategory === null || category.id === selectedCategory)
              .map((category) => (
                <div key={category.id}>
                  {selectedCategory === null && (
                    <h3 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                      {category.icon}
                      {category.title}
                    </h3>
                  )}
                  {category.questions.map((faq, index) => (
                    <details key={index} className="bg-white rounded-xl border border-gray-100 mb-3">
                      <summary className="p-4 cursor-pointer hover:bg-gray-50 rounded-xl font-medium text-gray-900 flex items-center justify-between">
                        {faq.q}
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </summary>
                      <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              ))}
          </div>

          {searchQuery && filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400">Try different keywords or contact support</p>
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2ECC71]" />
            Additional Resources
          </h3>
          <div className="space-y-3">
            <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900">EcoLearn User Guide</h4>
              <p className="text-sm text-gray-600">Complete guide to using all features</p>
            </a>
            <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900">Video Tutorials</h4>
              <p className="text-sm text-gray-600">Watch step-by-step video guides</p>
            </a>
            <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900">Community Forum</h4>
              <p className="text-sm text-gray-600">Connect with other EcoLearn users</p>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Still need help? Contact your teacher or school administrator</p>
          <p className="mt-1">Response time: Usually within 24 hours</p>
        </div>
      </div>
    </div>
  );
}

