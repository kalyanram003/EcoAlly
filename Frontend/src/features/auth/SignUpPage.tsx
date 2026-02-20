import { useState } from "react";
import { Mail, Phone, User, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check, X, AlertCircle, Zap } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface SignUpPageProps {
  onSignUp: (userData: { email: string; username: string; password: string }) => void;
  onBackToLogin: () => void;
}

export function SignUpPage({ onSignUp, onBackToLogin }: SignUpPageProps) {
  const [signupMethod, setSignupMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Demo data sets
  const demoData = {
    student: {
      email: "emma.wilson@email.com",
      username: "EcoExplorer2024",
      password: "GreenFuture123!"
    },
    teacher: {
      email: "david.green@email.com", 
      username: "TeacherGreen42",
      password: "EcoTeach@456"
    },
    admin: {
      email: "maria.santos@email.com",
      username: "AdminMaria_2024", 
      password: "SchoolAdmin789!"
    }
  };

  const fillDemoData = (type: keyof typeof demoData) => {
    const data = demoData[type];
    setFormData(prev => ({
      ...prev,
      email: signupMethod === "email" ? data.email : "",
      phone: signupMethod === "phone" ? "+1 (555) 999-8888" : "",
      username: data.username,
      password: data.password,
      confirmPassword: data.password
    }));
    
    // Update password strength for demo password
    setPasswordStrength({
      length: data.password.length >= 8,
      uppercase: /[A-Z]/.test(data.password),
      lowercase: /[a-z]/.test(data.password),
      number: /\d/.test(data.password),
      special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(data.password)
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    // Real-time password strength validation
    if (field === "password") {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(value)
      });
    }
  };

  const validateUsername = (username: string) => {
    // Only allow letters (upper/lower), numbers, and special characters
    const validChars = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/;
    return validChars.test(username);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email/Phone validation
    if (signupMethod === "email") {
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

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 20) {
      newErrors.username = "Username must be less than 20 characters";
    } else if (!validateUsername(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and special characters";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!passwordStrength.uppercase || !passwordStrength.lowercase || !passwordStrength.number || !passwordStrength.special) {
      newErrors.password = "Password must meet all requirements";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSignUp({
        email: signupMethod === "email" ? formData.email : formData.phone,
        username: formData.username,
        password: formData.password
      });
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? "text-green-600" : "text-gray-500"}`}>
      {met ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2ECC71] via-[#27AE60] to-[#1E8449] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBackToLogin}
            className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>
          
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl">🌱</span>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Join EcoLearn</h1>
          <p className="text-white/80">Start your eco-learning journey today!</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Signup Method Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSignupMethod("email")}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  signupMethod === "email"
                    ? "bg-white text-[#2ECC71] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setSignupMethod("phone")}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  signupMethod === "phone"
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
                {signupMethod === "email" ? "Email Address" : "Phone Number"}
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="contact"
                  type={signupMethod === "email" ? "email" : "tel"}
                  value={signupMethod === "email" ? formData.email : formData.phone}
                  onChange={(e) => handleInputChange(signupMethod, e.target.value)}
                  placeholder={signupMethod === "email" ? "Enter your email" : "Enter your phone number"}
                  className={`pl-10 ${errors[signupMethod] ? "border-red-500" : ""}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {signupMethod === "email" ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              {errors[signupMethod] && (
                <p className="mt-1 text-sm text-red-600">{errors[signupMethod]}</p>
              )}
            </div>

            {/* Username Input */}
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Choose a unique username"
                  className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Letters, numbers, and special characters only (3-20 characters)
              </p>
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
                  placeholder="Create a strong password"
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
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <PasswordRequirement met={passwordStrength.length} text="At least 8 characters" />
                  <PasswordRequirement met={passwordStrength.uppercase} text="One uppercase letter" />
                  <PasswordRequirement met={passwordStrength.lowercase} text="One lowercase letter" />
                  <PasswordRequirement met={passwordStrength.number} text="One number" />
                  <PasswordRequirement met={passwordStrength.special} text="One special character" />
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                By creating an account, you agree to our{" "}
                <button type="button" className="underline hover:no-underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="underline hover:no-underline">
                  Privacy Policy
                </button>.
              </p>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white py-3 rounded-xl font-medium transition-colors"
            >
              Create Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-[#2ECC71] hover:text-[#27AE60] font-medium"
              >
                Sign in instead
              </button>
            </p>
          </div>
        </div>

        {/* Example Username Help */}
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
          <h3 className="font-medium mb-3">🧪 Quick Fill Demo Data:</h3>
          
          {/* Demo Data Buttons */}
          <div className="space-y-2 mb-4">
            <button
              type="button"
              onClick={() => fillDemoData("student")}
              className="w-full bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors text-sm flex items-center justify-between"
            >
              <span>👨‍🎓 Student Data</span>
              <Zap className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => fillDemoData("teacher")}
              className="w-full bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors text-sm flex items-center justify-between"
            >
              <span>👨‍🏫 Teacher Data</span>
              <Zap className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => fillDemoData("admin")}
              className="w-full bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors text-sm flex items-center justify-between"
            >
              <span>👨‍💼 Admin Data</span>
              <Zap className="w-4 h-4" />
            </button>
          </div>
          
          <div className="border-t border-white/20 pt-3">
            <h4 className="font-medium mb-2">💡 Username Examples:</h4>
            <div className="text-sm space-y-1 text-white/90">
              <p>✅ EcoWarrior123</p>
              <p>✅ Green_Learner!</p>
              <p>✅ Earth@Care</p>
              <p>❌ eco warrior (no spaces)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}