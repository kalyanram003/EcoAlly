import { useState, useEffect } from "react";
import { ExternalLink, FileText, Video, BookOpen, Link as LinkIcon } from "lucide-react";
import * as api from "../../../lib/api";

interface Material {
    id: string | number;
    title: string;
    description?: string;
    type: string;
    url?: string;
    topic?: string;
    tags?: string[];
    isPublished?: boolean;
}

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
    VIDEO: { label: "Video", color: "bg-red-100 text-red-700", icon: Video },
    PDF: { label: "PDF", color: "bg-blue-100 text-blue-700", icon: FileText },
    LINK: { label: "Link", color: "bg-purple-100 text-purple-700", icon: LinkIcon },
    ARTICLE: { label: "Article", color: "bg-green-100 text-green-700", icon: BookOpen },
    DOCUMENT: { label: "Document", color: "bg-blue-100 text-blue-700", icon: FileText },
};

const getTypeConfig = (type: string) =>
    typeConfig[type?.toUpperCase()] ?? { label: type ?? "Resource", color: "bg-gray-100 text-gray-600", icon: FileText };

export function StudentMaterialsTab() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        api.getPublishedMaterials()
            .then(setMaterials)
            .catch(() => setMaterials([]))
            .finally(() => setLoading(false));
    }, []);

    const types = ["ALL", ...Array.from(new Set(materials.map(m => m.type?.toUpperCase()).filter(Boolean)))];

    const filtered = materials.filter(m => {
        const matchesSearch =
            !search ||
            m.title.toLowerCase().includes(search.toLowerCase()) ||
            (m.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (m.topic ?? "").toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "ALL" || m.type?.toUpperCase() === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900">Learning Materials</h2>
                <p className="text-sm text-gray-600">Resources shared by your teachers</p>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search materials..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-[#2ECC71] focus:border-[#2ECC71] focus:outline-none"
            />

            {/* Type filters */}
            {types.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {types.map(t => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filter === t
                                ? "bg-[#2ECC71] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {t === "ALL" ? "All" : getTypeConfig(t).label}
                        </button>
                    ))}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">
                    <p className="text-3xl mb-2">📚</p>
                    <p>Loading materials...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="font-medium text-gray-700">
                        {materials.length === 0 ? "No materials yet" : "No results found"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {materials.length === 0
                            ? "Your teacher hasn't shared any materials yet."
                            : "Try a different search or filter."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(material => {
                        const cfg = getTypeConfig(material.type);
                        const Icon = cfg.icon;
                        return (
                            <div
                                key={material.id}
                                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-medium text-gray-900 text-sm leading-snug">{material.title}</h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${cfg.color}`}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                        {material.description && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{material.description}</p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            {material.topic && (
                                                <span className="text-xs bg-[#2ECC71]/10 text-[#2ECC71] px-2 py-0.5 rounded-full">
                                                    {material.topic}
                                                </span>
                                            )}
                                            {(material.tags ?? []).slice(0, 3).map((tag, i) => (
                                                <span key={i} className="text-xs text-gray-400">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {material.url && (
                                    <a
                                        href={material.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 text-[#2ECC71] rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Open Resource
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
