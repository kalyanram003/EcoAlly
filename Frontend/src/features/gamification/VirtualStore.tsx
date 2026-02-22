import { useState, useEffect } from "react";
import { ShoppingCart, Star, Gift, Sparkles, Crown, Flame, Shield, Zap, Heart, Coins } from "lucide-react";
import { Button } from "../../components/ui/button";
import * as api from "../../lib/api";

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  category: "avatar" | "badge_frame" | "streak_effect" | "wallpaper" | "sticker" | "boost";
  rarity: "common" | "rare" | "epic" | "legendary";
  owned: boolean;
  icon: React.ReactNode;
  previewColor: string;
}

export interface MysteryChest {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  possibleRewards: string[];
  rarity: "common" | "rare" | "epic";
}

interface VirtualStoreProps {
  currentCoins: number;
  onPurchase?: (itemId: string, cost: number) => void;
  onOpenChest?: (chestId: string) => void;
}

export function VirtualStore({ currentCoins, onPurchase, onOpenChest }: VirtualStoreProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "avatar" | "effects" | "boosts" | "chests">("all");
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  // IDs of items the user already owns (fetched from the API)
  const [ownedItemIds, setOwnedItemIds] = useState<string[]>([]);

  useEffect(() => {
    api.getOwnedItems().then(setOwnedItemIds).catch(() => { });
  }, []);

  // Derive `owned` dynamically from ownedItemIds so it stays in sync after purchases
  const storeItems: StoreItem[] = [
    // Avatar Items
    {
      id: "green_frame",
      name: "Eco Warrior Frame",
      description: "A beautiful green frame that shows your dedication to the environment",
      emoji: "🍃",
      price: 150,
      category: "badge_frame",
      rarity: "common",
      owned: ownedItemIds.includes("green_frame"),
      icon: <Shield className="w-5 h-5" />,
      previewColor: "border-green-400 bg-green-50"
    },
    {
      id: "golden_frame",
      name: "Golden Champion Frame",
      description: "Prestigious golden frame for top eco champions",
      emoji: "👑",
      price: 500,
      category: "badge_frame",
      rarity: "epic",
      owned: ownedItemIds.includes("golden_frame"),
      icon: <Crown className="w-5 h-5" />,
      previewColor: "border-yellow-400 bg-yellow-50"
    },
    {
      id: "rainbow_frame",
      name: "Rainbow Guardian Frame",
      description: "Legendary rainbow frame that cycles through colors",
      emoji: "🌈",
      price: 1000,
      category: "badge_frame",
      rarity: "legendary",
      owned: ownedItemIds.includes("rainbow_frame"),
      icon: <Sparkles className="w-5 h-5" />,
      previewColor: "border-purple-400 bg-gradient-to-r from-pink-50 to-purple-50"
    },
    // Streak Effects
    {
      id: "fire_streak",
      name: "Flame Streak Effect",
      description: "Adds fire animations to your streak counter",
      emoji: "🔥",
      price: 200,
      category: "streak_effect",
      rarity: "rare",
      owned: ownedItemIds.includes("fire_streak"),
      icon: <Flame className="w-5 h-5" />,
      previewColor: "border-red-400 bg-red-50"
    },
    {
      id: "lightning_streak",
      name: "Lightning Streak Effect",
      description: "Electric sparks for your amazing streaks",
      emoji: "⚡",
      price: 300,
      category: "streak_effect",
      rarity: "rare",
      owned: ownedItemIds.includes("lightning_streak"),
      icon: <Zap className="w-5 h-5" />,
      previewColor: "border-blue-400 bg-blue-50"
    },
    {
      id: "cosmic_streak",
      name: "Cosmic Streak Effect",
      description: "Stars and galaxies swirl around your streak",
      emoji: "✨",
      price: 750,
      category: "streak_effect",
      rarity: "epic",
      owned: ownedItemIds.includes("cosmic_streak"),
      icon: <Star className="w-5 h-5" />,
      previewColor: "border-purple-400 bg-purple-50"
    },
    // Wallpapers
    {
      id: "forest_wallpaper",
      name: "Enchanted Forest",
      description: "Beautiful forest background for your profile",
      emoji: "🌲",
      price: 100,
      category: "wallpaper",
      rarity: "common",
      owned: ownedItemIds.includes("forest_wallpaper"),
      icon: <div className="w-5 h-5 bg-green-400 rounded" />,
      previewColor: "border-green-400 bg-green-50"
    },
    {
      id: "ocean_wallpaper",
      name: "Ocean Depths",
      description: "Serene underwater scene with marine life",
      emoji: "🌊",
      price: 150,
      category: "wallpaper",
      rarity: "common",
      owned: ownedItemIds.includes("ocean_wallpaper"),
      icon: <div className="w-5 h-5 bg-blue-400 rounded" />,
      previewColor: "border-blue-400 bg-blue-50"
    },
    // Boosts
    {
      id: "point_multiplier",
      name: "Point Multiplier 2x",
      description: "Double points for 24 hours",
      emoji: "💫",
      price: 300,
      category: "boost",
      rarity: "rare",
      owned: ownedItemIds.includes("point_multiplier"),
      icon: <Zap className="w-5 h-5" />,
      previewColor: "border-yellow-400 bg-yellow-50"
    },
    {
      id: "streak_shield",
      name: "Streak Protection Shield",
      description: "Protects your streak for one missed day",
      emoji: "🛡️",
      price: 250,
      category: "boost",
      rarity: "rare",
      owned: ownedItemIds.includes("streak_shield"),
      icon: <Shield className="w-5 h-5" />,
      previewColor: "border-green-400 bg-green-50"
    },
    // Stickers
    {
      id: "eco_sticker_pack",
      name: "Eco Sticker Pack",
      description: "Collection of 10 environmental stickers",
      emoji: "🌱",
      price: 80,
      category: "sticker",
      rarity: "common",
      owned: ownedItemIds.includes("eco_sticker_pack"),
      icon: <Heart className="w-5 h-5" />,
      previewColor: "border-green-400 bg-green-50"
    }
  ];

  const mysteryChests: MysteryChest[] = [
    {
      id: "common_chest",
      name: "Nature's Gift",
      description: "A mysterious chest containing common eco rewards",
      emoji: "📦",
      price: 100,
      possibleRewards: ["Eco Stickers", "Basic Frames", "Profile Themes"],
      rarity: "common"
    },
    {
      id: "rare_chest",
      name: "Guardian's Treasure",
      description: "Rare chest with valuable eco rewards and effects",
      emoji: "🏆",
      price: 300,
      possibleRewards: ["Streak Effects", "Rare Frames", "Point Boosts", "Exclusive Wallpapers"],
      rarity: "rare"
    },
    {
      id: "legendary_chest",
      name: "Legend's Vault",
      description: "Ultimate chest containing the rarest eco treasures",
      emoji: "💎",
      price: 750,
      possibleRewards: ["Legendary Frames", "Cosmic Effects", "Mega Boosts", "Exclusive Companions"],
      rarity: "epic"
    }
  ];

  const categories = [
    { id: "all" as const, label: "All Items", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "avatar" as const, label: "Avatar", icon: <Crown className="w-4 h-4" /> },
    { id: "effects" as const, label: "Effects", icon: <Sparkles className="w-4 h-4" /> },
    { id: "boosts" as const, label: "Boosts", icon: <Zap className="w-4 h-4" /> },
    { id: "chests" as const, label: "Chests", icon: <Gift className="w-4 h-4" /> }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-300 bg-gray-50";
      case "rare": return "border-blue-400 bg-blue-50";
      case "epic": return "border-purple-400 bg-purple-50";
      case "legendary": return "border-yellow-400 bg-gradient-to-r from-yellow-50 to-pink-50";
      default: return "border-gray-300 bg-gray-50";
    }
  };

  const getRarityBadge = (rarity: string) => {
    const colors = {
      common: "bg-gray-100 text-gray-700",
      rare: "bg-blue-100 text-blue-700",
      epic: "bg-purple-100 text-purple-700",
      legendary: "bg-gradient-to-r from-yellow-100 to-pink-100 text-purple-700"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colors[rarity as keyof typeof colors] || colors.common}`}>
        {rarity}
      </span>
    );
  };

  const getFilteredItems = () => {
    if (activeCategory === "all") return storeItems;
    if (activeCategory === "chests") return [];
    if (activeCategory === "avatar") return storeItems.filter(item => item.category === "badge_frame" || item.category === "avatar");
    if (activeCategory === "effects") return storeItems.filter(item => item.category === "streak_effect" || item.category === "wallpaper" || item.category === "sticker");
    if (activeCategory === "boosts") return storeItems.filter(item => item.category === "boost");
    return storeItems;
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🛍️ Eco Market</h2>
        <p className="text-gray-600">Spend your eco coins on amazing rewards!</p>

        {/* Coins Display */}
        <div className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-xl p-4 mt-4 text-white">
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-6 h-6" />
            <span className="text-2xl font-bold">{currentCoins.toLocaleString()}</span>
            <span className="text-white/80">Eco Coins</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${activeCategory === category.id
              ? "bg-[#2ECC71] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {category.icon}
            {category.label}
          </button>
        ))}
      </div>

      {/* Mystery Chests */}
      {activeCategory === "chests" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">🎁 Mystery Chests</h3>
          <div className="grid gap-4">
            {mysteryChests.map((chest) => (
              <div key={chest.id} className={`bg-white rounded-xl border-2 p-4 ${getRarityColor(chest.rarity)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white/50 rounded-xl flex items-center justify-center text-3xl backdrop-blur-sm">
                      {chest.emoji}
                    </div>
                    <div>
                      <h4 className="font-semibold">{chest.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">{chest.description}</p>
                      {getRarityBadge(chest.rarity)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[#2ECC71] font-bold">
                      <Coins className="w-4 h-4" />
                      <span>{chest.price}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium text-sm mb-2">Possible Rewards:</h5>
                  <div className="flex flex-wrap gap-1">
                    {chest.possibleRewards.map((reward, index) => (
                      <span key={index} className="px-2 py-1 bg-white/70 rounded-full text-xs text-gray-700">
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => onOpenChest?.(chest.id)}
                  className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                  disabled={currentCoins < chest.price}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Open Chest - {chest.price} coins
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Store Items */}
      {activeCategory !== "chests" && (
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className={`bg-white rounded-xl border-2 p-4 ${item.owned ? 'opacity-60' : getRarityColor(item.rarity)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${item.previewColor} ${item.owned ? 'opacity-50' : ''}`}>
                    {item.emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      {item.name}
                      {item.owned && <span className="text-green-600 text-sm">✓ Owned</span>}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                    <div className="flex items-center gap-2">
                      {getRarityBadge(item.rarity)}
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600 capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[#2ECC71] font-bold">
                    <Coins className="w-4 h-4" />
                    <span>{item.price}</span>
                  </div>
                </div>
              </div>

              {!item.owned && (
                <Button
                  onClick={async () => {
                    try {
                      const result = await api.purchaseItem(item.id, item.price);
                      setOwnedItemIds(result.ownedItems);
                      onPurchase?.(item.id, item.price);
                    } catch (err: any) {
                      alert(err.message);
                    }
                  }}
                  className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                  disabled={currentCoins < item.price}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase - {item.price} coins
                </Button>
              )}

              {item.owned && (
                <div className="flex items-center justify-center py-2 text-green-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Already Owned
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && activeCategory !== "chests" && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🛍️</div>
          <h3 className="font-semibold mb-2">No items in this category yet</h3>
          <p className="text-gray-600">Check back later for new eco rewards!</p>
        </div>
      )}

      {/* Purchase Power Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
        <h3 className="font-semibold mb-2">💎 Your Purchasing Power</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Can afford:</span>
            <div className="font-bold text-green-600">
              {filteredItems.filter(item => !item.owned && currentCoins >= item.price).length} items
            </div>
          </div>
          <div>
            <span className="text-gray-600">Next unlock:</span>
            <div className="font-bold text-blue-600">
              {filteredItems.find(item => !item.owned && currentCoins < item.price)?.price || 0} coins
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}
