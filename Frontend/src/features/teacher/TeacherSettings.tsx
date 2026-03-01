import { useState } from "react";
import { User, Bell, Shield, HelpCircle, LogOut, Edit, Save, Eye, EyeOff } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as api from "../../lib/api";

interface TeacherSettingsProps {
  currentUser: any;
  onLogout: () => void;
}

export function TeacherSettings({ currentUser, onLogout }: TeacherSettingsProps) {
  const [activeSection, setActiveSection] = useState<"profile" | "notifications" | "privacy" | "help">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
    instituteName: currentUser.instituteName || "",
    facultyId: currentUser.facultyId || "",
    subjects: "Environmental Science, Earth Sciences",
    experience: "5 years",
    bio: "Passionate environmental educator dedicated to inspiring the next generation of eco-warriors."
  });

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    studentProgress: true,
    challengeUpdates: true,
    systemUpdates: false,
    parentCommunication: true,
    weeklyReports: true
  });

  const handleSave = async () => {
    try {
      await api.updateTeacherProfile({
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        department: formData.subjects,
        specialization: formData.bio,
      });
      setIsEditing(false);
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "help", label: "Help & Support", icon: HelpCircle }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-600">Manage your account and preferences</p>
        </div>
        <Button
          onClick={onLogout}
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Settings Navigation */}
      <Card className="p-1">
        <div className="flex space-x-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm flex-1 justify-center transition-colors ${isActive
                    ? "bg-[#2ECC71] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Profile Section */}
      {activeSection === "profile" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Personal Information</h3>
              <Button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--forest-600)] focus:border-[var(--forest-600)] disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--forest-600)] focus:border-[var(--forest-600)] disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--forest-600)] focus:border-[var(--forest-600)] disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--forest-600)] focus:border-[var(--forest-600)] disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={formData.instituteName}
                  onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--forest-600)] focus:border-[var(--forest-600)] disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty ID
                </label>
                <input
                  type="text"
                  value={formData.facultyId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Faculty ID cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subjects Taught
                </label>
                <input
                  type="text"
                  value={formData.subjects}
                  onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--forest-600)] focus:border-[var(--forest-600)] disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--forest-600)] focus:border-[var(--forest-600)] disabled:bg-gray-50"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Account Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-[var(--forest-50)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--forest-600)]">4</div>
                <div className="text-sm text-gray-600">Classes</div>
              </div>
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">110</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div className="text-center p-3 bg-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">47</div>
                <div className="text-sm text-gray-600">Materials Shared</div>
              </div>
              <div className="text-center p-3 bg-orange-100 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">156</div>
                <div className="text-sm text-gray-600">Challenges Created</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Section */}
      {activeSection === "notifications" && (
        <Card className="p-6">
          <h3 className="font-medium text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-sm text-gray-600">
                    {key === "emailDigest" && "Receive daily summary emails"}
                    {key === "studentProgress" && "Get notified about student achievements"}
                    {key === "challengeUpdates" && "Updates on challenge completions"}
                    {key === "systemUpdates" && "Platform updates and maintenance"}
                    {key === "parentCommunication" && "Parent-teacher communication alerts"}
                    {key === "weeklyReports" && "Weekly class performance reports"}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleNotificationChange(key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--forest-600)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--forest-600)]"></div>
                </label>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Privacy Section */}
      {activeSection === "privacy" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Password & Security</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-[var(--forest-600)] focus:border-[var(--forest-600)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--forest-600)] focus:border-[var(--forest-600)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--forest-600)] focus:border-[var(--forest-600)]"
                />
              </div>
              <Button className="w-full bg-[var(--forest-600)] hover:bg-[var(--forest-700)] text-white">
                Update Password
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Privacy Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Profile Visibility</div>
                  <div className="text-sm text-gray-600">Allow other teachers to view your profile</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--forest-600)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--forest-600)]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Class Statistics Sharing</div>
                  <div className="text-sm text-gray-600">Share anonymous class performance data</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--forest-600)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--forest-600)]"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Help Section */}
      {activeSection === "help" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Help & Support</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="w-4 h-4 mr-2" />
                Frequently Asked Questions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Contact Support Team
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Report a Problem
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">About EcoAlly Teacher</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Version:</strong> 2.1.0</p>
              <p><strong>Last Updated:</strong> March 15, 2024</p>
              <p><strong>Support Email:</strong> teacher-support@EcoAlly.com</p>
              <p><strong>Platform Status:</strong> All systems operational</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}