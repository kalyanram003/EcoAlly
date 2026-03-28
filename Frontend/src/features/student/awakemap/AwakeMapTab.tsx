import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getAwakeReports, submitAwakeReport, resolveAwakeReport } from "../../../lib/api";

// ── Fix Leaflet default icon (same fix as EcoMapTab) ─────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Status-based pin icons ────────────────────────────────────────────────────
const createAwakeIcon = (status: "OPEN" | "RESOLVED") => {
  const color = status === "OPEN" ? "#ef4444" : "#22c55e";
  const innerColor = status === "OPEN" ? "#fca5a5" : "#86efac";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"
        fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="${innerColor}" opacity="0.95"/>
    </svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -44],
  });
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface AwakeReport {
  id: number;
  reporterId: number;
  reporterName: string;
  lat: number;
  lng: number;
  description: string;
  beforePhotoUrl: string | null;
  afterPhotoUrl: string | null;
  status: "OPEN" | "RESOLVED";
  resolvedAt: string | null;
  resolvedByName: string | null;
  createdAt: string;
}

// ── Auto-fit map to all pins ──────────────────────────────────────────────────
function MapAutoFit({ reports }: { reports: AwakeReport[] }) {
  const map = useMap();
  useEffect(() => {
    if (reports.length === 0) return;
    const bounds = L.latLngBounds(reports.map((r) => [r.lat, r.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [reports, map]);
  return null;
}

// ── Time helper ───────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AwakeMapTab() {
  const [reports, setReports] = useState<AwakeReport[]>([]);
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "RESOLVED">("ALL");
  const [loading, setLoading] = useState(true);

  // Report submission state
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Resolve state
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [resolvePhoto, setResolvePhoto] = useState<File | null>(null);
  const [resolveLoading, setResolveLoading] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const resolveInputRef = useRef<HTMLInputElement>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getAwakeReports(filter === "ALL" ? undefined : filter);
      setReports(data);
    } catch (e) {
      console.error("Failed to load Awake Map reports:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [filter]);

  // ── GPS capture ─────────────────────────────────────────────────────────────
  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      () => {
        alert("Unable to retrieve your location. Please allow location access.");
        setGpsLoading(false);
      }
    );
  };

  // ── Photo selection ──────────────────────────────────────────────────────────
  const onPhotoChange = (file: File | null) => {
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  // ── Submit new report ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!photo) return setSubmitError("Please select a photo.");
    if (!description.trim()) return setSubmitError("Please enter a description.");
    if (!coords) return setSubmitError("Please capture your GPS location first.");

    setSubmitError(null);
    setSubmitLoading(true);

    try {
      const fd = new FormData();
      fd.append("photo", photo);
      fd.append("description", description.trim());
      fd.append("lat", String(coords.lat));
      fd.append("lng", String(coords.lng));
      await submitAwakeReport(fd);

      // Reset form
      setDescription("");
      setPhoto(null);
      setPhotoPreview(null);
      setCoords(null);
      setShowSubmitForm(false);
      fetchReports();
    } catch (e: any) {
      setSubmitError(e.message ?? "Submission failed. Try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Resolve report ───────────────────────────────────────────────────────────
  const handleResolve = async (reportId: number) => {
    if (!resolvePhoto) return alert("Please select an after-photo.");
    setResolveLoading(true);
    try {
      const fd = new FormData();
      fd.append("photo", resolvePhoto);
      await resolveAwakeReport(reportId, fd);
      setResolvingId(null);
      setResolvePhoto(null);
      fetchReports();
    } catch (e: any) {
      alert(e.message ?? "Could not mark as resolved.");
    } finally {
      setResolveLoading(false);
    }
  };

  const openCount = reports.filter((r) => r.status === "OPEN").length;
  const resolvedCount = reports.filter((r) => r.status === "RESOLVED").length;

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading Awake Map...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚨</span>
            <div>
              <h2 className="font-bold text-lg leading-tight">Awake Map</h2>
              <p className="text-red-100 text-xs">Civic environmental reporting</p>
            </div>
          </div>
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="bg-white text-red-600 font-bold text-sm px-3 py-1.5 rounded-xl shadow-md active:scale-95 transition-transform"
          >
            {showSubmitForm ? "✕ Cancel" : "+ Report"}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Total Reports", value: reports.length, icon: "📍" },
            { label: "Open Issues", value: openCount, icon: "🔴" },
            { label: "Resolved", value: resolvedCount, icon: "✅" },
          ].map((s) => (
            <div key={s.label} className="bg-white/20 rounded-xl p-2 text-center">
              <p className="text-lg font-black">{s.icon} {s.value}</p>
              <p className="text-red-100 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Submit Form ── */}
      {showSubmitForm && (
        <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-md flex flex-col gap-3">
          <h3 className="font-bold text-gray-800 text-sm">📸 Report an Unhygienic Location</h3>

          {/* Photo picker */}
          <div
            onClick={() => photoInputRef.current?.click()}
            className="border-2 border-dashed border-red-200 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer bg-red-50 hover:bg-red-100 transition-colors overflow-hidden"
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <span className="text-3xl">📷</span>
                <p className="text-xs text-gray-500 mt-1">Tap to upload photo</p>
              </>
            )}
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
          />

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue (e.g. open garbage dump near school gate)"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          {/* GPS capture */}
          <button
            onClick={captureGPS}
            disabled={gpsLoading}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-colors ${
              coords
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {gpsLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Capturing location…
              </>
            ) : coords ? (
              `✅ Location captured (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
            ) : (
              "📍 Capture My GPS Location"
            )}
          </button>

          {submitError && (
            <p className="text-red-500 text-xs text-center">{submitError}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitLoading}
            className="bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60 active:scale-95 transition-transform"
          >
            {submitLoading ? "Submitting…" : "Submit Report"}
          </button>
        </div>
      )}

      {/* ── Filter Chips ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: "ALL", label: "🌍 All" },
          { key: "OPEN", label: "🔴 Open" },
          { key: "RESOLVED", label: "✅ Resolved" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Leaflet Map ── */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-[50vw] sm:h-72 md:h-96">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 gap-3">
            <span className="text-5xl">🗺️</span>
            <p className="text-gray-500 text-sm">No reports found</p>
          </div>
        ) : (
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapAutoFit reports={reports} />

            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[report.lat, report.lng]}
                icon={createAwakeIcon(report.status)}
              >
                <Popup maxWidth={280} className="awake-popup">
                  <div className="p-1 min-w-[240px]">

                    {/* Before photo */}
                    {report.beforePhotoUrl && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          {report.status === "RESOLVED" ? "BEFORE" : "REPORTED"}
                        </p>
                        <img
                          src={report.beforePhotoUrl}
                          alt="Before"
                          className="w-full h-28 object-cover rounded-lg"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    )}

                    {/* After photo (if resolved) */}
                    {report.status === "RESOLVED" && report.afterPhotoUrl && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-green-600 mb-1">AFTER (CLEANED)</p>
                        <img
                          src={report.afterPhotoUrl}
                          alt="After"
                          className="w-full h-28 object-cover rounded-lg"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        report.status === "OPEN"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {report.status === "OPEN" ? "🔴 Open" : "✅ Resolved"}
                      </span>
                      <span className="text-xs text-gray-400">{timeAgo(report.createdAt)}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-800 font-medium leading-snug mb-2">
                      {report.description}
                    </p>

                    <hr className="my-2 border-gray-100" />

                    {/* Reporter info */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-600 flex-shrink-0">
                        {report.reporterName?.charAt(0) ?? "?"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{report.reporterName}</p>
                        {report.status === "RESOLVED" && report.resolvedByName && (
                          <p className="text-xs text-green-600">
                            ✅ Resolved by {report.resolvedByName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mark as Resolved button — only shows for OPEN reports */}
                    {report.status === "OPEN" && (
                      <>
                        {resolvingId === report.id ? (
                          <div className="flex flex-col gap-2 mt-2">
                            <p className="text-xs text-gray-600 font-medium">
                              Upload a photo showing the cleaned location:
                            </p>
                            <label className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg py-2 text-xs text-green-700 font-medium cursor-pointer hover:bg-green-100">
                              <input
                                ref={resolveInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={(e) => setResolvePhoto(e.target.files?.[0] ?? null)}
                              />
                              {resolvePhoto ? `✅ ${resolvePhoto.name}` : "📷 Select After-Photo"}
                            </label>
                            <button
                              onClick={() => handleResolve(report.id)}
                              disabled={resolveLoading || !resolvePhoto}
                              className="bg-green-500 text-white text-xs font-bold py-1.5 rounded-lg disabled:opacity-60"
                            >
                              {resolveLoading ? "Submitting…" : "Mark as Resolved"}
                            </button>
                            <button
                              onClick={() => { setResolvingId(null); setResolvePhoto(null); }}
                              className="text-xs text-gray-400 underline text-center"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setResolvingId(report.id)}
                            className="w-full mt-2 bg-green-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            ✅ Mark as Resolved
                          </button>
                        )}
                      </>
                    )}

                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* ── Legend ── */}
      <div className="flex gap-4 px-1">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
          Open issue
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
          Resolved by community
        </div>
      </div>

      {/* ── Report Feed ── */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🕐</span> Recent Reports
        </h3>
        <div className="flex flex-col gap-2">
          {reports.slice(0, 15).map((report) => (
            <div
              key={report.id}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-red-50 flex items-center justify-center">
                {report.beforePhotoUrl ? (
                  <img
                    src={report.beforePhotoUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <span className="text-2xl">🚨</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{report.description}</p>
                <p className="text-gray-500 text-xs truncate">👤 {report.reporterName}</p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  report.status === "OPEN"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {report.status === "OPEN" ? "Open" : "Done"}
                </span>
                <span className="text-gray-400 text-xs">{timeAgo(report.createdAt)}</span>
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p className="text-4xl mb-2">🌍</p>
              <p className="text-sm">No reports yet. Be the first to flag an issue!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
