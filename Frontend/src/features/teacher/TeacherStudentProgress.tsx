import { useState } from "react";
import { Search, Filter, TrendingUp, Trophy, Clock, Book, Eye, Star } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface TeacherStudentProgressProps {
  currentUser: any;
  selectedClass: string;
}

export function TeacherStudentProgress({ currentUser, selectedClass }: TeacherStudentProgressProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [filterBy, setFilterBy] = useState<"all" | "active" | "struggling" | "excelling">("all");

  const students = [
    {
      id: "1",
      name: "Emma Wilson",
      avatar: "👩‍🎓",
      email: "emma.wilson@email.com",
      totalPoints: 2210,
      currentStreak: 15,
      longestStreak: 20,
      progress: 92,
      lastActive: "2 mins ago",
      completedChallenges: 18,
      totalChallenges: 20,
      badges: 12,
      timeSpent: "45h 23m",
      status: "excelling",
      weeklyActivity: [80, 95, 70, 85, 90, 88, 92],
      recentActivities: [
        { task: "Water Conservation Quiz", completed: true, points: 50, time: "2 mins ago" },
        { task: "Recycling Challenge", completed: true, points: 75, time: "1 hour ago" },
        { task: "Ecosystem Game", completed: true, points: 60, time: "3 hours ago" }
      ]
    },
    {
      id: "2",
      name: "Alex Johnson",
      avatar: "👨‍🎓",
      email: "alex.johnson@email.com",
      totalPoints: 2380,
      currentStreak: 8,
      longestStreak: 12,
      progress: 88,
      lastActive: "15 mins ago",
      completedChallenges: 17,
      totalChallenges: 20,
      badges: 14,
      timeSpent: "52h 10m",
      status: "excelling",
      weeklyActivity: [85, 90, 88, 82, 75, 85, 88],
      recentActivities: [
        { task: "Climate Change Quiz", completed: true, points: 80, time: "15 mins ago" },
        { task: "Energy Conservation", completed: false, points: 0, time: "2 hours ago" },
        { task: "Nature Photography", completed: true, points: 65, time: "1 day ago" }
      ]
    },
    {
      id: "3",
      name: "Sarah Chen",
      avatar: "👩‍🎓",
      email: "sarah.chen@email.com",
      totalPoints: 2450,
      currentStreak: 12,
      longestStreak: 25,
      progress: 95,
      lastActive: "5 mins ago",
      completedChallenges: 19,
      totalChallenges: 20,
      badges: 16,
      timeSpent: "58h 45m",
      status: "excelling",
      weeklyActivity: [95, 92, 88, 90, 95, 98, 95],
      recentActivities: [
        { task: "Biodiversity Challenge", completed: true, points: 100, time: "5 mins ago" },
        { task: "Sustainable Living Quiz", completed: true, points: 85, time: "30 mins ago" },
        { task: "Green Energy Game", completed: true, points: 70, time: "2 hours ago" }
      ]
    },
    {
      id: "4",
      name: "Michael Brown",
      avatar: "👨‍🎓",
      email: "michael.brown@email.com",
      totalPoints: 1450,
      currentStreak: 3,
      longestStreak: 7,
      progress: 58,
      lastActive: "2 days ago",
      completedChallenges: 8,
      totalChallenges: 20,
      badges: 6,
      timeSpent: "22h 15m",
      status: "struggling",
      weeklyActivity: [40, 35, 50, 45, 30, 0, 0],
      recentActivities: [
        { task: "Basic Recycling Quiz", completed: true, points: 30, time: "2 days ago" },
        { task: "Water Saving Tips", completed: false, points: 0, time: "3 days ago" },
        { task: "Pollution Awareness", completed: true, points: 40, time: "4 days ago" }
      ]
    },
    {
      id: "5",
      name: "Lisa Wang",
      avatar: "👩‍🎓",
      email: "lisa.wang@email.com",
      totalPoints: 1890,
      currentStreak: 6,
      longestStreak: 14,
      progress: 75,
      lastActive: "1 hour ago",
      completedChallenges: 14,
      totalChallenges: 20,
      badges: 9,
      timeSpent: "38h 50m",
      status: "active",
      weeklyActivity: [70, 75, 80, 65, 70, 78, 75],
      recentActivities: [
        { task: "Ocean Conservation", completed: true, points: 65, time: "1 hour ago" },
        { task: "Wildlife Protection", completed: true, points: 55, time: "4 hours ago" },
        { task: "Forest Preservation", completed: false, points: 0, time: "1 day ago" }
      ]
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === "all" || student.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excelling": return "text-green-600 bg-green-100";
      case "active": return "text-blue-600 bg-blue-100";
      case "struggling": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header with Search and Filters */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Progress</h2>
          <p className="text-sm text-gray-600">Monitor individual student performance and engagement</p>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
            />
          </div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
          >
            <option value="all">All Students</option>
            <option value="excelling">Excelling</option>
            <option value="active">Active</option>
            <option value="struggling">Struggling</option>
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-3">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{student.avatar}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </span>
                <Button
                  onClick={() => setSelectedStudent(student)}
                  size="sm"
                  variant="outline"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-[#2ECC71]">{student.totalPoints}</div>
                <div className="text-xs text-gray-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{student.progress}%</div>
                <div className="text-xs text-gray-600">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{student.currentStreak}</div>
                <div className="text-xs text-gray-600">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{student.badges}</div>
                <div className="text-xs text-gray-600">Badges</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Overall Progress</span>
                <span className="text-xs text-gray-600">{student.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(student.progress)}`}
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </div>

            {/* Last Activity */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Last active: {student.lastActive}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>{student.completedChallenges}/{student.totalChallenges} challenges</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Student Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{selectedStudent.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedStudent.name}</h3>
                    <p className="text-sm text-gray-600">Detailed Progress Report</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-[#2ECC71]/10 rounded-lg">
                  <div className="text-2xl font-bold text-[#2ECC71]">{selectedStudent.totalPoints}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                <div className="text-center p-3 bg-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedStudent.currentStreak}</div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>
                <div className="text-center p-3 bg-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedStudent.badges}</div>
                  <div className="text-sm text-gray-600">Badges Earned</div>
                </div>
                <div className="text-center p-3 bg-orange-100 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{selectedStudent.timeSpent}</div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
              </div>

              {/* Weekly Activity Chart */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Weekly Activity</h4>
                <div className="flex items-end space-x-2 h-20">
                  {selectedStudent.weeklyActivity.map((activity, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-[#2ECC71] rounded-t"
                        style={{ height: `${activity}%` }}
                      />
                      <div className="text-xs text-gray-600 mt-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent Activities</h4>
                <div className="space-y-3">
                  {selectedStudent.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.completed ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {activity.completed ? "✓" : "✗"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{activity.task}</p>
                          <p className="text-xs text-gray-600">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          activity.completed ? "text-[#2ECC71]" : "text-red-600"
                        }`}>
                          {activity.completed ? `+${activity.points}` : "0"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Insights */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Performance Insights</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-800">Strongest Subject</span>
                    <span className="text-sm font-medium text-blue-900">Water Conservation</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-orange-800">Needs Improvement</span>
                    <span className="text-sm font-medium text-orange-900">Renewable Energy</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-800">Most Active Time</span>
                    <span className="text-sm font-medium text-green-900">3:00 PM - 5:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}