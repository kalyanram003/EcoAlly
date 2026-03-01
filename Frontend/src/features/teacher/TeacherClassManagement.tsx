import { useState, useEffect } from "react";
import { Users, Plus, Settings, BarChart3, Calendar } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as api from "../../lib/api";

interface TeacherClassManagementProps {
  currentUser: any;
  selectedClass: string;
  onClassChange: (classId: string) => void;
}

export function TeacherClassManagement({ currentUser, selectedClass, onClassChange }: TeacherClassManagementProps) {
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassForm, setNewClassForm] = useState({ name: '', subject: 'Environmental Science', schedule: '' });
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    api.getTeacherClasses()
      .then(setClasses)
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
    api.getTeacherStudents()
      .then(setStudents)
      .catch(() => setStudents([]));
  }, []);

  const handleAddClass = async () => {
    if (!newClassForm.name.trim()) return;
    setIsCreating(true);
    try {
      const created = await api.createClass(newClassForm);
      setClasses(prev => [created, ...prev]);
      setNewClassForm({ name: '', subject: 'Environmental Science', schedule: '' });
      setShowAddClass(false);
    } catch (err: any) {
      alert(`Failed to create class: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Class Management</h2>
            <p className="text-sm text-gray-600">Manage your classes and student groups</p>
          </div>
          <Button
            onClick={() => setShowAddClass(true)}
            className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No classes yet. Create your first class!</div>
        ) : classes.map((classData) => (
          <Card key={classData.id} className={`p-4 cursor-pointer transition-all ${selectedClass === classData.id ? "ring-2 ring-[#2ECC71] bg-[#2ECC71]/5" : "hover:shadow-md"
            }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#2ECC71] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{classData.name}</h3>
                  <p className="text-sm text-gray-600">{classData.subject}</p>
                </div>
              </div>
              <button
                onClick={() => onClassChange(classData.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedClass === classData.id
                  ? "bg-[#2ECC71] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {selectedClass === classData.id ? "Current" : "Select"}
              </button>
            </div>

            {/* Class Stats */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {classData.studentIds?.length ?? classData.students ?? 0}
                </div>
                <div className="text-xs text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#2ECC71]">
                  {classData.schedule || '—'}
                </div>
                <div className="text-xs text-gray-600">Schedule</div>
              </div>
            </div>

            {/* Schedule */}
            {classData.schedule && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{classData.schedule}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
              <Button variant="outline" size="sm" className="flex-1">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add New Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Add New Class</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name
                </label>
                <input
                  type="text"
                  value={newClassForm.name}
                  onChange={(e) => setNewClassForm({ ...newClassForm, name: e.target.value })}
                  placeholder="e.g., Grade 11-A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={newClassForm.subject}
                  onChange={(e) => setNewClassForm({ ...newClassForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                >
                  <option>Environmental Science</option>
                  <option>Earth Sciences</option>
                  <option>Biology</option>
                  <option>Chemistry</option>
                  <option>Physics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule
                </label>
                <input
                  type="text"
                  value={newClassForm.schedule}
                  onChange={(e) => setNewClassForm({ ...newClassForm, schedule: e.target.value })}
                  placeholder="e.g., Mon, Wed, Fri - 9:00 AM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <Button
                onClick={handleAddClass}
                disabled={isCreating}
                className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60] text-white disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Class'}
              </Button>
              <Button
                onClick={() => setShowAddClass(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Class Analytics Overview */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">All Classes Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-[#2ECC71]/10 rounded-lg">
            <div className="text-2xl font-bold text-[#2ECC71]">
              {students.length}
            </div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="text-center p-3 bg-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {classes.length}
            </div>
            <div className="text-sm text-gray-600">Total Classes</div>
          </div>
        </div>
      </Card>
    </div>
  );
}