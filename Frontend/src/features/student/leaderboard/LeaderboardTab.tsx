import { useState, useEffect } from "react";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import * as api from "../../../lib/api";

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  weeklyPoints: number;
  challengesCompleted: number;
  quizzesCompleted: number;
  streak: number;
  isCurrentUser?: boolean;
}

export function LeaderboardTab() {
  const [activeCategory, setActiveCategory] = useState<"total" | "challenges" | "quizzes">("total");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [myRank, setMyRank] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getLeaderboard(activeCategory, 20)
      .then((res) => {
        const entries: LeaderboardUser[] = (res.entries ?? []).map((e: any, idx: number) => ({
          id: e.userId ?? String(idx),
          name: e.name ?? e.username ?? "Student",
          avatar: e.avatarUrl ?? "👤",
          points: e.totalPoints ?? e.points ?? 0,
          rank: e.rank ?? idx + 1,
          weeklyPoints: e.weeklyPoints ?? 0,
          challengesCompleted: e.challengesCompleted ?? 0,
          quizzesCompleted: e.quizzesCompleted ?? 0,
          streak: e.currentStreak ?? 0,
          isCurrentUser: e.isCurrentUser ?? false,
        }));
        setLeaderboardData(entries);

        // myRank from the backend
        if (res.myRank) {
          setMyRank({
            id: res.myRank.userId ?? "me",
            name: res.myRank.name ?? "You",
            avatar: res.myRank.avatarUrl ?? "👤",
            points: res.myRank.totalPoints ?? 0,
            rank: res.myRank.rank ?? 0,
            weeklyPoints: res.myRank.weeklyPoints ?? 0,
            challengesCompleted: res.myRank.challengesCompleted ?? 0,
            quizzesCompleted: res.myRank.quizzesCompleted ?? 0,
            streak: res.myRank.currentStreak ?? 0,
            isCurrentUser: true,
          });
        } else {
          // Fall back to marking the current user in the list
          const me = entries.find(e => e.isCurrentUser);
          setMyRank(me ?? null);
        }
      })
      .catch(() => setLeaderboardData([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const currentUser = myRank;
  const totalUsers = leaderboardData.length;

  const getSortedData = () => {
    return [...leaderboardData].sort((a, b) => {
      switch (activeCategory) {
        case "challenges":
          return b.challengesCompleted - a.challengesCompleted;
        case "quizzes":
          return b.quizzesCompleted - a.quizzesCompleted;
        default:
          return b.points - a.points;
      }
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-semibold">{rank}</span>;
    }
  };

  const getCategoryValue = (user: LeaderboardUser) => {
    switch (activeCategory) {
      case "challenges":
        return `${user.challengesCompleted} completed`;
      case "quizzes":
        return `${user.quizzesCompleted} completed`;
      default:
        return `${user.points} pts`;
    }
  };

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case "challenges":
        return "Challenges";
      case "quizzes":
        return "Quizzes";
      default:
        return "Total Points";
    }
  };

  const sortedData = getSortedData();

  return (
    <div className="p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold mb-2">Leaderboard</h1>
        <p className="text-gray-600">See how you rank against other eco-warriors!</p>
      </div>

      {/* Current User Stats */}
      {currentUser && (
        <div className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-xl p-4 mb-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">{currentUser.avatar}</span>
              </div>
              <div>
                <h3 className="font-semibold">Your Rank</h3>
                <p className="text-white/80 text-sm">Keep climbing!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">#{currentUser.rank}</div>
              <div className="text-white/80 text-sm">of {totalUsers}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-semibold">{currentUser.points}</div>
              <div className="text-white/80 text-xs">Total Points</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{currentUser.challengesCompleted}</div>
              <div className="text-white/80 text-xs">Challenges</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{currentUser.streak} days</div>
              <div className="text-white/80 text-xs">Streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs - global leaderboard only */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveCategory("total")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 ${activeCategory === "total"
            ? "bg-[#2ECC71] text-white"
            : "bg-gray-100 text-gray-600"
            }`}
        >
          <TrendingUp className="w-4 h-4" />
          Total Points
        </button>
        <button
          onClick={() => setActiveCategory("challenges")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeCategory === "challenges"
            ? "bg-[#2ECC71] text-white"
            : "bg-gray-100 text-gray-600"
            }`}
        >
          🎯 Challenges
        </button>
        <button
          onClick={() => setActiveCategory("quizzes")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeCategory === "quizzes"
            ? "bg-[#2ECC71] text-white"
            : "bg-gray-100 text-gray-600"
            }`}
        >
          🧠 Quizzes
        </button>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold mb-4 text-center">{getCategoryTitle()} - Top 3</h3>
        <div className="flex items-end justify-center gap-4">
          {/* 2nd Place */}
          {sortedData[1] && (
            <div className="text-center">
              <div className="w-16 h-12 bg-gray-100 rounded-t-lg flex items-end justify-center mb-2">
                <span className="text-2xl mb-1">{sortedData[1].avatar}</span>
              </div>
              <div className="text-xs font-medium mb-1">{sortedData[1].name}</div>
              <div className="text-xs text-gray-500">{getCategoryValue(sortedData[1])}</div>
              <Medal className="w-5 h-5 text-gray-400 mx-auto mt-1" />
            </div>
          )}

          {/* 1st Place */}
          {sortedData[0] && (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-t-lg flex items-end justify-center mb-2">
                <span className="text-3xl mb-1">{sortedData[0].avatar}</span>
              </div>
              <div className="text-sm font-semibold mb-1">{sortedData[0].name}</div>
              <div className="text-xs text-gray-500">{getCategoryValue(sortedData[0])}</div>
              <Trophy className="w-5 h-5 text-yellow-500 mx-auto mt-1" />
            </div>
          )}

          {/* 3rd Place */}
          {sortedData[2] && (
            <div className="text-center">
              <div className="w-16 h-10 bg-amber-100 rounded-t-lg flex items-end justify-center mb-2">
                <span className="text-xl mb-1">{sortedData[2].avatar}</span>
              </div>
              <div className="text-xs font-medium mb-1">{sortedData[2].name}</div>
              <div className="text-xs text-gray-500">{getCategoryValue(sortedData[2])}</div>
              <Award className="w-5 h-5 text-amber-600 mx-auto mt-1" />
            </div>
          )}
        </div>
      </div>

      {/* Full Rankings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold">Full Rankings</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {sortedData.map((user, index) => (
            <div
              key={user.id}
              className={`p-4 flex items-center gap-4 ${user.isCurrentUser ? "bg-[#2ECC71]/10 border-l-4 border-[#2ECC71]" : ""
                }`}
            >
              <div className="flex-shrink-0">
                {getRankIcon(index + 1)}
              </div>

              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">{user.avatar}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${user.isCurrentUser ? "text-[#2ECC71]" : ""}`}>
                    {user.name}
                    {user.isCurrentUser && <span className="ml-2 text-xs bg-[#2ECC71] text-white px-2 py-1 rounded-full">You</span>}
                  </h4>
                  <div className="text-right">
                    <div className="font-semibold">{getCategoryValue(user)}</div>
                    {activeCategory === "total" && user.weeklyPoints > 0 && (
                      <div className="text-xs text-gray-500">+{user.weeklyPoints} this week</div>
                    )}
                  </div>
                </div>

                {activeCategory === "total" && (
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>🎯 {user.challengesCompleted}</span>
                    <span>🧠 {user.quizzesCompleted}</span>
                    <span>🔥 {user.streak} day streak</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement Message */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          🌱 Keep learning and taking eco-actions to climb the leaderboard!
        </p>
      </div>
    </div>
  );
}