import { useState } from "react";
import { X, Share2, Copy, Twitter, Facebook, Instagram, Link, Check, ArrowLeft } from "lucide-react";
import { UserProfile } from "./ProfileTab";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export function ShareProfileModal({ isOpen, onClose, userProfile }: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `Check out my eco journey on EcoLearn! 🌱 I'm Level ${userProfile.level} with ${userProfile.totalPoints.toLocaleString()} eco points! Join me in making a difference for our planet! 🌍`;
  const shareUrl = `https://ecolearn.app/profile/${userProfile.id}`;

  const fallbackCopyTextToClipboard = (text: string): boolean => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  };

  const handleCopyLink = async () => {
    let success = false;
    
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        success = true;
      } catch (err) {
        console.warn("Clipboard API failed, trying fallback:", err);
        success = fallbackCopyTextToClipboard(shareUrl);
      }
    } else {
      // Use fallback method
      success = fallbackCopyTextToClipboard(shareUrl);
    }
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // Last resort - show alert with text to copy manually
      alert(`Please copy this link manually:\n\n${shareUrl}`);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userProfile.name}'s EcoLearn Profile`,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case "instagram":
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        const instagramText = `${shareText} ${shareUrl}`;
        let instagramSuccess = false;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            navigator.clipboard.writeText(instagramText);
            instagramSuccess = true;
          } catch (err) {
            console.warn("Clipboard API failed for Instagram, trying fallback:", err);
            instagramSuccess = fallbackCopyTextToClipboard(instagramText);
          }
        } else {
          instagramSuccess = fallbackCopyTextToClipboard(instagramText);
        }
        
        if (instagramSuccess) {
          alert("Link copied! Paste it in your Instagram story or bio.");
        } else {
          alert(`Please copy this text manually for Instagram:\n\n${instagramText}`);
        }
        return;
    }
    
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-xl animate-in duration-200 slide-in-from-bottom-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2ECC71]/10 rounded-full flex items-center justify-center">
                <Share2 className="w-5 h-5 text-[#2ECC71]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Share Profile</h2>
                <p className="text-sm text-gray-600">Spread your eco journey!</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile Preview */}
          <div className="p-6 border-b border-gray-100">
            <div className="bg-gradient-to-br from-[#2ECC71] via-[#27AE60] to-[#1E8449] rounded-xl p-4 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-lg">{userProfile.avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{userProfile.name}</h3>
                  <p className="text-white/80 text-sm">Level {userProfile.level} Eco Learner</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="font-semibold">{userProfile.totalPoints.toLocaleString()}</div>
                  <div className="text-white/80 text-xs">Eco Points</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="font-semibold">#{userProfile.rank}</div>
                  <div className="text-white/80 text-xs">Class Rank</div>
                </div>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Share via</h3>
            
            {/* Native Share (if supported) */}
            {navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#2ECC71] text-white hover:bg-[#27AE60] transition-colors mb-3"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share via device</span>
              </button>
            )}

            {/* Social Media Options */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => shareToSocial("twitter")}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-blue-700 font-medium">Twitter</span>
              </button>

              <button
                onClick={() => shareToSocial("facebook")}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-blue-700 font-medium">Facebook</span>
              </button>

              <button
                onClick={() => shareToSocial("instagram")}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-pink-700 font-medium">Instagram</span>
              </button>
            </div>

            {/* Copy Link */}
            <div className="border border-gray-200 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <Link className="w-5 h-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate">{shareUrl}</p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    copied 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {copied ? (
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Copied
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Copy className="w-3 h-3" />
                      Copy
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Message Preview */}
            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 italic">{shareText}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-100 flex-shrink-0 bg-white">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
}