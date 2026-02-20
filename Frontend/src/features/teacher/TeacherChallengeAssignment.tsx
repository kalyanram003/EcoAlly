import { useState } from "react";
import { Plus, Send, Trophy, Users, Calendar, Clock, GamepadIcon, Heart, Brain, Recycle } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface TeacherChallengeAssignmentProps {
  currentUser: any;
  selectedClass: string;
}

export function TeacherChallengeAssignment({ currentUser, selectedClass }: TeacherChallengeAssignmentProps) {
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [selectedChallengeType, setSelectedChallengeType] = useState<string>("");
  const [challengeForm, setChallengeForm] = useState({
    title: "",
    description: "",
    type: "",
    difficulty: "easy",
    duration: "1",
    points: 50,
    deadline: ""
  });

  const challengeTypes = [
    {
      id: "games",
      name: "Games & Puzzles",
      icon: GamepadIcon,
      color: "bg-purple-100 text-purple-600",
      description: "Interactive games, puzzles, and educational activities",
      subcategories: ["Memory Games", "Puzzle Games", "Word Games", "Math Games", "Science Simulations"]
    },
    {
      id: "social",
      name: "Social Challenges",
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
      description: "Team-based activities and community engagement",
      subcategories: ["Group Projects", "Community Service", "Peer Collaboration", "Family Activities", "School Events"]
    },
    {
      id: "creative",
      name: "Creative Projects",
      icon: Brain,
      color: "bg-blue-100 text-blue-600",
      description: "Art, design, and creative expression activities",
      subcategories: ["Art Projects", "Photography", "Video Creation", "Writing", "Design Challenges"]
    },
    {
      id: "environmental",
      name: "Environmental Action",
      icon: Recycle,
      color: "bg-green-100 text-green-600",
      description: "Real-world environmental activities and conservation",
      subcategories: ["Recycling Tasks", "Energy Conservation", "Nature Observation", "Green Living", "Sustainability Projects"]
    }
  ];

  const assignedChallenges = [
    {
      id: "1",
      title: "Water Conservation Quest",
      type: "environmental",
      difficulty: "easy",
      duration: "3 days",
      points: 75,
      assignedDate: "2024-03-15",
      deadline: "2024-03-18",
      participants: 22,
      completed: 15,
      status: "active"
    },
    {
      id: "2",
      title: "Ecosystem Memory Game",
      type: "games",
      difficulty: "medium",
      duration: "1 week",
      points: 100,
      assignedDate: "2024-03-12",
      deadline: "2024-03-19",
      participants: 28,
      completed: 28,
      status: "completed"
    },
    {
      id: "3",
      title: "Community Clean-Up Project",
      type: "social",
      difficulty: "hard",
      duration: "2 weeks",
      points: 150,
      assignedDate: "2024-03-10",
      deadline: "2024-03-24",
      participants: 25,
      completed: 8,
      status: "active"
    }
  ];

  const predefinedChallenges = {
    games: [
      "Ecosystem Builder Game",
      "Climate Change Quiz",
      "Renewable Energy Puzzle",
      "Ocean Life Memory Match",
      "Green City Planning Game"
    ],
    social: [
      "Family Eco Challenge",
      "School Garden Project",
      "Neighborhood Recycling Drive",
      "Environmental Awareness Campaign",
      "Green Team Leadership"
    ],
    creative: [
      "Design an Eco-Friendly Product",
      "Create Environmental Poster",
      "Nature Photography Contest",
      "Write Green Story",
      "Make Recycled Art"
    ],
    environmental: [
      "7-Day Energy Saving Challenge",
      "Plastic-Free Week",
      "Plant a Garden",
      "Water Conservation Audit",
      "Carbon Footprint Tracker"
    ]
  };

  const handleCreateChallenge = () => {
    if (challengeForm.title && challengeForm.type) {
      // Create challenge logic here
      console.log("Creating challenge:", challengeForm);
      setShowCreateChallenge(false);
      setChallengeForm({
        title: "",
        description: "",
        type: "",
        difficulty: "easy",
        duration: "1",
        points: 50,
        deadline: ""
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-600";
      case "completed": return "bg-blue-100 text-blue-600";
      case "upcoming": return "bg-yellow-100 text-yellow-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-600";
      case "medium": return "bg-yellow-100 text-yellow-600";
      case "hard": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Challenge Assignment</h2>
          <p className="text-sm text-gray-600">Create and assign challenges to your class</p>
        </div>
        <Button 
          onClick={() => setShowCreateChallenge(true)}
          className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Challenge Types Overview */}
      <div className="grid grid-cols-2 gap-3">
        {challengeTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{type.name}</h3>
                  <p className="text-xs text-gray-600">{type.description}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {type.subcategories.slice(0, 2).join(", ")}
                {type.subcategories.length > 2 && `, +${type.subcategories.length - 2} more`}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Challenges */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Assigned Challenges</h3>
        <div className="space-y-3">
          {assignedChallenges.map((challenge) => (
            <Card key={challenge.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#2ECC71] rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                    <p className="text-sm text-gray-600">
                      {challengeTypes.find(t => t.id === challenge.type)?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
                    {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Completion Progress</span>
                  <span className="text-sm text-gray-600">{challenge.completed}/{challenge.participants} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#2ECC71] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(challenge.completed / challenge.participants) * 100}%` }}
                  />
                </div>
              </div>

              {/* Challenge Details */}
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{challenge.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>{challenge.points} points</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Due {challenge.deadline}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                <Button variant="outline" size="sm" className="flex-1">
                  View Results
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit Challenge
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Send Reminder
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Challenge Modal */}
      {showCreateChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Create New Challenge</h3>
                <button
                  onClick={() => setShowCreateChallenge(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Challenge Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenge Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {challengeTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedChallengeType(type.id);
                          setChallengeForm({...challengeForm, type: type.id});
                        }}
                        className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                          selectedChallengeType === type.id
                            ? "border-[#2ECC71] bg-[#2ECC71]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{type.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Predefined Challenges */}
              {selectedChallengeType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Choose from Templates
                  </label>
                  <div className="space-y-2">
                    {predefinedChallenges[selectedChallengeType as keyof typeof predefinedChallenges]?.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setChallengeForm({...challengeForm, title: template})}
                        className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenge Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenge Title
                </label>
                <input
                  type="text"
                  value={challengeForm.title}
                  onChange={(e) => setChallengeForm({...challengeForm, title: e.target.value})}
                  placeholder="Enter challenge title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={challengeForm.description}
                  onChange={(e) => setChallengeForm({...challengeForm, description: e.target.value})}
                  placeholder="Describe the challenge objectives and instructions"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                />
              </div>

              {/* Difficulty & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={challengeForm.difficulty}
                    onChange={(e) => setChallengeForm({...challengeForm, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    value={challengeForm.duration}
                    onChange={(e) => setChallengeForm({...challengeForm, duration: e.target.value})}
                    min="1"
                    max="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                  />
                </div>
              </div>

              {/* Points & Deadline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points Reward
                  </label>
                  <input
                    type="number"
                    value={challengeForm.points}
                    onChange={(e) => setChallengeForm({...challengeForm, points: parseInt(e.target.value)})}
                    min="10"
                    max="500"
                    step="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={challengeForm.deadline}
                    onChange={(e) => setChallengeForm({...challengeForm, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4">
                <Button 
                  onClick={handleCreateChallenge}
                  className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Assign to Class
                </Button>
                <Button 
                  onClick={() => setShowCreateChallenge(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}