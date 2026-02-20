import { useState } from "react";
import { ArrowLeft, Camera, Upload, Zap, Check } from "lucide-react";
import { Button } from "../../components/ui/button";

interface QRScannerPageProps {
  onBack: () => void;
}

interface ScannedTip {
  title: string;
  description: string;
  points: number;
  icon: string;
}

export function QRScannerPage({ onBack }: QRScannerPageProps) {
  const [scanMode, setScanMode] = useState<"camera" | "gallery" | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTip, setScannedTip] = useState<ScannedTip | null>(null);

  // Mock eco tips that could be found via QR codes
  const ecoTips = [
    {
      title: "Energy Saving Tip",
      description: "Turn off lights when leaving a room to save up to 10% on your electricity bill!",
      points: 25,
      icon: "💡"
    },
    {
      title: "Water Conservation",
      description: "Taking shorter showers can save up to 20 gallons of water per day!",
      points: 30,
      icon: "💧"
    },
    {
      title: "Waste Reduction",
      description: "Using a reusable water bottle can prevent 1,460 plastic bottles from entering landfills annually!",
      points: 35,
      icon: "♻️"
    },
    {
      title: "Transportation Tip",
      description: "Walking or biking short distances reduces your carbon footprint by 2.6 pounds of CO2 per mile!",
      points: 40,
      icon: "🚲"
    }
  ];

  const handleScan = (mode: "camera" | "gallery") => {
    setScanMode(mode);
    setIsScanning(true);

    // Simulate scanning process
    setTimeout(() => {
      const randomTip = ecoTips[Math.floor(Math.random() * ecoTips.length)];
      setScannedTip(randomTip);
      setIsScanning(false);
    }, 2000);
  };

  const handleResetScan = () => {
    setScanMode(null);
    setIsScanning(false);
    setScannedTip(null);
  };

  if (scannedTip) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="ml-2">
              <h1 className="text-xl font-semibold text-gray-900">QR Scanner</h1>
              <p className="text-sm text-gray-500">Eco tip discovered!</p>
            </div>
          </div>

          {/* Success Content */}
          <div className="text-center">
            <div className="w-20 h-20 bg-[#2ECC71]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-[#2ECC71]" />
            </div>

            <h2 className="text-2xl font-semibold mb-2">Great Discovery!</h2>
            <p className="text-gray-600 mb-6">You've found a valuable eco tip!</p>

            {/* Tip Card */}
            <div className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-xl p-6 text-white mb-6">
              <div className="text-4xl mb-3">{scannedTip.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{scannedTip.title}</h3>
              <p className="text-sm opacity-90 mb-4">{scannedTip.description}</p>

              <div className="bg-white/20 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">+{scannedTip.points} Eco Points</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleResetScan}
                className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white py-3"
              >
                Scan Another QR Code
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full py-3"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="ml-2">
              <h1 className="text-xl font-semibold text-gray-900">QR Scanner</h1>
              <p className="text-sm text-gray-500">Scanning for eco tips...</p>
            </div>
          </div>

          {/* Scanning Animation */}
          <div className="text-center">
            <div className="relative w-64 h-64 mx-auto mb-6">
              <div className="w-full h-full border-4 border-[#2ECC71] rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2ECC71]/20 to-transparent animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 border-4 border-[#2ECC71] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-[#2ECC71] rounded-tl-lg"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-[#2ECC71] rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-[#2ECC71] rounded-bl-lg"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-[#2ECC71] rounded-br-lg"></div>
            </div>

            <h2 className="text-xl font-semibold mb-2">
              {scanMode === "camera" ? "Looking for QR codes..." : "Processing image..."}
            </h2>
            <p className="text-gray-600">
              {scanMode === "camera"
                ? "Point your camera at a QR code to discover eco tips!"
                : "Analyzing your uploaded image for QR codes..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="ml-2">
            <h1 className="text-xl font-semibold text-gray-900">QR Scanner</h1>
            <p className="text-sm text-gray-500">Discover eco tips & earn points</p>
          </div>
        </div>

        {/* Scanner Options */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#2ECC71]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-12 h-12 text-[#2ECC71]" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Scan QR Codes</h2>
          <p className="text-gray-600 mb-6">
            Find QR codes around your school or community to discover eco-friendly tips and earn points!
          </p>
        </div>

        {/* Scan Options */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => handleScan("camera")}
            className="w-full bg-[#2ECC71] text-white rounded-xl p-4 flex items-center gap-4 hover:bg-[#27AE60] transition-colors"
          >
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Use Camera</h3>
              <p className="text-sm opacity-90">Scan QR codes directly with your camera</p>
            </div>
          </button>

          <button
            onClick={() => handleScan("gallery")}
            className="w-full bg-white border-2 border-[#2ECC71] text-[#2ECC71] rounded-xl p-4 flex items-center gap-4 hover:bg-[#2ECC71]/5 transition-colors"
          >
            <div className="w-12 h-12 bg-[#2ECC71]/10 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-[#2ECC71]" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Upload from Gallery</h3>
              <p className="text-sm opacity-80">Choose an image with a QR code</p>
            </div>
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">💡 How it works:</h3>
          <div className="space-y-1 text-sm text-blue-700">
            <p>• Look for EcoAlly QR codes around your campus</p>
            <p>• Scan to unlock exclusive eco tips</p>
            <p>• Earn 25-40 eco points per tip discovered</p>
            <p>• Share tips with friends and family!</p>
          </div>
        </div>
      </div>
    </div>
  );
}