interface Badge {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
  description: string;
}

export function Badges() {
  const badges: Badge[] = [
    {
      id: "1",
      name: "Eco Beginner",
      icon: "🌱",
      earned: true,
      description: "Complete your first task"
    },
    {
      id: "2",
      name: "Water Saver",
      icon: "💧",
      earned: true,
      description: "Complete 5 water conservation tasks"
    },
    {
      id: "3",
      name: "Green Champion",
      icon: "🏆",
      earned: true,
      description: "Reach 1000 eco points"
    },
    {
      id: "4",
      name: "Energy Master",
      icon: "⚡",
      earned: false,
      description: "Complete all energy challenges"
    },
    {
      id: "5",
      name: "Recycle Pro",
      icon: "♻️",
      earned: false,
      description: "Upload 10 recycling photos"
    },
    {
      id: "6",
      name: "Eco Warrior",
      icon: "🛡️",
      earned: false,
      description: "Maintain 30-day streak"
    }
  ];

  return (
    <div className="p-4">
      <h2 className="font-semibold text-lg mb-4">Your Badges</h2>
      <div className="grid grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div 
            key={badge.id}
            className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center ${
              !badge.earned ? 'opacity-50' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
              badge.earned ? 'bg-[#2ECC71]/10' : 'bg-gray-100'
            }`}>
              <span className="text-xl">{badge.earned ? badge.icon : '🔒'}</span>
            </div>
            <p className="font-medium text-xs mb-1">{badge.name}</p>
            <p className="text-xs text-gray-500 leading-tight">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}