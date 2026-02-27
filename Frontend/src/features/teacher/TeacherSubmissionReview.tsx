import { useEffect, useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Image as ImageIcon,
    MapPin,
    Star,
    RefreshCw,
    AlertTriangle,
} from "lucide-react";
import { getPendingSubmissions, reviewSubmission } from "../../lib/api";

// Shape returned by the enriched backend endpoint
interface PendingSubmission {
    id: string;
    studentId: number;
    challengeId: number;
    status: string;
    mediaUrls: string[];
    notes: string;
    ecoScore: number | null;
    detectedCategory: string | null;
    detectedSpecies: string | null;
    isNativeSpecies: boolean | null;
    autoDecisionReason: string | null;
    bonusMultiplier: number | null;
    geoLat: number | null;
    geoLng: number | null;
    createdAt: string;
    // Enriched fields from backend
    studentName: string | null;
    studentAvatar: string | null;
    instituteName: string | null;
    instituteCity: string | null;
    challengeTitle: string | null;
    challengePoints: number | null;
    challengeType: string | null;
}

const categoryEmoji: Record<string, string> = {
    plant: "🌿",
    tree: "🌳",
    flower: "🌸",
    bird: "🐦",
    insect: "🦋",
    wildlife: "🦎",
    water: "💧",
    waste: "♻️",
    soil: "🌱",
    sky: "☁️",
};

export function TeacherSubmissionReview() {
    const [submissions, setSubmissions] = useState<PendingSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviewing, setReviewing] = useState<string | null>(null);
    const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
    const [expandedPhotos, setExpandedPhotos] = useState<Record<string, boolean>>({});

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPendingSubmissions();
            setSubmissions(data as PendingSubmission[]);
        } catch (err: any) {
            setError(err.message ?? "Failed to load pending submissions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleReview = async (id: string, status: "APPROVED" | "REJECTED") => {
        setReviewing(id);
        try {
            await reviewSubmission(id, status, reviewNotes[id]);
            // Remove from list immediately for snappy UX
            setSubmissions((prev) => prev.filter((s) => s.id !== id));
        } catch (err: any) {
            alert("Review failed: " + (err.message ?? "Unknown error"));
        } finally {
            setReviewing(null);
        }
    };

    // ── Loading state ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 text-sm">Loading pending submissions…</span>
            </div>
        );
    }

    // ── Error state ──────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                <AlertTriangle className="w-10 h-10 text-red-400" />
                <p className="text-gray-700 font-semibold">Could not load submissions</p>
                <p className="text-sm text-gray-500">{error}</p>
                <button
                    onClick={load}
                    className="flex items-center gap-2 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    <RefreshCw className="w-4 h-4" /> Retry
                </button>
            </div>
        );
    }

    // ── Empty state ──────────────────────────────────────────────────────────
    if (submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-400 opacity-60" />
                <p className="text-lg font-semibold text-gray-700">All caught up!</p>
                <p className="text-sm text-gray-400">No submissions waiting for review.</p>
                <button
                    onClick={load}
                    className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 mt-1"
                >
                    <RefreshCw className="w-3 h-3" /> Refresh
                </button>
            </div>
        );
    }

    // ── Review list ──────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500" />
                        Pending Reviews
                        <span className="text-sm font-normal bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">
                            {submissions.length}
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        EcoLens scored these submissions between 40–69 — they need your decision.
                    </p>
                </div>
                <button
                    onClick={load}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {/* Cards */}
            {submissions.map((sub) => {
                const isExpanded = expandedPhotos[sub.id] ?? false;
                const isBeingReviewed = reviewing === sub.id;
                const hasGeo = sub.geoLat != null && sub.geoLng != null;
                const catEmoji = (sub.detectedCategory && categoryEmoji[sub.detectedCategory.toLowerCase()]) ?? "🌍";

                return (
                    <div
                        key={sub.id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                        {/* ── Photo strip ───────────────────────────────────────────── */}
                        {sub.mediaUrls && sub.mediaUrls.length > 0 ? (
                            <div className="relative bg-gray-50">
                                <div
                                    className={`flex gap-1.5 overflow-x-auto p-2 ${isExpanded ? "" : "max-h-52"
                                        }`}
                                >
                                    {sub.mediaUrls.map((url, i) => (
                                        <img
                                            key={i}
                                            src={url}
                                            alt={`Photo ${i + 1}`}
                                            className="h-48 w-auto rounded-xl object-cover flex-shrink-0 cursor-pointer"
                                            onClick={() =>
                                                setExpandedPhotos((prev) => ({ ...prev, [sub.id]: !isExpanded }))
                                            }
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ))}
                                </div>
                                {sub.mediaUrls.length > 1 && (
                                    <button
                                        onClick={() =>
                                            setExpandedPhotos((prev) => ({ ...prev, [sub.id]: !isExpanded }))
                                        }
                                        className="absolute bottom-3 right-3 text-xs bg-black/50 text-white px-2.5 py-1 rounded-full hover:bg-black/70"
                                    >
                                        {sub.mediaUrls.length} photos
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="h-24 bg-gray-50 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-300" />
                            </div>
                        )}

                        <div className="p-4 flex flex-col gap-3">
                            {/* ── Student + challenge meta ─────────────────────────────── */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                                        {sub.studentAvatar ? (
                                            <img
                                                src={sub.studentAvatar}
                                                alt={sub.studentName ?? "Student"}
                                                className="w-full h-full rounded-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            (sub.studentName?.charAt(0) ?? "S").toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {sub.studentName ?? `Student #${sub.studentId}`}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {sub.instituteName ?? ""}
                                            {sub.instituteCity ? ` · ${sub.instituteCity}` : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-semibold text-gray-800">
                                        {sub.challengeTitle ?? `Challenge #${sub.challengeId}`}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {sub.challengePoints != null ? `${sub.challengePoints} pts` : ""}
                                        {sub.challengeType ? ` · ${sub.challengeType.toLowerCase()}` : ""}
                                    </p>
                                </div>
                            </div>

                            {/* ── EcoLens ML result card ───────────────────────────────── */}
                            {sub.ecoScore != null && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-3">
                                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 items-center">
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                                            <span className="text-sm font-bold text-green-800">
                                                EcoScore: {sub.ecoScore}/100
                                            </span>
                                        </div>

                                        {sub.detectedCategory && (
                                            <span className="text-sm text-gray-600 capitalize">
                                                {catEmoji}{" "}
                                                {sub.detectedCategory.replace(/_/g, " ")}
                                            </span>
                                        )}

                                        {sub.detectedSpecies && (
                                            <span className="text-sm text-gray-600 italic">
                                                🌿 {sub.detectedSpecies}
                                            </span>
                                        )}

                                        {sub.isNativeSpecies != null && (
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${sub.isNativeSpecies
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-orange-100 text-orange-700"
                                                    }`}
                                            >
                                                {sub.isNativeSpecies ? "🌱 Native species" : "Non-native species"}
                                            </span>
                                        )}

                                        {sub.bonusMultiplier != null && sub.bonusMultiplier !== 1 && (
                                            <span className="text-xs text-purple-600 font-medium">
                                                ×{sub.bonusMultiplier} bonus
                                            </span>
                                        )}
                                    </div>

                                    {/* Score bar */}
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>EcoLens Confidence</span>
                                            <span
                                                className={
                                                    sub.ecoScore >= 60
                                                        ? "text-green-600"
                                                        : sub.ecoScore >= 40
                                                            ? "text-amber-600"
                                                            : "text-red-500"
                                                }
                                            >
                                                {sub.ecoScore >= 60 ? "Borderline approve" : sub.ecoScore >= 40 ? "Borderline" : "Low confidence"}
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${sub.ecoScore >= 60
                                                        ? "bg-green-500"
                                                        : sub.ecoScore >= 40
                                                            ? "bg-amber-400"
                                                            : "bg-red-400"
                                                    }`}
                                                style={{ width: `${sub.ecoScore}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ML reason */}
                            {sub.autoDecisionReason && (
                                <p className="text-xs text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2">
                                    🤖 {sub.autoDecisionReason}
                                </p>
                            )}

                            {/* Student notes */}
                            {sub.notes && (
                                <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                                    <p className="text-xs font-semibold text-blue-700 mb-0.5">Student note</p>
                                    <p className="text-sm text-gray-700">{sub.notes}</p>
                                </div>
                            )}

                            {/* GPS status */}
                            <div
                                className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${hasGeo
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-600"
                                    }`}
                            >
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                {hasGeo ? (
                                    <span>
                                        GPS captured — pin will show on EcoMap if approved (
                                        {sub.geoLat!.toFixed(4)}, {sub.geoLng!.toFixed(4)})
                                    </span>
                                ) : (
                                    <span>⚠️ No GPS data — pin will NOT appear on EcoMap if approved</span>
                                )}
                            </div>

                            {/* Submission date */}
                            <p className="text-xs text-gray-400">
                                Submitted {new Date(sub.createdAt).toLocaleString()}
                            </p>

                            {/* Teacher review notes */}
                            <textarea
                                value={reviewNotes[sub.id] ?? ""}
                                onChange={(e) =>
                                    setReviewNotes((prev) => ({ ...prev, [sub.id]: e.target.value }))
                                }
                                placeholder="Add review notes for the student (optional)…"
                                rows={2}
                                className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
                            />

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleReview(sub.id, "APPROVED")}
                                    disabled={isBeingReviewed}
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {reviewing === sub.id ? "Approving…" : "Approve"}
                                </button>
                                <button
                                    onClick={() => handleReview(sub.id, "REJECTED")}
                                    disabled={isBeingReviewed}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    <XCircle className="w-4 h-4" />
                                    {reviewing === sub.id ? "Rejecting…" : "Reject"}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
