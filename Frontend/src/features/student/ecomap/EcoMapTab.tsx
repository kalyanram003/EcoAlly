import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getEcoMapPins, getEcoMapStats } from "../../../lib/api";

// ── Fix default Leaflet marker icons (known Webpack/Vite issue) ───────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Custom colored pin icons by eco-category ─────────────────────────────────
const createCustomIcon = (category: string, isNative: boolean | null) => {
  const colors: Record<string, string> = {
    plant: isNative ? "#16a34a" : "#65a30d",
    water_body: "#0ea5e9",
    waste: "#f97316",
    wildlife: "#a855f7",
    urban_green: "#84cc16",
    irrelevant: "#9ca3af",
  };
  const color = colors[category] ?? "#16a34a";

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"
        fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
    </svg>`;

  return L.divIcon({
    html: svgIcon,
    className: "",
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -42],
  });
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface EcoPin {
  submissionId: string;
  lat: number;
  lng: number;
  studentName: string;
  instituteName: string;
  instituteCity: string;
  studentTier: string;
  detectedSpecies: string | null;
  detectedCategory: string;
  isNativeSpecies: boolean | null;
  ecoScore: number;
  bonusMultiplier: number;
  photoUrl: string | null;
  submittedAt: string;
}

interface EcoStats {
  totalPins: number;
  nativeSpeciesCount: number;
  uniqueSpeciesCount: number;
}

// ── Tier badge colors ─────────────────────────────────────────────────────────
const tierColors: Record<string, string> = {
  sprout: "bg-green-100 text-green-700",
  explorer: "bg-blue-100 text-blue-700",
  guardian: "bg-purple-100 text-purple-700",
  master: "bg-orange-100 text-orange-700",
  legend: "bg-yellow-100 text-yellow-700",
};

const categoryEmoji: Record<string, string> = {
  plant: "🌿",
  water_body: "💧",
  waste: "♻️",
  wildlife: "🦋",
  urban_green: "🌳",
};

// ── Time ago helper ───────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ── Map auto-fit component ────────────────────────────────────────────────────
function MapAutoFit({ pins }: { pins: EcoPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [pins, map]);
  return null;
}

// ── Main Component ────────────────────────────────────────────────────────────
export function EcoMapTab() {
  const [pins, setPins] = useState<EcoPin[]>([]);
  const [stats, setStats] = useState<EcoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pinsData, statsData] = await Promise.all([
          getEcoMapPins(),
          getEcoMapStats(),
        ]);
        setPins(pinsData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load EcoMap data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPins = filter === "all"
    ? pins
    : filter === "native"
      ? pins.filter((p) => p.isNativeSpecies === true)
      : pins.filter((p) => p.detectedCategory === filter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading EcoMap...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🗺️</span>
          <div>
            <h2 className="font-bold text-lg leading-tight">Community EcoMap</h2>
            <p className="text-green-100 text-xs">Real eco-actions verified by AI</p>
          </div>
        </div>

        {/* Stats bar */}
        {stats && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total Pins", value: stats.totalPins, icon: "📍" },
              { label: "Native Species", value: stats.nativeSpeciesCount, icon: "🌱" },
              { label: "Unique Species", value: stats.uniqueSpeciesCount, icon: "🔬" },
            ].map((s) => (
              <div key={s.label} className="bg-white/20 rounded-xl p-2 text-center">
                <p className="text-lg font-black">{s.icon} {s.value}</p>
                <p className="text-green-100 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: "all", label: "🌍 All" },
          { key: "native", label: "🌱 Native" },
          { key: "plant", label: "🌿 Plants" },
          { key: "water_body", label: "💧 Water" },
          { key: "waste", label: "♻️ Waste" },
          { key: "wildlife", label: "🦋 Wildlife" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Leaflet Map */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200" style={{ height: "420px" }}>
        {filteredPins.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 gap-3">
            <span className="text-5xl">🌍</span>
            <p className="text-gray-500 text-sm">No eco-actions found for this filter</p>
          </div>
        ) : (
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            {/* OpenStreetMap tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapAutoFit pins={filteredPins} />

            {filteredPins.map((pin) => (
              <Marker
                key={pin.submissionId}
                position={[pin.lat, pin.lng]}
                icon={createCustomIcon(pin.detectedCategory, pin.isNativeSpecies)}
              >
                <Popup maxWidth={260} className="eco-popup">
                  <div className="p-1 min-w-[220px]">

                    {/* Photo thumbnail */}
                    {pin.photoUrl && (
                      <img
                        src={pin.photoUrl}
                        alt="Eco action"
                        className="w-full h-28 object-cover rounded-lg mb-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}

                    {/* Species + category */}
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight">
                          {categoryEmoji[pin.detectedCategory]} {pin.detectedSpecies ?? pin.detectedCategory.replace("_", " ")}
                        </p>
                        {pin.isNativeSpecies !== null && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            pin.isNativeSpecies
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            {pin.isNativeSpecies ? "🌱 Native Species" : "Non-native"}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                        ⭐{pin.ecoScore}
                      </span>
                    </div>

                    <hr className="my-2 border-gray-100" />

                    {/* Student info */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700 flex-shrink-0">
                        {pin.studentName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-xs truncate">{pin.studentName}</p>
                        <p className="text-gray-500 text-xs truncate">{pin.instituteName}</p>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ${
                        tierColors[pin.studentTier] ?? "bg-gray-100 text-gray-600"
                      }`}>
                        {pin.studentTier}
                      </span>
                    </div>

                    {/* Bonus + time */}
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      {pin.bonusMultiplier > 1 && (
                        <span className="text-green-600 font-medium">
                          🎯 {((pin.bonusMultiplier - 1) * 100).toFixed(0)}% bonus
                        </span>
                      )}
                      <span className="ml-auto">{timeAgo(pin.submittedAt)}</span>
                    </div>

                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Recent Activity Feed (below map) */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🕐</span> Recent Eco-Actions
        </h3>
        <div className="flex flex-col gap-2">
          {filteredPins.slice(0, 10).map((pin) => (
            <div
              key={pin.submissionId}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Photo or emoji fallback */}
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-green-50 flex items-center justify-center">
                {pin.photoUrl ? (
                  <img
                    src={pin.photoUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-2xl">{categoryEmoji[pin.detectedCategory] ?? "🌍"}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {pin.detectedSpecies ?? pin.detectedCategory.replace("_", " ")}
                </p>
                <p className="text-gray-500 text-xs truncate">
                  👤 {pin.studentName} · {pin.instituteCity}
                </p>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-green-600 font-bold text-sm">⭐ {pin.ecoScore}</span>
                {pin.isNativeSpecies && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Native</span>
                )}
                <span className="text-gray-400 text-xs">{timeAgo(pin.submittedAt)}</span>
              </div>
            </div>
          ))}

          {filteredPins.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p className="text-4xl mb-2">🌱</p>
              <p className="text-sm">Be the first to add an eco-action here!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

