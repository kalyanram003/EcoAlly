import { useState } from "react";
import { Mail, Phone, Lock, Eye, EyeOff, Chrome, ArrowRight, IdCard } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RoleSelector } from "./RoleSelector";

interface LoginPageProps {
  onLogin: (credentials: { email: string; password: string; role?: string; roleId?: string; rolePassword?: string }) => void;
  onShowSignup: () => void;
}

export function LoginPage({ onLogin, onShowSignup }: LoginPageProps) {
  const [currentStep, setCurrentStep] = useState<"role" | "credentials">("role");
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | "admin" | null>(null);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showRolePassword, setShowRolePassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    roleId: "",
    rolePassword: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleRoleSelect = (role: "student" | "teacher" | "admin") => {
    setSelectedRole(role);
    setCurrentStep("credentials");
    setErrors({}); // Clear any existing errors
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (loginMethod === "email") {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Additional validation for teacher and admin roles
    if (selectedRole === "teacher") {
      if (!formData.roleId) {
        newErrors.roleId = "Teacher ID is required";
      }
      if (!formData.rolePassword) {
        newErrors.rolePassword = "Teacher password is required";
      }
    } else if (selectedRole === "admin") {
      if (!formData.roleId) {
        newErrors.roleId = "Admin ID is required";
      }
      if (!formData.rolePassword) {
        newErrors.rolePassword = "Admin password is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin({
        email: loginMethod === "email" ? formData.email : formData.phone,
        password: formData.password,
        role: selectedRole || undefined,
        roleId: formData.roleId || undefined,
        rolePassword: formData.rolePassword || undefined
      });
    }
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep("role");
    setSelectedRole(null);
    setFormData({
      email: "",
      phone: "",
      password: "",
      roleId: "",
      rolePassword: ""
    });
    setErrors({});
  };

  const handleSocialLogin = (provider: string) => {
    // Mock social login - in real app, integrate with OAuth providers
    console.log(`Logging in with ${provider}`);
    onLogin({
      email: `user@${provider.toLowerCase()}.com`,
      password: "social_login"
    });
  };

  // Show role selection step
  if (currentStep === "role") {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2ECC71] via-[#27AE60] to-[#1E8449] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">EcoAlly</h1>
          <p className="text-white/80 text-lg">
            Welcome back, {selectedRole}! {selectedRole === "student" ? "Continue your eco journey!" : `Enter your ${selectedRole} credentials.`}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          {/* Back to Role Selection */}
          <div className="flex items-center mb-4">
            <button
              type="button"
              onClick={handleBackToRoleSelection}
              className="text-[#2ECC71] hover:text-[#27AE60] text-sm font-medium flex items-center"
            >
              ← Change Role
            </button>
            <div className="ml-auto">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2ECC71]/10 text-[#2ECC71]">
                {selectedRole?.charAt(0).toUpperCase() + (selectedRole?.slice(1) || "")}
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Login Method Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === "email"
                    ? "bg-white text-[#2ECC71] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === "phone"
                    ? "bg-white text-[#2ECC71] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </button>
            </div>

            {/* Email/Phone Input */}
            <div>
              <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
                {loginMethod === "email" ? "Email Address" : "Phone Number"}
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="contact"
                  type={loginMethod === "email" ? "email" : "tel"}
                  value={loginMethod === "email" ? formData.email : formData.phone}
                  onChange={(e) => handleInputChange(loginMethod, e.target.value)}
                  placeholder={loginMethod === "email" ? "Enter your email" : "Enter your phone number"}
                  className={`pl-10 ${errors[loginMethod] ? "border-red-500" : ""}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {loginMethod === "email" ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              {errors[loginMethod] && (
                <p className="mt-1 text-sm text-red-600">{errors[loginMethod]}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Role-specific fields for Teacher/Admin */}
            {(selectedRole === "teacher" || selectedRole === "admin") && (
              <>
                <div>
                  <Label htmlFor="roleId" className="text-sm font-medium text-gray-700">
                    {selectedRole === "teacher" ? "Teacher ID" : "Admin ID"}
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="roleId"
                      type="text"
                      value={formData.roleId}
                      onChange={(e) => handleInputChange("roleId", e.target.value)}
                      placeholder={`Enter your ${selectedRole} ID`}
                      className={`pl-10 ${errors.roleId ? "border-red-500" : ""}`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IdCard className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {errors.roleId && (
                    <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="rolePassword" className="text-sm font-medium text-gray-700">
                    {selectedRole === "teacher" ? "Teacher Password" : "Admin Password"}
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="rolePassword"
                      type={showRolePassword ? "text" : "password"}
                      value={formData.rolePassword}
                      onChange={(e) => handleInputChange("rolePassword", e.target.value)}
                      placeholder={`Enter your ${selectedRole} password`}
                      className={`pl-10 pr-10 ${errors.rolePassword ? "border-red-500" : ""}`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRolePassword(!showRolePassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showRolePassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.rolePassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.rolePassword}</p>
                  )}
                </div>
              </>
            )}

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#2ECC71] hover:text-[#27AE60] font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white py-3 rounded-xl font-medium transition-colors"
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Login Options */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              variant="outline"
              className="w-full py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl"
            >
              <Chrome className="w-5 h-5 mr-3 text-red-500" />
              Continue with Google
            </Button>
            
            <Button
              type="button"
              onClick={() => handleSocialLogin("Microsoft")}
              variant="outline"
              className="w-full py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl"
            >
              <div className="w-5 h-5 mr-3 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              Continue with Microsoft
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onShowSignup}
                className="text-[#2ECC71] hover:text-[#27AE60] font-medium"
              >
                Sign up now
              </button>
            </p>
          </div>
        </div>

        {/* Pre-filled Credentials Help */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
          <h3 className="font-medium mb-3">🧪 Test Credentials for {selectedRole?.charAt(0).toUpperCase() + (selectedRole?.slice(1) || "")}:</h3>
          
          {/* Role-specific credentials */}
          {selectedRole === "student" && (
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-sm space-y-1 text-white/90">
                <p><strong>Email:</strong> alex.johnson@email.com</p>
                <p><strong>Password:</strong> EcoAlly123!</p>
              </div>
            </div>
          )}
          
          {selectedRole === "teacher" && (
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-sm space-y-1 text-white/90">
                <p><strong>Email:</strong> sarah.green@email.com</p>
                <p><strong>Password:</strong> Nature@123</p>
                <p><strong>Teacher ID:</strong> FAC-SEAS-2024-15</p>
                <p><strong>Teacher Password:</strong> Nature@123</p>
              </div>
            </div>
          )}
          
          {selectedRole === "admin" && (
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-sm space-y-1 text-white/90">
                <p><strong>Email:</strong> mike.earth@email.com</p>
                <p><strong>Password:</strong> Planet#2024</p>
                <p><strong>Admin ID:</strong> ADM-DENV-2024-001</p>
                <p><strong>Admin Password:</strong> Planet#2024</p>
              </div>
            </div>
          )}
          
          {/* Signup Demo Data */}
          <div className="mt-4 pt-3 border-t border-white/20">
            <p className="text-xs text-white/70 mb-2">📝 For New Registration Testing:</p>
            <div className="text-sm space-y-1 text-white/90">
              <p><strong>Demo Email:</strong> emma.wilson@email.com</p>
              <p><strong>Demo Username:</strong> EcoExplorer2024</p>
              <p><strong>Demo Password:</strong> GreenFuture123!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}