import { useState } from "react";
import { ArrowLeft, Camera, Upload, CheckCircle2, X } from "lucide-react";
import * as api from "../../../lib/api";
import { Challenge } from "./ChallengesTab";

interface ChallengeSubmissionProps {
  challenge: Challenge;
  onBack: () => void;
  onComplete: () => void;
}

interface UploadedPhoto {
  id: string;
  url: string;
  caption: string;
}

export function ChallengeSubmission({ challenge, onBack, onComplete }: ChallengeSubmissionProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  // Keep raw File references so we can upload them to the API
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  const [checkedRequirements, setCheckedRequirements] = useState<boolean[]>(
    new Array(challenge.requirements.length).fill(false)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRequirementCheck = (index: number) => {
    const newChecked = [...checkedRequirements];
    newChecked[index] = !newChecked[index];
    setCheckedRequirements(newChecked);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Check if it's an image file
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Check if we haven't reached the limit
      if (photos.length >= 3) {
        alert('Maximum 3 photos allowed');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: UploadedPhoto = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          url: e.target?.result as string,
          caption: file.name
        };
        setPhotos(prev => [...prev, newPhoto]);
        // Also keep the raw File object for upload
        setPhotoFiles(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  const removePhoto = (photoId: string) => {
    const idx = photos.findIndex(p => p.id === photoId);
    setPhotos(photos.filter(photo => photo.id !== photoId));
    if (idx !== -1) {
      setPhotoFiles(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const canSubmit = () => {
    const allRequirementsChecked = checkedRequirements.every(checked => checked);
    const hasPhotosIfRequired = challenge.type !== "photo" || photos.length >= 2;
    return allRequirementsChecked && hasPhotosIfRequired;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;
    setIsSubmitting(true);
    try {
      await api.submitChallenge(challenge.id, notes, photoFiles);
      setShowSuccess(true);
      setTimeout(() => onComplete(), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[#2ECC71] rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Challenge Complete!</h1>
        <h2 className="text-lg font-medium text-gray-700 mb-2">{challenge.title}</h2>
        <p className="text-gray-600 mb-6">Congratulations! You've earned {challenge.points} eco points.</p>
        <div className="text-4xl mb-4">🎉</div>
        <p className="text-sm text-gray-500">Returning to challenges...</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold">Submit Challenge</h2>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Challenge Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 ${challenge.color} rounded-lg flex items-center justify-center`}>
            <span className="text-lg">{challenge.icon}</span>
          </div>
          <div>
            <h3 className="font-semibold">{challenge.title}</h3>
            <p className="text-sm text-gray-600">{challenge.points} points</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Requirements Checklist */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Complete All Requirements</h3>
            <span className={`text-sm px-2 py-1 rounded-full ${checkedRequirements.every(checked => checked)
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
              }`}>
              {checkedRequirements.filter(checked => checked).length}/{challenge.requirements.length} {
                checkedRequirements.every(checked => checked) ? "✓" : ""
              }
            </span>
          </div>
          <div className="space-y-3">
            {challenge.requirements.map((requirement, index) => (
              <label key={index} className="flex items-start gap-3 cursor-pointer">
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={checkedRequirements[index]}
                    onChange={() => handleRequirementCheck(index)}
                    className="w-5 h-5 text-[#2ECC71] rounded border-2 border-gray-300 focus:ring-[#2ECC71] focus:ring-2"
                  />
                </div>
                <span className="text-sm text-gray-700">{requirement}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Photo Upload (if photo challenge) */}
        {challenge.type === "photo" && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Upload Photos</h3>
              <span className={`text-sm px-2 py-1 rounded-full ${photos.length >= 2
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
                }`}>
                {photos.length}/3 photos {photos.length >= 2 ? "✓" : "(min 2)"}
              </span>
            </div>

            {photos.length > 0 && (
              <div className="space-y-3 mb-4">
                <h4 className="font-medium text-sm text-gray-700">Uploaded Photos</h4>
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate" title={photo.caption}>
                        {photo.caption}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {/* Camera Button */}
              <label className="w-full bg-[#2ECC71] text-white rounded-lg p-4 text-center hover:bg-[#27AE60] transition-colors cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={photos.length >= 3}
                />
                <Camera className="w-6 h-6 mx-auto mb-2" />
                <p className="font-medium">
                  {photos.length >= 3 ? "Camera (Max reached)" : "Take Photo"}
                </p>
              </label>

              {/* Gallery Button */}
              <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#2ECC71] transition-colors cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={photos.length >= 3}
                />
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  {photos.length >= 3 ? "Gallery (Max reached)" : "Choose from Gallery"}
                </p>
              </label>

              <p className="text-xs text-gray-500 text-center">
                {photos.length}/3 photos (minimum 2 required) • JPG, PNG, WEBP • Max 5MB each
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">Additional Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share your experience, challenges, or insights..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit() || isSubmitting}
          className={`w-full py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${canSubmit() && !isSubmitting
              ? "bg-[#2ECC71] text-white hover:bg-[#27AE60]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Submit Challenge
            </>
          )}
        </button>

        {!canSubmit() && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 font-medium mb-2">
              🔒 Complete these to submit:
            </p>
            <div className="space-y-1">
              {!checkedRequirements.every(checked => checked) && (
                <p className="text-xs text-amber-700">
                  ✓ Check all requirement boxes above
                </p>
              )}
              {challenge.type === "photo" && photos.length < 2 && (
                <p className="text-xs text-amber-700">
                  📸 Upload at least 2 photos
                </p>
              )}
            </div>
          </div>
        )}

        {canSubmit() && !isSubmitting && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium text-center">
              🎉 Ready to submit! You'll earn {challenge.points} eco points
            </p>
          </div>
        )}
      </div>
    </div>
  );
}