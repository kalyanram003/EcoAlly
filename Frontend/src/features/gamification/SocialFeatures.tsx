import { useState } from "react";
import { Users, Heart, MessageCircle, Trophy, Target, Star, Crown, ChevronRight, ThumbsUp } from "lucide-react";
import { Button } from "../../components/ui/button";

export interface Team {
  id: string;
  name: string;
  emoji: string;
  members: TeamMember[];
  totalPoints: number;
  weeklyPoints: number;
  rank: number;
  color: string;
  coopChallenges: CoopChallenge[];
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  points: number;
  weeklyContribution: number;
  isCurrentUser?: boolean;
}

export interface CoopChallenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  reward: string;
  participants: number;
}

export interface EcoKudo {
  id: string;
  fromUser: string;
  toUser: string;
  fromAvatar: string;
  toAvatar: string;
  message: string;
  challengeId?: string;
  timestamp: Date;
  type: "challenge" | "quiz" | "general";
}

interface SocialFeaturesProps {
  onJoinTeam?: (teamId: string) => void;
  onGiveKudo?: (userId: string, message: string) => void;
}

export function SocialFeatures({ onJoinTeam, onGiveKudo }: SocialFeaturesProps) {
  const [activeTab, setActiveTab] = useState<"teams" | "coop" | "kudos">("teams");
  const [showKudoForm, setShowKudoForm] = useState(false);
  const [kudoMessage, setKudoMessage] = useState("");

  // Mock data
  const currentUserTeam: Team = {
    id: "eco_warriors",
    name: "Eco Warriors",
    emoji: "🌿",
    members: [
      { id: "1", name: "You", avatar: "👤", points: 2100, weeklyContribution: 180, isCurrentUser: true },
      { id: "2", name: "Emma", avatar: "👩‍🦰", points: 2450, weeklyContribution: 320 },
      { id: "3", name: "Alex", avatar: "👨‍💼", points: 2380, weeklyContribution: 280 },
      { id: "4", name: "Maria", avatar: "👩‍🎓", points: 2240, weeklyContribution: 250 },
      { id: "5", name: "James", avatar: "👨‍🎓", points: 1980, weeklyContribution: 160 }
    ],
    totalPoints: 11150,
    weeklyPoints: 1190,
    rank: 2,
    color: "from-green-400 to-green-600",
    coopChallenges: [
      {
        id: "plastic_reduction",
        title: "Class Plastic Reduction",
        description: "Reduce 1,000 plastic bottles as a team this week",
        emoji: "♻️",
        targetValue: 1000,
        currentValue: 750,
        unit: "bottles",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        reward: "Team badge + 50 bonus points each",
        participants: 24
      },
      {
        id: "tree_planting",
        title: "Team Forest Initiative",
        description: "Plant 50 trees together this month",
        emoji: "🌳",
        targetValue: 50,
        currentValue: 23,
        unit: "trees",
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        reward: "Forest Guardian team title",
        participants: 18
      }
    ]
  };

  const recentKudos: EcoKudo[] = [
    {
      id: "1",
      fromUser: "Emma",
      toUser: "You",
      fromAvatar: "👩‍🦰",
      toAvatar: "👤",
      message: "Great job on the water conservation challenge! Your photos were inspiring! 💧",
      challengeId: "water_challenge",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "challenge"
    },
    {
      id: "2",
      fromUser: "You",
      toUser: "Alex",
      fromAvatar: "👤",
      toAvatar: "👨‍💼",
      message: "Amazing quiz score! You're becoming an eco expert! 🌟",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      type: "quiz"
    },
    {
      id: "3",
      fromUser: "Maria",
      toUser: "James",
      fromAvatar: "👩‍🎓",
      toAvatar: "👨‍🎓",
      message: "Love your creativity in the recycling challenge! 🎨",
      challengeId: "recycling_art",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      type: "challenge"
    }
  ];

  const availableTeams: Team[] = [
    {
      id: "green_guardians",
      name: "Green Guardians",
      emoji: "🛡️",
      members: [],
      totalPoints: 12500,
      weeklyPoints: 1350,
      rank: 1,
      color: "from-emerald-400 to-emerald-600",
      coopChallenges: []
    },
    {
      id: "nature_ninjas",
      name: "Nature Ninjas",
      emoji: "🥷",
      members: [],
      totalPoints: 10800,
      weeklyPoints: 980,
      rank: 3,
      color: "from-purple-400 to-purple-600",
      coopChallenges: []
    }
  ];

  const formatTimeRemaining = (deadline: Date): string => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const formatTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">🤝 Social Hub</h2>
        <p className="text-gray-600 mb-4">Team up and support each other's eco journey!</p>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm mb-4">
          🚧 <strong>Coming Soon:</strong> Social features (kudos, teams) are not yet backed by the database. Actions here will not be saved.
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setActiveTab("teams")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${activeTab === "teams" ? "bg-blue-500 text-white" : "bg-transparent text-gray-600"
            }`}
        >
          <Users className="w-4 h-4" />
          Teams
        </button>
        <button
          onClick={() => setActiveTab("coop")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${activeTab === "coop" ? "bg-green-500 text-white" : "bg-transparent text-gray-600"
            }`}
        >
          <Target className="w-4 h-4" />
          Co-op
        </button>
        <button
          onClick={() => setActiveTab("kudos")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${activeTab === "kudos" ? "bg-pink-500 text-white" : "bg-transparent text-gray-600"
            }`}
        >
          <Heart className="w-4 h-4" />
          Kudos
        </button>
      </div>

      {/* Teams Tab */}
      {activeTab === "teams" && (
        <div className="space-y-4">
          {/* Current Team */}
          <div className={`bg-gradient-to-r ${currentUserTeam.color} rounded-xl p-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                  {currentUserTeam.emoji}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currentUserTeam.name}</h3>
                  <p className="text-white/80">Rank #{currentUserTeam.rank} • {currentUserTeam.members.length} members</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{currentUserTeam.weeklyPoints}</div>
                <div className="text-white/80 text-sm">weekly points</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="font-bold">{currentUserTeam.totalPoints.toLocaleString()}</div>
                <div className="text-white/80 text-sm">Total Points</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="font-bold">{currentUserTeam.coopChallenges.length}</div>
                <div className="text-white/80 text-sm">Active Co-ops</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="font-bold">#{currentUserTeam.rank}</div>
                <div className="text-white/80 text-sm">Team Rank</div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Team Members
            </h4>
            <div className="space-y-3">
              {currentUserTeam.members.map((member) => (
                <div key={member.id} className={`flex items-center justify-between p-3 rounded-lg ${member.isCurrentUser ? "bg-green-50 border border-green-200" : "bg-gray-50"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg">{member.avatar}</span>
                    </div>
                    <div>
                      <h5 className="font-medium">{member.name}</h5>
                      <p className="text-sm text-gray-600">{member.points.toLocaleString()} total points</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">+{member.weeklyContribution}</div>
                    <div className="text-xs text-gray-500">this week</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Teams */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h4 className="font-semibold mb-3">Other Teams</h4>
            <div className="space-y-3">
              {availableTeams.map((team) => (
                <div key={team.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg">{team.emoji}</span>
                    </div>
                    <div>
                      <h5 className="font-medium">{team.name}</h5>
                      <p className="text-sm text-gray-600">Rank #{team.rank} • {team.weeklyPoints} weekly pts</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Co-op Challenges Tab */}
      {activeTab === "coop" && (
        <div className="space-y-4">
          {currentUserTeam.coopChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-xl border-2 border-green-200 p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                    {challenge.emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold">{challenge.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{challenge.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>🏃‍♂️ {challenge.participants} participants</span>
                      <span>⏰ {formatTimeRemaining(challenge.deadline)} left</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Team Progress</span>
                  <span className="text-sm text-gray-600">
                    {challenge.currentValue}/{challenge.targetValue} {challenge.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((challenge.currentValue / challenge.targetValue) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-lg font-bold text-green-600">
                    {Math.round((challenge.currentValue / challenge.targetValue) * 100)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">complete</span>
                </div>
              </div>

              {/* Reward */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Reward: {challenge.reward}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Team Leaderboard */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Team Leaderboard
            </h4>
            <div className="space-y-2">
              {[currentUserTeam, ...availableTeams].sort((a, b) => b.weeklyPoints - a.weeklyPoints).map((team, index) => (
                <div key={team.id} className={`flex items-center justify-between p-3 rounded-lg ${team.id === currentUserTeam.id ? "bg-green-50 border border-green-200" : "bg-gray-50"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {index === 0 ? <Crown className="w-5 h-5 text-yellow-500" /> :
                        index === 1 ? <Trophy className="w-5 h-5 text-gray-400" /> :
                          <span className="font-bold text-gray-500">#{index + 1}</span>}
                    </div>
                    <span className="text-lg">{team.emoji}</span>
                    <div>
                      <h5 className="font-medium">{team.name}</h5>
                      <p className="text-sm text-gray-600">{team.weeklyPoints} weekly points</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kudos Tab */}
      {activeTab === "kudos" && (
        <div className="space-y-4">
          {/* Give Kudos Button */}
          <Button
            onClick={() => setShowKudoForm(!showKudoForm)}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            <Heart className="w-4 h-4 mr-2" />
            Give Eco Kudos
          </Button>

          {/* Kudo Form */}
          {showKudoForm && (
            <div className="bg-white rounded-xl p-4 border-2 border-pink-200">
              <h4 className="font-semibold mb-3">Send Encouragement! 💕</h4>
              <textarea
                value={kudoMessage}
                onChange={(e) => setKudoMessage(e.target.value)}
                placeholder="Write an encouraging message to a teammate..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() => {
                    onGiveKudo?.("teammate", kudoMessage);
                    setKudoMessage("");
                    setShowKudoForm(false);
                  }}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                  disabled={!kudoMessage.trim()}
                >
                  Send Kudos
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowKudoForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Recent Kudos */}
          <div className="space-y-3">
            <h4 className="font-semibold">Recent Eco Kudos</h4>
            {recentKudos.map((kudo) => (
              <div key={kudo.id} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <span>{kudo.fromAvatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{kudo.fromUser}</span>
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="font-medium">{kudo.toUser}</span>
                      <span className="text-xs text-gray-500">{formatTimeAgo(kudo.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{kudo.message}</p>
                    {kudo.challengeId && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full text-xs text-green-700">
                        <Target className="w-3 h-3" />
                        Challenge Support
                      </div>
                    )}
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ThumbsUp className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}