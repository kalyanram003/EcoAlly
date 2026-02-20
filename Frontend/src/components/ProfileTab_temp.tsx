  // Show EditProfilePage if requested
  if (showEditProfilePage) {
    return <EditProfilePage userProfile={userProfile} onSave={handleProfileUpdate} onBack={() => setShowEditProfilePage(false)} />;
  }

      {/* Modals */}
      {showEditModal && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          userProfile={userProfile}
          onSave={handleProfileUpdate}
        />
      )}

      {showShareModal && (
        <ShareProfileModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          userProfile={userProfile}
        />
      )}

      {/* Notes section - add this where needed in the main content */}
      {activeSection === "notes" && (
        <div className="space-y-4">
          {/* Notes Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#2ECC71]" />
              <h3 className="font-semibold">My Eco Notes</h3>
            </div>
            
            {/* Quick Add Note */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <textarea 
                placeholder="Add a quick note about your eco journey..."
                className="w-full bg-transparent border-none resize-none focus:outline-none text-sm"
                rows={3}
              />
              <button className="mt-2 px-4 py-2 bg-[#2ECC71] text-white rounded-lg text-sm hover:bg-[#27AE60] transition-colors">
                Save Note
              </button>
            </div>

            {/* Sample Notes */}
            <div className="space-y-3">
              <div className="border-l-4 border-[#2ECC71] pl-3 py-2">
                <p className="text-sm text-gray-800">Learned about composting today - planning to start my own compost bin!</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday, 2:30 PM</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-3 py-2">
                <p className="text-sm text-gray-800">Completed the water conservation challenge. Reduced usage by 15% this week.</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago, 6:45 PM</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-3 py-2">
                <p className="text-sm text-gray-800">Planted 5 trees in the community garden with my eco club!</p>
                <p className="text-xs text-gray-500 mt-1">1 week ago, 10:15 AM</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}