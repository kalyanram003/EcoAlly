interface PlaceholderTabProps {
  title: string;
  description: string;
  icon: string;
}

export function PlaceholderTab({ title, description, icon }: PlaceholderTabProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-[#2ECC71]/10 rounded-full flex items-center justify-center mb-4">
        <span className="text-4xl">{icon}</span>
      </div>
      <h2 className="font-semibold text-xl mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <button className="bg-[#2ECC71] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#27AE60] transition-colors">
        Coming Soon
      </button>
    </div>
  );
}