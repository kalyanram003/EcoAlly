import { useState, useEffect } from "react";
import { TrendingUp, Users, CheckCircle, Trophy, Clock, BookOpen } from "lucide-react";
import { Card } from "../../components/ui/card";
import * as api from "../../lib/api";

interface TeacherOverviewProps {
  currentUser: any;
  selectedClass: string;
  onSectionChange: (section: string) => void;
}

export function TeacherOverview({ currentUser, selectedClass, onSectionChange }: TeacherOverviewProps) {
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getTeacherOverview()
      .then((data) => setOverviewData(data))
      .catch(() => setOverviewData(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    totalStudents: overviewData?.totalStudents ?? 0,
    activeToday: overviewData?.activeToday ?? 0,
    completedChallenges: overviewData?.totalChallengeSubmissions ?? overviewData?.completedChallenges ?? 0,
    averageProgress: overviewData?.averageProgress ?? 0,
    weeklyGrowth: overviewData?.weeklyGrowth ?? 0,
  };

  const recentActivity: { student: string; action: string; time: string; points: number }[] = (() => {
    if (!overviewData) return [];
    const quizItems = (overviewData.recentQuizAttempts ?? []).map((a: any) => ({
      student: a.studentName ?? a.name ?? "Student",
      action: `Completed ${a.quizTitle ?? "quiz"}`,
      time: a.submittedAt ? new Date(a.submittedAt).toLocaleTimeString() : "recently",
      points: a.pointsEarned ?? 0,
    }));
    const challengeItems = (overviewData.recentChallengeSubmissions ?? []).map((s: any) => ({
      student: s.studentName ?? s.name ?? "Student",
      action: `Submitted ${s.challengeTitle ?? "challenge"}`,
      time: s.submittedAt ? new Date(s.submittedAt).toLocaleTimeString() : "recently",
      points: s.pointsEarned ?? 0,
    }));
    // Interleave and take top 4
    return [...quizItems, ...challengeItems].slice(0, 4);
  })();

  const topPerformers: { name: string; points: number; streak: number; avatar: string }[] =
    (overviewData?.topPerformers ?? []).map((s: any) => ({
      name: s.name ?? s.username ?? "Student",
      points: s.totalPoints ?? s.points ?? 0,
      streak: s.currentStreak ?? s.streak ?? 0,
      avatar: s.avatarUrl ?? "👤",
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Loading overview…
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-orange-600">{overviewData?.materialsShared ?? 0}</p>
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
      {topPerformers.length > 0 && (
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
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
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
      )}

      {/* Empty state when no data from API */}
      {!overviewData && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>Could not load overview data. Is the backend running?</p>
        </div>
      )}
    </div>
  );
}