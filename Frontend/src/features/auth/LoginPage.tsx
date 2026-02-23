import { useState } from "react";
import { Mail, Phone, Lock, Eye, EyeOff, Chrome, ArrowRight, Leaf } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RoleSelector } from "./RoleSelector";

interface LoginPageProps {
  onLogin: (credentials: { identifier: string; password: string; role?: string }) => void;
  onShowSignup: () => void;
}

export function LoginPage({ onLogin, onShowSignup }: LoginPageProps) {
  const [currentStep, setCurrentStep] = useState<"role" | "credentials">("role");
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | null>(null);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleRoleSelect = (role: "student" | "teacher") => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin({
        identifier: loginMethod === "email" ? formData.email : formData.phone,
        password: formData.password,
        role: selectedRole || undefined,
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
    });
    setErrors({});
  };

  const handleSocialLogin = (provider: string) => {
    // Mock social login - in real app, integrate with OAuth providers
    console.log(`Logging in with ${provider}`);
    onLogin({
      identifier: `user@${provider.toLowerCase()}.com`,
      password: "social_login"
    });
  };

  // Show role selection step
  if (currentStep === "role") {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT BRAND PANEL ── desktop only */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-gradient-to-br from-[var(--forest-700)] to-[var(--forest-600)] relative overflow-hidden p-10 xl:p-14">
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-40px] w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        {/* Geometric frame decorations */}
        <div className="absolute bottom-16 right-10 w-32 h-32 border border-white/15 pointer-events-none" />
        <div className="absolute bottom-12 right-14 w-32 h-32 border border-white/10 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>EcoAlly</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl xl:text-5xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Your eco-journey<br />continues here.
          </h2>
          <p className="text-[var(--forest-100)] text-lg leading-relaxed mb-10">
            Log back in to track your progress, complete today&apos;s challenge, and grow your impact.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { value: '50K+', label: 'Students' },
              { value: '1.2M', label: 'Points Earned' },
              { value: '8,400+', label: 'Trees Planted' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
                <div className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                <div className="text-[var(--forest-100)] text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[var(--forest-100)]/60 text-sm">
          &copy; 2026 EcoAlly. Making the planet greener.
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-start bg-[var(--bg-base)] px-6 py-12 lg:px-12 xl:px-16 overflow-y-auto">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="bg-[var(--forest-600)] rounded-full p-1.5">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>EcoAlly</span>
        </div>

        <div className="w-full max-w-md">
          {/* Login Form */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            {/* Back to Role Selection */}
            <div className="flex items-center mb-4">
              <button
                type="button"
                onClick={handleBackToRoleSelection}
                className="text-[var(--forest-600)] hover:text-[var(--forest-700)] text-sm font-medium flex items-center"
              >
                ← Change Role
              </button>
              <div className="ml-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--forest-50)] text-[var(--forest-600)]">
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
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${loginMethod === "email"
                    ? "bg-white text-[var(--forest-600)] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("phone")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${loginMethod === "phone"
                    ? "bg-white text-[var(--forest-600)] shadow-sm"
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

              {/* Teacher note – no extra credentials needed */}
              {selectedRole === "teacher" && (
                <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                  ℹ️ Use your registered email/phone and password to sign in as {selectedRole}.
                </div>
              )}

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-[var(--forest-600)] hover:text-[var(--forest-700)] font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-[var(--forest-600)] hover:bg-[var(--forest-700)] text-white py-3 rounded-xl font-medium transition-colors"
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
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onShowSignup}
                  className="text-[var(--forest-600)] hover:text-[var(--forest-700)] font-medium"
                >
                  Sign up now
                </button>
              </p>
            </div>
          </div>

          {/* Pre-filled Credentials Help */}
          <div className="mt-6 bg-[var(--forest-50)] border border-[var(--sage-300)] rounded-xl p-4 text-gray-800">
            <h3 className="font-medium mb-3">🧪 Test Credentials for {selectedRole?.charAt(0).toUpperCase() + (selectedRole?.slice(1) || "")}:</h3>

            {/* Role-specific credentials */}
            {selectedRole === "student" && (
              <div className="bg-white rounded-lg p-3 border border-[var(--sage-300)]">
                <div className="text-sm space-y-1 text-gray-700">
                  <p><strong>Email:</strong> alex.johnson@email.com</p>
                  <p><strong>Password:</strong> EcoAlly123!</p>
                </div>
              </div>
            )}

            {selectedRole === "teacher" && (
              <div className="bg-white rounded-lg p-3 border border-[var(--sage-300)]">
                <div className="text-sm space-y-1 text-gray-700">
                  <p><strong>Email:</strong> sarah.green@email.com</p>
                  <p><strong>Password:</strong> Nature@123</p>
                  <p><strong>Teacher ID:</strong> FAC-SEAS-2024-15</p>
                  <p><strong>Teacher Password:</strong> Nature@123</p>
                </div>
              </div>
            )}

            {/* Signup Demo Data */}
            <div className="mt-4 pt-3 border-t border-[var(--sage-300)]">
              <p className="text-xs text-gray-600 mb-2">📝 For New Registration Testing:</p>
              <div className="text-sm space-y-1 text-gray-700">
                <p><strong>Demo Email:</strong> emma.wilson@email.com</p>
                <p><strong>Demo Username:</strong> EcoExplorer2024</p>
                <p><strong>Demo Password:</strong> GreenFuture123!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
