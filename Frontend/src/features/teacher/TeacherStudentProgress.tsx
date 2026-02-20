import { useState, useEffect } from "react";
import { Search, TrendingUp, Trophy, Clock, Eye } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as api from "../../lib/api";

interface TeacherStudentProgressProps {
  currentUser: any;
  selectedClass: string;
}

export function TeacherStudentProgress({ currentUser, selectedClass }: TeacherStudentProgressProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [filterBy, setFilterBy] = useState<"all" | "active" | "struggling" | "excelling">("all");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getTeacherStudents()
      .then((data) => {
        const mapped = data.map((s: any) => ({
          id: s.id ?? s.userId ?? s._id,
          name: s.name ?? (`${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || s.username || "Student"),
          avatar: s.avatarUrl ?? "👤",
          email: s.email ?? "",
          totalPoints: s.totalPoints ?? s.points ?? 0,
          currentStreak: s.currentStreak ?? 0,
          longestStreak: s.longestStreak ?? 0,
          progress: s.progress ?? Math.min(100, Math.round(((s.totalPoints ?? 0) / 2000) * 100)),
          lastActive: s.lastActive ?? s.lastSeen ?? "Unknown",
          completedChallenges: s.challengesCompleted ?? 0,
          totalChallenges: s.totalChallenges ?? 20,
          badges: s.badges ?? 0,
          status: s.status ?? (
            (s.totalPoints ?? 0) >= 1800 ? "excelling" :
              (s.totalPoints ?? 0) >= 900 ? "active" : "struggling"
          ),
          recentActivities: s.recentActivities ?? [],
          weeklyActivity: s.weeklyActivity ?? [0, 0, 0, 0, 0, 0, 0],
        }));
        setStudents(mapped);
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Loading students…
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Progress</h2>
          <p className="text-sm text-gray-600">Monitor individual student performance and engagement</p>
        </div>

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

      {filteredStudents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {students.length === 0 ? "No students found." : "No students match your search."}
        </div>
      ) : (
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
      )}

      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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

            <div className="p-6 space-y-6">
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
                  <div className="text-2xl font-bold text-orange-600">{selectedStudent.longestStreak}</div>
                  <div className="text-sm text-gray-600">Best Streak</div>
                </div>
              </div>

              {selectedStudent.weeklyActivity?.some((v: number) => v > 0) && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Weekly Activity</h4>
                  <div className="flex items-end space-x-2 h-20">
                    {selectedStudent.weeklyActivity.map((activity: number, index: number) => (
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
              )}

              {selectedStudent.recentActivities?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recent Activities</h4>
                  <div className="space-y-3">
                    {selectedStudent.recentActivities.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.completed ? "bg-green-100" : "bg-red-100"
                            }`}>
                            {activity.completed ? "✓" : "✗"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{activity.task}</p>
                            <p className="text-xs text-gray-600">{activity.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${activity.completed ? "text-[#2ECC71]" : "text-red-600"
                            }`}>
                            {activity.completed ? `+${activity.points}` : "0"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-green-800">Challenges Completed</span>
                <span className="text-sm font-medium text-green-900">
                  {selectedStudent.completedChallenges} / {selectedStudent.totalChallenges}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}