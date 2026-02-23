import { motion } from "framer-motion";

interface EcoLensResult {
  ecoScore: number;
  detectedCategory: string;
  detectedSpecies: string | null;
  isNativeSpecies: boolean | null;
  autoDecision: string;
  autoDecisionReason: string;
  pointsEarned: number;
  bonusMultiplier: number;
}

interface Props {
  result: EcoLensResult;
  onClose: () => void;
}

const categoryEmoji: Record<string, string> = {
  plant: "🌿",
  water_body: "💧",
  waste: "♻️",
  wildlife: "🦋",
  urban_green: "🌳",
  irrelevant: "❌",
};

const decisionColor: Record<string, string> = {
  AUTO_APPROVED: "bg-green-50 border-green-200",
  AUTO_REJECTED: "bg-red-50 border-red-200",
  PENDING_REVIEW: "bg-yellow-50 border-yellow-200",
};

const decisionLabel: Record<string, string> = {
  AUTO_APPROVED: "✅ Auto-Approved!",
  AUTO_REJECTED: "❌ Not Accepted",
  PENDING_REVIEW: "🔍 Sent for Teacher Review",
};

export function EcoLensResultCard({ result, onClose }: Props) {
  const emoji = categoryEmoji[result.detectedCategory] ?? "🌍";
  const scoreColor =
    result.ecoScore >= 70
      ? "text-green-600"
      : result.ecoScore >= 40
      ? "text-yellow-600"
      : "text-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`rounded-2xl border-2 p-5 shadow-lg ${
        decisionColor[result.autoDecision] ??
        "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔬</span>
        <h3 className="font-bold text-lg text-gray-800">EcoLens Analysis</h3>
        <span className="ml-auto text-xs text-gray-500 bg-white rounded-full px-2 py-0.5 border">
          AI Verified
        </span>
      </div>

      {/* Category + EcoScore */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{emoji}</span>
          <div>
            <p className="text-sm text-gray-500">Detected</p>
            <p className="font-semibold capitalize text-gray-800">
              {result.detectedCategory.replace("_", " ")}
            </p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-0.5">EcoScore</p>
          <p className={`text-3xl font-black ${scoreColor}`}>
            {result.ecoScore}
            <span className="text-sm font-normal text-gray-400">/100</span>
          </p>
        </div>
      </div>

      {/* Species Info */}
      {result.detectedSpecies && (
        <div className="bg-white rounded-xl p-3 mb-3 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Identified Species</p>
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-800 text-sm">
              {result.detectedSpecies}
            </p>
            {result.isNativeSpecies !== null && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  result.isNativeSpecies
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {result.isNativeSpecies ? "🌱 Native" : "🌐 Non-native"}
              </span>
            )}
          </div>
          {result.bonusMultiplier > 1 && (
            <p className="text-xs text-green-600 mt-1 font-medium">
              🎯 {((result.bonusMultiplier - 1) * 100).toFixed(0)}% species
              bonus applied!
            </p>
          )}
        </div>
      )}

      {/* Decision Banner */}
      <div className="rounded-xl bg-white border border-gray-100 p-3 mb-3">
        <p className="font-bold text-gray-800 mb-0.5">
          {decisionLabel[result.autoDecision]}
        </p>
        <p className="text-xs text-gray-500">{result.autoDecisionReason}</p>
      </div>

      {/* Points Awarded */}
      {result.autoDecision === "AUTO_APPROVED" && result.pointsEarned > 0 && (
        <div className="flex items-center gap-2 bg-green-600 text-white rounded-xl px-4 py-2.5 mb-3">
          <span className="text-xl">⭐</span>
          <div>
            <p className="font-bold">+{result.pointsEarned} XP Awarded!</p>
            <p className="text-xs opacity-80">
              Points added to your profile
            </p>
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-1 py-1"
      >
        Close
      </button>
    </motion.div>
  );
}

