interface EcoLearnLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function EcoLearnLogo({ size = "md", className = "" }: EcoLearnLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-12 w-auto", 
    lg: "h-16 w-auto",
    xl: "h-24 w-auto"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl", 
    xl: "text-4xl"
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-14 h-14"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Eco Leaf Icon */}
      <div className={`relative ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="w-full h-full"
        >
          {/* Main leaf shape */}
          <path
            d="M4 28C4 28 8 20 16 16C24 12 28 4 28 4C28 4 24 8 20 12C16 16 12 20 8 24C6 26 4 28 4 28Z"
            fill="#2ECC71"
          />
          {/* Leaf vein */}
          <path
            d="M6 26C6 26 10 18 16 16C22 14 26 6 26 6"
            stroke="#27AE60"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Small highlight */}
          <circle
            cx="12"
            cy="20"
            r="2"
            fill="#58D68D"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* App Name */}
      <div className="flex flex-col">
        <span className={`font-bold text-[#2ECC71] ${textSizes[size]} leading-none`}>
          EcoLearn
        </span>
        {size === "lg" || size === "xl" ? (
          <span className="text-xs text-gray-500 leading-none mt-0.5">
            Learn. Grow. Sustain.
          </span>
        ) : null}
      </div>
    </div>
  );
}