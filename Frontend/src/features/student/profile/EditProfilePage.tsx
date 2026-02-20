import { useState } from "react";
import { ArrowLeft, Camera, Save, User, Mail, Calendar, MapPin, Globe, Phone, Edit2, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select } from "../../../components/ui/select";
import { UserProfile } from "./ProfileTab";

interface EditProfilePageProps {
  userProfile: UserProfile;
  onUpdate: (updatedProfile: Partial<UserProfile>) => void;
  onBack: () => void;
}

export function EditProfilePage({ userProfile, onUpdate, onBack }: EditProfilePageProps) {
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    avatar: userProfile.avatar,
    bio: "🌱 Passionate about sustainability and environmental protection. Love learning about eco-friendly practices and sharing knowledge with fellow learners!",
    location: "San Francisco, CA",
    birthDate: "1998-03-15",
    language: "English",
    phone: "+1 (555) 123-4567",
    website: "https://myecojourney.com",
    interests: ["Renewable Energy", "Sustainable Living", "Climate Action", "Green Technology"],
    joinDate: userProfile.joinDate
  });

  const [editingInterests, setEditingInterests] = useState(false);
  const [newInterest, setNewInterest] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleAvatarChange = () => {
    // In a real app, this would open camera/gallery picker
    const emojis = ["👤", "🌱", "🌍", "♻️", "🌿", "🌳", "🦋", "🐛", "🌺", "🌻", "🌸", "🍃"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    handleInputChange("avatar", randomEmoji);
  };

  const handleSave = () => {
    onUpdate({
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar
    });
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-[#2ECC71] p-4 shadow-lg sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:bg-white/10 rounded-lg p-2 -m-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-white text-lg font-semibold">Edit Profile</h1>
          <Button 
            onClick={handleSave}
            className="bg-white/20 hover:bg-white/30 text-white border-0 shadow-sm"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
        {/* Avatar Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-[#2ECC71]/10 rounded-2xl flex items-center justify-center mb-4">
                {formData.avatar.startsWith('data:') ? (
                  <img 
                    src={formData.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <span className="text-4xl">{formData.avatar}</span>
                )}
              </div>
              <button 
                onClick={handleAvatarChange}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#2ECC71] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow text-white"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-semibold mb-2">Profile Picture</h3>
            <p className="text-sm text-gray-600">Click the camera icon to change your avatar</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#2ECC71]" />
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="mt-1"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="mt-1 min-h-[80px]"
                placeholder="Tell others about yourself and your eco journey..."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#2ECC71]" />
            Contact Information
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="mt-1"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="mt-1"
                placeholder="Enter your city, state/country"
              />
            </div>

            <div>
              <Label htmlFor="website" className="text-sm font-medium">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="mt-1"
                placeholder="https://your-website.com"
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#2ECC71]" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="birthDate" className="text-sm font-medium">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="language" className="text-sm font-medium">Language</Label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71]/50"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#2ECC71]" />
              Interests
            </h3>
            <button
              onClick={() => setEditingInterests(!editingInterests)}
              className="text-[#2ECC71] text-sm font-medium flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              {editingInterests ? "Done" : "Edit"}
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest, index) => (
                <div 
                  key={index}
                  className="bg-[#2ECC71]/10 text-[#2ECC71] px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  <span>{interest}</span>
                  {editingInterests && (
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="hover:bg-[#2ECC71]/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {editingInterests && (
              <div className="flex gap-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add new interest..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                />
                <Button 
                  onClick={handleAddInterest}
                  size="sm"
                  className="bg-[#2ECC71] hover:bg-[#27AE60]"
                >
                  Add
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#2ECC71]" />
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm text-gray-600">Member Since</span>
              <span className="text-sm font-medium">
                {new Date(formData.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm text-gray-600">Account Type</span>
              <span className="text-sm font-medium text-[#2ECC71]">Premium Eco Learner</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Account ID</span>
              <span className="text-sm font-medium font-mono">{userProfile.id}</span>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">ℹ</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Privacy & Security</h4>
              <p className="text-xs text-blue-700">
                Your personal information is encrypted and securely stored. Only you can see and edit your private details. 
                Public profile information may be visible to other learners in the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}