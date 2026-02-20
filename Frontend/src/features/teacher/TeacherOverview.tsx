import { TrendingUp, Users, CheckCircle, Trophy, Clock, BookOpen } from "lucide-react";
import { Card } from "../../components/ui/card";

interface TeacherOverviewProps {
  currentUser: any;
  selectedClass: string;
  onSectionChange: (section: string) => void;
}

export function TeacherOverview({ currentUser, selectedClass, onSectionChange }: TeacherOverviewProps) {
  const classStats = {
    "class-10a": {
      totalStudents: 28,
      activeToday: 22,
      completedChallenges: 15,
      averageProgress: 78,
      weeklyGrowth: 12
    },
    "class-10b": {
      totalStudents: 25,
      activeToday: 18,
      completedChallenges: 12,
      averageProgress: 72,
      weeklyGrowth: 8
    },
    "class-9a": {
      totalStudents: 30,
      activeToday: 25,
      completedChallenges: 20,
      averageProgress: 85,
      weeklyGrowth: 15
    },
    "class-9b": {
      totalStudents: 27,
      activeToday: 19,
      completedChallenges: 14,
      averageProgress: 69,
      weeklyGrowth: 6
    }
  };

  const stats = classStats[selectedClass as keyof typeof classStats];

  const recentActivity = [
    {
      student: "Emma Wilson",
      action: "Completed Water Conservation Quiz",
      time: "2 mins ago",
      points: 50
    },
    {
      student: "Alex Johnson",
      action: "Submitted Recycling Challenge",
      time: "5 mins ago",
      points: 75
    },
    {
      student: "Sarah Chen",
      action: "Achieved 7-day streak",
      time: "12 mins ago",
      points: 100
    },
    {
      student: "Michael Brown",
      action: "Completed Ecosystem Game",
      time: "18 mins ago",
      points: 60
    }
  ];

  const topPerformers = [
    { name: "Sarah Chen", points: 2450, streak: 12, avatar: "👩‍🎓" },
    { name: "Alex Johnson", points: 2380, streak: 8, avatar: "👨‍🎓" },
    { name: "Emma Wilson", points: 2210, streak: 15, avatar: "👩‍🎓" },
    { name: "Michael Brown", points: 2100, streak: 6, avatar: "👨‍🎓" }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students Active Today</p>
              <p className="text-2xl font-bold text-[#2ECC71]">{stats.activeToday}</p>
              <p className="text-xs text-gray-500">of {stats.totalStudents} total</p>
            </div>
            <div className="w-10 h-10 bg-[#2ECC71]/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#2ECC71]" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.averageProgress}%</p>
              <p className="text-xs text-green-600">+{stats.weeklyGrowth}% this week</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Challenges Completed</p>
              <p className="text-2xl font-bold text-purple-600">{stats.completedChallenges}</p>
              <p className="text-xs text-gray-500">this week</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Materials Shared</p>
              <p className="text-2xl font-bold text-orange-600">8</p>
              <p className="text-xs text-gray-500">this month</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onSectionChange("challenges")}
            className="flex items-center space-x-2 p-3 bg-[#2ECC71]/10 rounded-lg hover:bg-[#2ECC71]/20 transition-colors"
          >
            <Trophy className="w-5 h-5 text-[#2ECC71]" />
            <span className="text-sm font-medium text-[#2ECC71]">Assign Challenge</span>
          </button>
          
          <button 
            onClick={() => onSectionChange("materials")}
            className="flex items-center space-x-2 p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Add Material</span>
          </button>
          
          <button 
            onClick={() => onSectionChange("students")}
            className="flex items-center space-x-2 p-3 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">View Students</span>
          </button>
          
          <button 
            onClick={() => onSectionChange("reports")}
            className="flex items-center space-x-2 p-3 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Generate Report</span>
          </button>
        </div>
      </Card>

      {/* Top Performers */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Top Performers This Week</h3>
        <div className="space-y-3">
          {topPerformers.map((student, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{student.avatar}</span>
                  <div className="text-xs font-medium text-gray-500">#{index + 1}</div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.points} points</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[#2ECC71]">{student.streak} day streak</div>
                <div className="text-xs text-gray-500">🔥</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#2ECC71]/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[#2ECC71]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{activity.student}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[#2ECC71]">+{activity.points}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}