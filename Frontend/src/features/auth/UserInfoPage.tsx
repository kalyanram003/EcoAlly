import { useState } from "react";
import { ArrowLeft, ArrowRight, User, Calendar, MapPin, Phone, Mail, GraduationCap, Home, Briefcase, Users, School, Building, Leaf } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";

interface UserInfoData {
  // Personal Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  userType: string;

  // Guardian Info
  guardianName: string;
  guardianRelationship: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianAddress: string;
  guardianOccupation: string;

  // Institute Info
  instituteName: string;
  instituteCity: string;
  instituteId: string;
  academicRollNo: string;
  gradeYear: string;
  sectionCourse: string;

  // Role-specific fields
  facultyId?: string;
  adminId?: string;
  rolePassword?: string;
}

interface UserInfoPageProps {
  initialData: { email: string; username: string; password: string };
  onComplete: (userInfo: UserInfoData) => void;
  onBack: () => void;
}

// Mock institute database for ID validation
const mockInstitutes = [
  { id: "SCH001", name: "Greenwood Elementary Institute", type: "school", city: "San Francisco" },
  { id: "SCH002", name: "Hollywood High Institute", type: "school", city: "Los Angeles" },
  { id: "SCH003", name: "Seattle Academy of Arts & Sciences", type: "school", city: "Seattle" },
  { id: "COL001", name: "Environmental Science College", type: "college", city: "Portland" },
  { id: "COL002", name: "Austin Environmental University", type: "college", city: "Austin" },
  { id: "COL003", name: "Denver Environmental Academy", type: "college", city: "Denver" }
];

export function UserInfoPage({ initialData, onComplete, onBack }: UserInfoPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserInfoData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: initialData.email,
    phone: "",
    city: "",
    address: "",
    userType: "",
    guardianName: "",
    guardianRelationship: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianAddress: "",
    guardianOccupation: "",
    instituteName: "",
    instituteCity: "",
    instituteId: "",
    academicRollNo: "",
    gradeYear: "",
    sectionCourse: "",
    facultyId: "",
    adminId: "",
    rolePassword: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper to get institute type from ID
  const getInstituteType = (id: string) => {
    const institute = mockInstitutes.find(inst => inst.id === id);
    return institute?.type || "school";
  };

  const handleInputChange = (field: keyof UserInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      // Personal Information
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.userType) newErrors.userType = "Please select your role";
    } else if (step === 2 && formData.userType === "student") {
      // Guardian Information (only for students)
      if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian name is required";
      if (!formData.guardianRelationship.trim()) newErrors.guardianRelationship = "Relationship is required";
      if (!formData.guardianEmail.trim()) newErrors.guardianEmail = "Guardian email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.guardianEmail)) newErrors.guardianEmail = "Please enter a valid email";
      if (!formData.guardianPhone.trim()) newErrors.guardianPhone = "Guardian phone is required";
      if (!formData.guardianAddress.trim()) newErrors.guardianAddress = "Guardian address is required";
      if (!formData.guardianOccupation.trim()) newErrors.guardianOccupation = "Guardian occupation is required";
    } else if ((step === 2 && formData.userType !== "student") || (step === 3 && formData.userType === "student")) {
      // Institute Information
      if (!formData.instituteName.trim()) newErrors.instituteName = "Institute name is required";
      if (!formData.instituteCity.trim()) newErrors.instituteCity = "Institute city is required";
      if (!formData.instituteId.trim()) newErrors.instituteId = "Institute ID is required";

      // Role-specific validation
      if (formData.userType === "student") {
        if (!formData.academicRollNo.trim()) newErrors.academicRollNo = "Academic roll number is required";
        if (!formData.gradeYear.trim()) newErrors.gradeYear = "Grade/Year is required";
        if (!formData.sectionCourse.trim()) newErrors.sectionCourse = "Section/Course is required";
      } else if (formData.userType === "teacher") {
        if (!formData.facultyId?.trim()) newErrors.facultyId = "Faculty ID is required";
        if (!formData.rolePassword?.trim()) newErrors.rolePassword = "Password is required";
      } else if (formData.userType === "admin") {
        if (!formData.adminId?.trim()) newErrors.adminId = "Admin ID is required";
        if (!formData.rolePassword?.trim()) newErrors.rolePassword = "Password is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTotalSteps = () => {
    return formData.userType === "student" ? 3 : 2;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const totalSteps = getTotalSteps();
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete(formData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Personal Information";
      case 2: return formData.userType === "student" ? "Guardian Information" : "Institute Information";
      case 3: return "Institute Information";
      default: return "";
    }
  };

  const renderStepIndicator = () => {
    const totalSteps = getTotalSteps();
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep
                  ? "bg-[#2ECC71] text-white"
                  : "bg-gray-200 text-gray-500"
                }`}
            >
              {step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-12 h-1 mx-2 ${step < currentStep ? "bg-[#2ECC71]" : "bg-gray-200"
                  }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Quick fill data for testing
  const demoPersonalData = {
    student: {
      firstName: "Emma",
      lastName: "Wilson",
      dateOfBirth: "2010-03-15",
      gender: "female",
      phone: "+1 (555) 234-5678",
      city: "San Francisco",
      address: "1234 Green Valley Road, Apt 5B",
      userType: "student"
    },
    teacher: {
      firstName: "David",
      lastName: "Green",
      dateOfBirth: "1985-07-22",
      gender: "male",
      phone: "+1 (555) 345-6789",
      city: "Portland",
      address: "567 Oak Street, Unit 12",
      userType: "teacher"
    },
    admin: {
      firstName: "Maria",
      lastName: "Santos",
      dateOfBirth: "1978-11-08",
      gender: "female",
      phone: "+1 (555) 456-7890",
      city: "Austin",
      address: "890 Education Boulevard",
      userType: "admin"
    }
  };

  const demoGuardianData = {
    guardianName: "Jennifer Wilson",
    guardianRelationship: "mother",
    guardianEmail: "jennifer.wilson@gmail.com",
    guardianPhone: "+1 (555) 234-5679",
    guardianAddress: "1234 Green Valley Road, Apt 5B",
    guardianOccupation: "Environmental Engineer"
  };

  const demoInstituteData = {
    school: {
      instituteName: "Greenwood Elementary Institute",
      instituteCity: "San Francisco",
      instituteId: "SCH001",
      academicRollNo: "2024-STU-001",
      gradeYear: "Grade 8",
      sectionCourse: "Section A"
    },
    college: {
      instituteName: "Environmental Science College",
      instituteCity: "Portland",
      instituteId: "COL001",
      academicRollNo: "ENV-2024-042",
      gradeYear: "Year 2",
      sectionCourse: "Environmental Studies"
    },
    teacher: {
      instituteName: "Environmental Science College",
      instituteCity: "Portland",
      instituteId: "COL001",
      facultyId: "FAC-ENV-2024-15",
      rolePassword: "EcoTeach@456"
    },
    admin: {
      instituteName: "Austin Environmental University",
      instituteCity: "Austin",
      instituteId: "COL002",
      adminId: "ADM-ENV-2024-003",
      rolePassword: "SchoolAdmin789!"
    }
  };

  const fillPersonalData = (type: 'student' | 'teacher' | 'admin') => {
    const data = demoPersonalData[type];
    setFormData(prev => ({ ...prev, ...data }));
    setErrors({});
  };

  const fillGuardianData = () => {
    setFormData(prev => ({ ...prev, ...demoGuardianData }));
    setErrors({});
  };

  const fillInstituteData = (type: 'school' | 'college' | 'teacher' | 'admin') => {
    const data = demoInstituteData[type];
    setFormData(prev => ({ ...prev, ...data }));
    setErrors({});
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      {/* Quick Fill Buttons */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-blue-800 mb-2">🚀 Quick Fill for Testing:</p>
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            onClick={() => fillPersonalData('student')}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Student Data
          </Button>
          <Button
            type="button"
            onClick={() => fillPersonalData('teacher')}
            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            Teacher Data
          </Button>
          <Button
            type="button"
            onClick={() => fillPersonalData('admin')}
            className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
          >
            Admin Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="Enter first name"
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Enter last name"
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
          Date of Birth *
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          className={errors.dateOfBirth ? "border-red-500" : ""}
        />
        {errors.dateOfBirth && (
          <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
        )}
      </div>

      <div>
        <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
          Gender *
        </Label>
        <select
          id="gender"
          value={formData.gender}
          onChange={(e) => handleInputChange("gender", e.target.value)}
          className={`mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71]/50 ${errors.gender ? "border-red-500" : ""
            }`}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          disabled
          className="bg-gray-100"
        />
        <p className="mt-1 text-xs text-gray-500">This email is from your account registration</p>
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Phone Number *
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          placeholder="Enter your phone number"
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <Label htmlFor="city" className="text-sm font-medium text-gray-700">
          City *
        </Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => handleInputChange("city", e.target.value)}
          placeholder="Enter your city"
          className={errors.city ? "border-red-500" : ""}
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
          Address *
        </Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="Enter your full address"
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div>
        <Label htmlFor="userType" className="text-sm font-medium text-gray-700">
          Sign up as *
        </Label>
        <select
          id="userType"
          value={formData.userType}
          onChange={(e) => handleInputChange("userType", e.target.value)}
          className={`mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71]/50 ${errors.userType ? "border-red-500" : ""
            }`}
        >
          <option value="">Select your role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        {errors.userType && (
          <p className="mt-1 text-sm text-red-600">{errors.userType}</p>
        )}
      </div>
    </div>
  );

  const renderGuardianInfo = () => (
    <div className="space-y-4">
      {/* Quick Fill Button for Guardian */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-sm font-medium text-green-800 mb-2">🚀 Quick Fill Guardian Info:</p>
        <Button
          type="button"
          onClick={fillGuardianData}
          className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          Fill Guardian Data
        </Button>
      </div>

      <div>
        <Label htmlFor="guardianName" className="text-sm font-medium text-gray-700">
          Parent/Guardian Full Name *
        </Label>
        <Input
          id="guardianName"
          value={formData.guardianName}
          onChange={(e) => handleInputChange("guardianName", e.target.value)}
          placeholder="Enter parent/guardian name"
          className={errors.guardianName ? "border-red-500" : ""}
        />
        {errors.guardianName && (
          <p className="mt-1 text-sm text-red-600">{errors.guardianName}</p>
        )}
      </div>

      <div>
        <Label htmlFor="guardianRelationship" className="text-sm font-medium text-gray-700">
          Relationship to User *
        </Label>
        <select
          id="guardianRelationship"
          value={formData.guardianRelationship}
          onChange={(e) => handleInputChange("guardianRelationship", e.target.value)}
          className={`mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71]/50 ${errors.guardianRelationship ? "border-red-500" : ""
            }`}
        >
          <option value="">Select relationship</option>
          <option value="mother">Mother</option>
          <option value="father">Father</option>
          <option value="grandmother">Grandmother</option>
          <option value="grandfather">Grandfather</option>
          <option value="aunt">Aunt</option>
          <option value="uncle">Uncle</option>
          <option value="guardian">Legal Guardian</option>
          <option value="other">Other</option>
        </select>
        {errors.guardianRelationship && (
          <p className="mt-1 text-sm text-red-600">{errors.guardianRelationship}</p>
        )}
      </div>

      <div>
        <Label htmlFor="guardianEmail" className="text-sm font-medium text-gray-700">
          Guardian Email *
        </Label>
        <Input
          id="guardianEmail"
          type="email"
          value={formData.guardianEmail}
          onChange={(e) => handleInputChange("guardianEmail", e.target.value)}
          placeholder="Enter guardian email"
          className={errors.guardianEmail ? "border-red-500" : ""}
        />
        {errors.guardianEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.guardianEmail}</p>
        )}
      </div>

      <div>
        <Label htmlFor="guardianPhone" className="text-sm font-medium text-gray-700">
          Guardian Phone Number *
        </Label>
        <Input
          id="guardianPhone"
          type="tel"
          value={formData.guardianPhone}
          onChange={(e) => handleInputChange("guardianPhone", e.target.value)}
          placeholder="Enter guardian phone number"
          className={errors.guardianPhone ? "border-red-500" : ""}
        />
        {errors.guardianPhone && (
          <p className="mt-1 text-sm text-red-600">{errors.guardianPhone}</p>
        )}
      </div>

      <div>
        <Label htmlFor="guardianAddress" className="text-sm font-medium text-gray-700">
          Guardian Address *
        </Label>
        <Input
          id="guardianAddress"
          value={formData.guardianAddress}
          onChange={(e) => handleInputChange("guardianAddress", e.target.value)}
          placeholder="Enter guardian address"
          className={errors.guardianAddress ? "border-red-500" : ""}
        />
        {errors.guardianAddress && (
          <p className="mt-1 text-sm text-red-600">{errors.guardianAddress}</p>
        )}
      </div>

      <div>
        <Label htmlFor="guardianOccupation" className="text-sm font-medium text-gray-700">
          Guardian Occupation *
        </Label>
        <Input
          id="guardianOccupation"
          value={formData.guardianOccupation}
          onChange={(e) => handleInputChange("guardianOccupation", e.target.value)}
          placeholder="Enter guardian occupation"
          className={errors.guardianOccupation ? "border-red-500" : ""}
        />
        {errors.guardianOccupation && (
          <p className="mt-1 text-sm text-red-600">{errors.guardianOccupation}</p>
        )}
      </div>
    </div>
  );

  const renderInstituteInfo = () => {
    const instituteType = getInstituteType(formData.instituteId);

    return (
      <div className="space-y-4">
        {/* Quick Fill Buttons for Institute */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm font-medium text-purple-800 mb-2">🚀 Quick Fill Institute Info:</p>
          <div className="flex gap-2 flex-wrap">
            {formData.userType === "student" && (
              <>
                <Button
                  type="button"
                  onClick={() => fillInstituteData('school')}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  School Data
                </Button>
                <Button
                  type="button"
                  onClick={() => fillInstituteData('college')}
                  className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded"
                >
                  College Data
                </Button>
              </>
            )}
            {formData.userType === "teacher" && (
              <Button
                type="button"
                onClick={() => fillInstituteData('teacher')}
                className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Teacher Data
              </Button>
            )}
            {formData.userType === "admin" && (
              <Button
                type="button"
                onClick={() => fillInstituteData('admin')}
                className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
              >
                Admin Data
              </Button>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="instituteName" className="text-sm font-medium text-gray-700">
            Institute Name *
          </Label>
          <Input
            id="instituteName"
            value={formData.instituteName}
            onChange={(e) => handleInputChange("instituteName", e.target.value)}
            placeholder="Enter your institute name"
            className={errors.instituteName ? "border-red-500" : ""}
          />
          {errors.instituteName && (
            <p className="mt-1 text-sm text-red-600">{errors.instituteName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="instituteCity" className="text-sm font-medium text-gray-700">
            Institute City *
          </Label>
          <Input
            id="instituteCity"
            value={formData.instituteCity}
            onChange={(e) => handleInputChange("instituteCity", e.target.value)}
            placeholder="Enter your institute city"
            className={errors.instituteCity ? "border-red-500" : ""}
          />
          {errors.instituteCity && (
            <p className="mt-1 text-sm text-red-600">{errors.instituteCity}</p>
          )}
        </div>

        <div>
          <Label htmlFor="instituteId" className="text-sm font-medium text-gray-700">
            Institute ID *
          </Label>
          <Input
            id="instituteId"
            value={formData.instituteId}
            onChange={(e) => handleInputChange("instituteId", e.target.value)}
            placeholder="Enter institute ID (e.g., SCH001, COL001)"
            className={errors.instituteId ? "border-red-500" : ""}
          />
          {errors.instituteId && (
            <p className="mt-1 text-sm text-red-600">{errors.instituteId}</p>
          )}
        </div>

        {/* Role-specific fields */}
        {formData.userType === "student" && (
          <>
            <div>
              <Label htmlFor="academicRollNo" className="text-sm font-medium text-gray-700">
                Academic Roll No. *
              </Label>
              <Input
                id="academicRollNo"
                value={formData.academicRollNo}
                onChange={(e) => handleInputChange("academicRollNo", e.target.value)}
                placeholder="Enter your roll number"
                className={errors.academicRollNo ? "border-red-500" : ""}
              />
              {errors.academicRollNo && (
                <p className="mt-1 text-sm text-red-600">{errors.academicRollNo}</p>
              )}
            </div>

            <div>
              <Label htmlFor="gradeYear" className="text-sm font-medium text-gray-700">
                {instituteType === "school" ? "Grade" : "Year"} *
              </Label>
              <select
                id="gradeYear"
                value={formData.gradeYear}
                onChange={(e) => handleInputChange("gradeYear", e.target.value)}
                className={`mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71]/50 ${errors.gradeYear ? "border-red-500" : ""
                  }`}
              >
                <option value="">Select {instituteType === "school" ? "grade" : "year"}</option>
                {instituteType === "school" ? (
                  <>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </>
                ) : (
                  <>
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                    <option value="Year 5">Year 5</option>
                  </>
                )}
              </select>
              {errors.gradeYear && (
                <p className="mt-1 text-sm text-red-600">{errors.gradeYear}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sectionCourse" className="text-sm font-medium text-gray-700">
                {instituteType === "school" ? "Section" : "Course"} *
              </Label>
              {instituteType === "school" ? (
                <select
                  id="sectionCourse"
                  value={formData.sectionCourse}
                  onChange={(e) => handleInputChange("sectionCourse", e.target.value)}
                  className={`mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71]/50 ${errors.sectionCourse ? "border-red-500" : ""
                    }`}
                >
                  <option value="">Select section</option>
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                  <option value="Section D">Section D</option>
                </select>
              ) : (
                <select
                  id="sectionCourse"
                  value={formData.sectionCourse}
                  onChange={(e) => handleInputChange("sectionCourse", e.target.value)}
                  className={`mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ECC71]/50 ${errors.sectionCourse ? "border-red-500" : ""
                    }`}
                >
                  <option value="">Select course</option>
                  <option value="Environmental Studies">Environmental Studies</option>
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Business Administration">Business Administration</option>
                  <option value="Arts">Arts</option>
                </select>
              )}
              {errors.sectionCourse && (
                <p className="mt-1 text-sm text-red-600">{errors.sectionCourse}</p>
              )}
            </div>
          </>
        )}

        {formData.userType === "teacher" && (
          <>
            <div>
              <Label htmlFor="facultyId" className="text-sm font-medium text-gray-700">
                Faculty ID *
              </Label>
              <Input
                id="facultyId"
                value={formData.facultyId || ""}
                onChange={(e) => handleInputChange("facultyId", e.target.value)}
                placeholder="Enter your faculty ID"
                className={errors.facultyId ? "border-red-500" : ""}
              />
              {errors.facultyId && (
                <p className="mt-1 text-sm text-red-600">{errors.facultyId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rolePassword" className="text-sm font-medium text-gray-700">
                Password *
              </Label>
              <Input
                id="rolePassword"
                type="password"
                value={formData.rolePassword || ""}
                onChange={(e) => handleInputChange("rolePassword", e.target.value)}
                placeholder="Enter your password"
                className={errors.rolePassword ? "border-red-500" : ""}
              />
              {errors.rolePassword && (
                <p className="mt-1 text-sm text-red-600">{errors.rolePassword}</p>
              )}
            </div>
          </>
        )}

        {formData.userType === "admin" && (
          <>
            <div>
              <Label htmlFor="adminId" className="text-sm font-medium text-gray-700">
                Admin ID *
              </Label>
              <Input
                id="adminId"
                value={formData.adminId || ""}
                onChange={(e) => handleInputChange("adminId", e.target.value)}
                placeholder="Enter your admin ID"
                className={errors.adminId ? "border-red-500" : ""}
              />
              {errors.adminId && (
                <p className="mt-1 text-sm text-red-600">{errors.adminId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rolePassword" className="text-sm font-medium text-gray-700">
                Password *
              </Label>
              <Input
                id="rolePassword"
                type="password"
                value={formData.rolePassword || ""}
                onChange={(e) => handleInputChange("rolePassword", e.target.value)}
                placeholder="Enter your password"
                className={errors.rolePassword ? "border-red-500" : ""}
              />
              {errors.rolePassword && (
                <p className="mt-1 text-sm text-red-600">{errors.rolePassword}</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

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
            Almost there!
          </h2>
          <p className="text-[var(--forest-100)] text-lg leading-relaxed mb-10">
            Just a few more details to personalize your EcoAlly experience.
          </p>
          <div className="space-y-3">
            {[
              { step: '01', label: 'Create Account', done: true },
              { step: '02', label: 'Personal Info', done: false, current: true },
              { step: '03', label: 'Start Learning', done: false },
            ].map(s => (
              <div key={s.step} className={`flex items-center gap-3 ${s.done ? 'opacity-60' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  s.done ? 'bg-white/30 text-white' :
                  s.current ? 'bg-white text-[var(--forest-700)]' :
                  'bg-white/10 text-white/50 border border-white/20'
                }`}>
                  {s.done ? '✓' : s.step}
                </div>
                <span className={`text-sm font-medium ${s.current ? 'text-white' : 'text-[var(--forest-100)]/70'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[var(--forest-100)]/60 text-sm">
          &copy; 2025 EcoAlly. Making the planet greener.
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-base)] px-6 py-12 lg:px-12 xl:px-16 overflow-y-auto">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="bg-[var(--forest-600)] rounded-full p-1.5">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>EcoAlly</span>
        </div>

        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="ml-2">
              <h1 className="text-xl font-semibold text-gray-900">Create Account</h1>
              <p className="text-sm text-gray-500">{getStepTitle()}</p>
            </div>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Form Content */}
          <div className="mb-8">
            {currentStep === 1 && renderPersonalInfo()}
            {currentStep === 2 && formData.userType === "student" && renderGuardianInfo()}
            {currentStep === 2 && formData.userType !== "student" && renderInstituteInfo()}
            {currentStep === 3 && formData.userType === "student" && renderInstituteInfo()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 py-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 py-3 bg-[var(--forest-600)] hover:bg-[var(--forest-700)] text-white"
            >
              {currentStep === getTotalSteps() ? "Complete" : "Next"}
              {currentStep < getTotalSteps() && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Removed duplicate content */
/* <div className="relative z-10">
  <h2 className="text-4xl xl:text-5xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
    Almost there!
  </h2>
  <p className="text-[var(--forest-100)] text-lg leading-relaxed mb-10">
    Just a few more details to personalize your EcoAlly experience.
  </p>
  <div className="space-y-3">
    { [
      { step: '01', label: 'Create Account', done: true },
      { step: '02', label: 'Personal Info', done: false, current: true },
      { step: '03', label: 'Start Learning', done: false },
    ].map(s => (
      <div key={s.step} className={`flex items-center gap-3 ${s.done ? 'opacity-60' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
          s.done ? 'bg-white/30 text-white' :
          s.current ? 'bg-white text-[var(--forest-700)]' :
          'bg-white/10 text-white/50 border border-white/20'
        }`}>
          {s.done ? '✓' : s.step}
        </div>
        <span className={`text-sm font-medium ${s.current ? 'text-white' : 'text-[var(--forest-100)]/70'}`}>
          {s.label}
        </span>
      </div>
    ))}
  </div>
</div> */