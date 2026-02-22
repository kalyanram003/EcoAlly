import { useState } from "react";
import { BarChart3, Download, Calendar, Filter, TrendingUp, Users, Trophy, Clock } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface TeacherReportsProps {
  currentUser: any;
  selectedClass: string;
}

export function TeacherReports({ currentUser, selectedClass }: TeacherReportsProps) {
  const [reportType, setReportType] = useState<"overview" | "individual" | "activity" | "progress">("overview");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "semester">("month");

  const overviewData = {
    totalStudents: 28,
    activeStudents: 22,
    avgProgress: 78,
    completedChallenges: 156,
    totalPoints: 45600,
    avgTimeSpent: "2.5h",
    topPerformer: "Sarah Chen",
    strugglingStudents: 3
  };

  const activityData = [
    { date: "2024-03-15", logins: 25, completions: 18, points: 1450 },
    { date: "2024-03-14", logins: 22, completions: 15, points: 1200 },
    { date: "2024-03-13", logins: 26, completions: 20, points: 1600 },
    { date: "2024-03-12", logins: 20, completions: 12, points: 950 },
    { date: "2024-03-11", logins: 24, completions: 17, points: 1350 }
  ];

  const progressByCategory = [
    { category: "Water Conservation", avgScore: 85, completion: 92 },
    { category: "Renewable Energy", avgScore: 78, completion: 85 },
    { category: "Climate Change", avgScore: 82, completion: 88 },
    { category: "Recycling", avgScore: 90, completion: 95 },
    { category: "Biodiversity", avgScore: 75, completion: 80 }
  ];

  const topStudents = [
    { name: "Sarah Chen", points: 2450, progress: 95, streak: 12 },
    { name: "Alex Johnson", points: 2380, progress: 88, streak: 8 },
    { name: "Emma Wilson", points: 2210, progress: 92, streak: 15 },
    { name: "Lisa Wang", points: 1890, progress: 75, streak: 6 },
    { name: "David Park", points: 1750, progress: 70, streak: 4 }
  ];

  const strugglingStudents = [
    { name: "Michael Brown", points: 1450, progress: 58, lastActive: "2 days ago", issues: ["Low engagement", "Missing assignments"] },
    { name: "Jessica Liu", points: 1380, progress: 55, lastActive: "3 days ago", issues: ["Difficulty with concepts", "Needs support"] },
    { name: "Ryan Davis", points: 1200, progress: 48, lastActive: "5 days ago", issues: ["Inconsistent participation", "Time management"] }
  ];

  const generateReport = () => {
    // Generate and download report logic
    console.log(`Generating ${reportType} report for ${timeRange}`);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
          🚧 <strong>Demo Mode:</strong> This page currently displays mock data. Backend integration for reporting is coming soon.
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Class Reports</h2>
            <p className="text-sm text-gray-600">Analyze student performance and engagement</p>
          </div>
          <Button
            onClick={generateReport}
            className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Report Configuration</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
            >
              <option value="overview">Class Overview</option>
              <option value="individual">Individual Progress</option>
              <option value="activity">Activity Analysis</option>
              <option value="progress">Learning Progress</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="semester">This Semester</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Overview Report */}
      {reportType === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{overviewData.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-[#2ECC71]" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-[#2ECC71]">{overviewData.activeStudents}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#2ECC71]" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{overviewData.avgProgress}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Challenges Completed</p>
                  <p className="text-2xl font-bold text-purple-600">{overviewData.completedChallenges}</p>
                </div>
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
          </div>

          {/* Top Performers */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Top Performers</h3>
            <div className="space-y-3">
              {topStudents.slice(0, 5).map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#2ECC71] rounded-full flex items-center justify-center text-white font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.points} points • {student.progress}% progress</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-[#2ECC71]">{student.streak} day streak</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Students Needing Attention */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Students Needing Attention</h3>
            <div className="space-y-3">
              {strugglingStudents.map((student, index) => (
                <div key={index} className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.points} points • {student.progress}% progress</p>
                    </div>
                    <div className="text-sm text-orange-600">Last active: {student.lastActive}</div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {student.issues.map((issue, issueIndex) => (
                      <span key={issueIndex} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Activity Report */}
      {reportType === "activity" && (
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Daily Activity Trends</h3>
            <div className="space-y-4">
              {activityData.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-900">{day.date}</div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{day.logins} logins</span>
                      <span>{day.completions} completions</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-[#2ECC71]">{day.points} points</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Activity Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">113</div>
                <div className="text-sm text-gray-600">Total Logins</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">82</div>
                <div className="text-sm text-gray-600">Total Completions</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">6550</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">2.3h</div>
                <div className="text-sm text-gray-600">Avg Time/Day</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Progress Report */}
      {reportType === "progress" && (
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Progress by Category</h3>
            <div className="space-y-4">
              {progressByCategory.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                    <span className="text-sm text-gray-600">{category.completion}% completion</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#2ECC71] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.completion}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">Average Score: {category.avgScore}%</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Learning Objectives Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-green-800">Water Conservation Awareness</span>
                <span className="text-sm font-medium text-green-900">95% Achieved</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-green-800">Recycling Knowledge</span>
                <span className="text-sm font-medium text-green-900">92% Achieved</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm text-yellow-800">Renewable Energy Understanding</span>
                <span className="text-sm font-medium text-yellow-900">78% Achieved</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm text-yellow-800">Climate Change Impact</span>
                <span className="text-sm font-medium text-yellow-900">82% Achieved</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Individual Report */}
      {reportType === "individual" && (
        <Card className="p-4">
          <h3 className="font-medium text-gray-900 mb-3">Individual Student Reports</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select specific students to generate detailed individual progress reports
          </p>

          <div className="space-y-2 mb-4">
            {topStudents.map((student, index) => (
              <label key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-900">{student.name}</span>
                <span className="text-xs text-gray-500">({student.points} points)</span>
              </label>
            ))}
          </div>

          <Button className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white">
            Generate Individual Reports
          </Button>
        </Card>
      )}
    </div>
  );
}