import { User, Coins } from "lucide-react";

interface HeaderProps {
  setActiveTab: (tab: string) => void;
}

export function Header({ setActiveTab }: HeaderProps) {
  const handleProfileClick = () => {
    setActiveTab("profile");
  };

  const handleHomeClick = () => {
    setActiveTab("home");
  };

  return (
    <div className="bg-[#2ECC71] p-4 shadow-lg sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <button 
          onClick={handleHomeClick}
          className="flex items-center gap-3 hover:bg-white/10 rounded-lg p-2 -m-2 transition-colors duration-200"
        >
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
            <span className="text-[#2ECC71] text-lg">🌱</span>
          </div>
          <h1 className="text-white text-xl font-semibold">EcoAlly</h1>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Coins className="w-4 h-4 text-white" />
            <span className="text-white font-medium">1,250</span>
          </div>
          <button
            onClick={handleProfileClick}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors duration-200 shadow-sm"
          >
            <User className="w-5 h-5 text-[#2ECC71]" />
          </button>
        </div>
      </div>
    </div>
  );
}