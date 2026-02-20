import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Video, FileText, ExternalLink } from "lucide-react";

interface LearningMaterial {
  id: string;
  title: string;
  type: "article" | "video" | "infographic" | "quiz" | "external";
  duration?: string;
  description: string;
  content?: string;
  url?: string;
  thumbnail?: string;
}

interface LearningTopic {
  id: string;
  title: string;
  description: string;
  materials: LearningMaterial[];
}

interface LearningMaterialsProps {
  topic: string;
}

const LEARNING_TOPICS: Record<string, LearningTopic> = {
  "waste-management": {
    id: "waste-management",
    title: "Waste Management & Recycling",
    description: "Learn about proper waste sorting, recycling processes, and reducing waste in daily life.",
    materials: [
      {
        id: "waste-basics",
        title: "The Basics of Waste Sorting",
        type: "article",
        duration: "5 min read",
        description: "Understanding different types of waste and how to properly sort them.",
        content: `Proper waste sorting is crucial for effective recycling and environmental protection. Here are the main categories:

**Recyclable Materials:**
• Paper and cardboard (clean, dry)
• Plastic bottles and containers (check recycling codes)
• Glass jars and bottles
• Metal cans (aluminum, steel)

**Organic Waste:**
• Food scraps and peels
• Garden trimmings
• Coffee grounds and tea bags
• Eggshells

**Hazardous Waste:**
• Batteries
• Electronic devices
• Paint and chemicals
• Light bulbs (CFLs, LEDs)

**Tips for Better Sorting:**
1. Clean containers before recycling
2. Remove caps and lids when required
3. Don't bag recyclables (unless specified)
4. When in doubt, throw it out (contamination ruins entire batches)`
      },
      {
        id: "recycling-process",
        title: "How Recycling Works",
        type: "video",
        duration: "8 min watch",
        description: "Follow materials through the recycling process from bin to new products.",
        thumbnail: "🔄"
      },
      {
        id: "reduce-waste-tips",
        title: "50 Ways to Reduce Waste",
        type: "infographic",
        duration: "Quick reference",
        description: "Practical tips for reducing waste in your daily routine.",
        content: `**In the Kitchen:**
• Use reusable containers for food storage
• Buy in bulk to reduce packaging
• Compost organic waste
• Use both sides of paper towels
• Repurpose glass jars

**Shopping:**
• Bring reusable bags
• Choose products with minimal packaging
• Buy second-hand when possible
• Avoid single-use items
• Select concentrated products

**Around the House:**
• Repair instead of replacing
• Donate items you no longer need
• Use rechargeable batteries
• Print double-sided
• Reuse boxes and containers

**Personal Care:**
• Use bar soap instead of liquid
• Choose bamboo toothbrushes
• Make DIY cleaning products
• Use washable cotton pads
• Buy refillable products`
      }
    ]
  },
  "carbon-footprint": {
    id: "carbon-footprint",
    title: "Carbon Footprint & Climate Action",
    description: "Understand your carbon footprint and learn effective ways to reduce it.",
    materials: [
      {
        id: "carbon-basics",
        title: "Understanding Carbon Footprint",
        type: "article",
        duration: "6 min read",
        description: "What is a carbon footprint and why does it matter?",
        content: `A carbon footprint measures the total greenhouse gas emissions caused by an individual, organization, or activity. It's usually expressed in tons of CO2 equivalent per year.

**Major Sources of Personal Carbon Emissions:**

**Transportation (29%):**
• Cars and trucks
• Air travel
• Public transportation
• Shipping and delivery

**Home Energy (28%):**
• Heating and cooling
• Electricity usage
• Water heating
• Lighting and appliances

**Food Production (16%):**
• Meat and dairy products
• Imported foods
• Food packaging
• Food waste

**Consumer Goods (12%):**
• Clothing and textiles
• Electronics
• Furniture
• Personal items

**Why It Matters:**
• Climate change mitigation
• Resource conservation
• Cost savings
• Environmental stewardship
• Future generations

**Quick Facts:**
• Average American: 16 tons CO2/year
• Global average: 4 tons CO2/year
• Target for climate goals: 2 tons CO2/year by 2030`
      },
      {
        id: "low-carbon-alternatives",
        title: "Low-Carbon Lifestyle Choices",
        type: "infographic",
        duration: "Quick reference",
        description: "Compare the carbon impact of different lifestyle choices.",
        content: `**Transportation Alternatives:**
🚗 Gasoline car: 4.6 tons CO2/year
🚗 Electric car: 1.5 tons CO2/year  
🚌 Public transit: 0.5 tons CO2/year
🚴 Bicycle: 0.1 tons CO2/year
🚶 Walking: 0 tons CO2/year

**Diet Choices (per meal):**
🥩 Beef: 6.6 kg CO2
🐷 Pork: 2.9 kg CO2
🐔 Chicken: 2.3 kg CO2
🐟 Fish: 1.6 kg CO2
🥕 Vegetarian: 0.4 kg CO2
🌱 Vegan: 0.3 kg CO2

**Energy Sources:**
☀️ Solar: 0.04 kg CO2/kWh
💨 Wind: 0.01 kg CO2/kWh
⚛️ Nuclear: 0.01 kg CO2/kWh
🔥 Natural Gas: 0.49 kg CO2/kWh
⚫ Coal: 0.82 kg CO2/kWh

**Home Improvements:**
• LED bulbs: 80% less energy than incandescent
• Smart thermostat: 10-15% energy savings
• Insulation: 20-50% heating/cooling reduction
• Energy-efficient appliances: 10-20% savings`
      },
      {
        id: "carbon-calculator",
        title: "Personal Carbon Calculator",
        type: "external",
        description: "Calculate your personal carbon footprint and get personalized recommendations.",
        url: "https://www.carbonfootprint.com/calculator.aspx"
      }
    ]
  },
  "renewable-energy": {
    id: "renewable-energy",
    title: "Renewable Energy & Conservation",
    description: "Explore renewable energy sources and energy conservation strategies.",
    materials: [
      {
        id: "renewable-types",
        title: "Types of Renewable Energy",
        type: "article",
        duration: "7 min read",
        description: "Overview of different renewable energy sources and their benefits.",
        content: `Renewable energy comes from natural sources that replenish themselves over time. Here are the main types:

**Solar Energy:**
• How it works: Converts sunlight into electricity using photovoltaic cells
• Benefits: Abundant, clean, decreasing costs
• Applications: Rooftop solar, solar farms, portable devices
• Potential: Could power the world 10,000 times over

**Wind Energy:**
• How it works: Wind turns turbine blades connected to generators
• Benefits: Cost-effective, mature technology, job creation
• Applications: Onshore/offshore wind farms, small residential turbines
• Growth: Fastest-growing energy source globally

**Hydroelectric Power:**
• How it works: Water flow turns turbines to generate electricity
• Benefits: Reliable, long lifespan, flood control
• Applications: Large dams, run-of-river, micro-hydro
• Facts: Provides 16% of global electricity

**Geothermal Energy:**
• How it works: Uses Earth's internal heat for power/heating
• Benefits: Consistent output, small land footprint
• Applications: Power plants, heat pumps, direct heating
• Locations: Areas with geothermal activity

**Biomass Energy:**
• How it works: Organic materials burned or converted to fuel
• Benefits: Uses waste materials, carbon-neutral potential
• Applications: Wood pellets, biogas, biofuels
• Considerations: Sustainable sourcing important

**Why Switch to Renewables:**
• Climate change mitigation
• Energy independence
• Job creation
• Improved air quality
• Long-term cost savings`
      },
      {
        id: "home-energy-audit",
        title: "DIY Home Energy Audit",
        type: "infographic",
        duration: "30 min activity",
        description: "Step-by-step guide to assess your home's energy efficiency.",
        content: `**Preparation (5 minutes):**
✓ Gather utility bills from past 12 months
✓ Get flashlight, thermometer, incense stick
✓ Download energy audit checklist

**Heating & Cooling Assessment (10 minutes):**
🏠 Check thermostat settings and programmability
🌡️ Measure temperature differences between rooms
🚪 Feel around doors/windows for drafts
🔥 Inspect furnace filters (replace if dirty)
❄️ Check ductwork for leaks or damage

**Lighting & Electrical (5 minutes):**
💡 Count non-LED bulbs (replacement candidates)
🔌 Identify devices left plugged in when not in use
⚡ Check for energy-efficient appliance ratings
📺 Note electronics without power strips

**Water Heating (5 minutes):**
🚿 Test hot water temperature (120°F max recommended)
🔧 Check for water leaks around water heater
🏠 Feel water heater for heat loss
⏰ Time how long hot water takes to reach faucets

**Insulation & Air Sealing (5 minutes):**
🕯️ Use incense to detect air leaks around:
   • Windows and doors
   • Electrical outlets
   • Light fixtures
   • Attic access
🏠 Check basement/crawl space for gaps
📏 Measure insulation depth in accessible areas

**Scoring Your Home:**
• 0-5 issues: Excellent efficiency
• 6-10 issues: Good, room for improvement  
• 11-15 issues: Fair, several upgrades needed
• 16+ issues: Poor, prioritize major improvements`
      }
    ]
  },
  "sustainable-living": {
    id: "sustainable-living",
    title: "Sustainable Living Practices",
    description: "Adopt eco-friendly practices in daily life for a more sustainable lifestyle.",
    materials: [
      {
        id: "sustainable-diet",
        title: "Sustainable Eating Guide",
        type: "article",
        duration: "8 min read",
        description: "How food choices impact the environment and your health.",
        content: `Our food system accounts for about 26% of global greenhouse gas emissions. Here's how to eat more sustainably:

**Choose Plant-Based Options:**
• Reduce meat consumption, especially beef
• Try "Meatless Mondays" or plant-based days
• Explore legumes, nuts, and seeds for protein
• Benefits: Lower carbon footprint, health benefits, cost savings

**Buy Local and Seasonal:**
• Shop at farmers' markets
• Join a Community Supported Agriculture (CSA)
• Learn what's in season in your area
• Benefits: Fresher food, supports local economy, reduces transport emissions

**Reduce Food Waste:**
• Plan meals and make shopping lists
• Store food properly to extend freshness
• Use leftovers creatively
• Compost unavoidable scraps
• Facts: 30-40% of food is wasted globally

**Sustainable Seafood:**
• Choose fish from sustainable fisheries
• Use seafood guides (Monterey Bay Aquarium)
• Vary species to reduce pressure on popular fish
• Consider farmed fish from responsible sources

**Packaging Considerations:**
• Bring reusable bags and containers
• Choose loose produce over packaged
• Buy in bulk when possible
• Avoid single-use packaging

**Water-Conscious Choices:**
• Some foods require more water to produce
• Almonds: 1 gallon water per nut
• Beef: 1,800 gallons per pound
• Tomatoes: 3.3 gallons per tomato
• Consider water footprint in dry regions

**Easy Swaps:**
• Beef → Chicken, fish, or plant protein
• Imported produce → Local alternatives  
• Bottled water → Filtered tap water
• Processed foods → Whole foods
• Disposable containers → Reusable ones`
      },
      {
        id: "eco-friendly-home",
        title: "Creating an Eco-Friendly Home",
        type: "infographic",
        duration: "Room-by-room guide",
        description: "Transform your living space with sustainable practices and products.",
        content: `**Kitchen:**
🍽️ Use reusable containers instead of plastic wrap
🧽 Switch to compostable sponges and towels
♻️ Set up recycling and compost stations
💡 Install LED lighting and energy-efficient appliances
🚰 Use water-saving devices and fix leaks promptly

**Bathroom:**
🚿 Install low-flow showerheads (save 2,700 gallons/year)
🚽 Use dual-flush toilets or displacement devices
🧴 Choose refillable containers and bars over bottles
🌿 Use organic, biodegradable personal care products
💧 Fix dripping faucets (saves 3,000 gallons/year)

**Living Room:**
🌡️ Use programmable thermostat (save 10% on heating/cooling)
📺 Unplug electronics when not in use
🕯️ Choose soy or beeswax candles over paraffin
🪴 Add houseplants for natural air purification
🧹 Use non-toxic cleaning products

**Bedroom:**
🛏️ Choose organic cotton or bamboo bedding
👕 Buy sustainable clothing and donate unused items
🌙 Use blackout curtains for better insulation
📱 Create charging stations to reduce phantom loads
🌸 Use essential oils instead of synthetic fragrances

**Laundry:**
🧺 Wash in cold water (saves 90% of energy used)
☀️ Air dry clothes when possible
🧴 Use eco-friendly detergents
👕 Wash full loads to maximize efficiency
🔧 Clean dryer vents for optimal performance

**Garden/Outdoor:**
🌱 Plant native species that require less water
🌧️ Collect rainwater for irrigation
🐝 Create pollinator-friendly spaces
♻️ Compost yard waste and kitchen scraps
🌿 Use organic pest control methods

**Energy & Water:**
⚡ Switch to renewable energy provider
💡 Replace all bulbs with LEDs
🌡️ Seal air leaks with weatherstripping
🚰 Install water-efficient fixtures
📊 Monitor usage with smart meters`
      }
    ]
  }
};

export function LearningMaterials({ topic }: LearningMaterialsProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null);

  const learningTopic = LEARNING_TOPICS[topic];

  if (!learningTopic) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Learning materials not available for this topic.</p>
      </div>
    );
  }

  const toggleSection = (materialId: string) => {
    setExpandedSections(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article": return <FileText className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "infographic": return <BookOpen className="w-4 h-4" />;
      case "external": return <ExternalLink className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article": return "bg-blue-100 text-blue-800";
      case "video": return "bg-red-100 text-red-800";
      case "infographic": return "bg-green-100 text-green-800";
      case "external": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedMaterial) {
    return (
      <div className="p-4">
        <button 
          onClick={() => setSelectedMaterial(null)}
          className="flex items-center gap-2 text-[#2ECC71] mb-4 hover:text-[#27AE60]"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to materials
        </button>
        
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className={`p-2 rounded-lg ${getTypeColor(selectedMaterial.type)}`}>
              {getTypeIcon(selectedMaterial.type)}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg mb-1">{selectedMaterial.title}</h2>
              <p className="text-gray-600 text-sm mb-2">{selectedMaterial.description}</p>
              {selectedMaterial.duration && (
                <span className="text-xs text-gray-500">{selectedMaterial.duration}</span>
              )}
            </div>
          </div>
          
          {selectedMaterial.content && (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-gray-700">
                {selectedMaterial.content}
              </div>
            </div>
          )}
          
          {selectedMaterial.url && (
            <a 
              href={selectedMaterial.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open External Link
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{learningTopic.title}</h2>
        <p className="text-gray-600">{learningTopic.description}</p>
      </div>
      
      <div className="space-y-3">
        {learningTopic.materials.map((material) => (
          <div key={material.id} className="bg-white rounded-xl border border-gray-100">
            <button
              onClick={() => material.content ? toggleSection(material.id) : setSelectedMaterial(material)}
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                {getTypeIcon(material.type)}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium mb-1">{material.title}</h3>
                <p className="text-gray-600 text-sm mb-1">{material.description}</p>
                {material.duration && (
                  <span className="text-xs text-gray-500">{material.duration}</span>
                )}
              </div>
              {material.content && (
                expandedSections.includes(material.id) 
                  ? <ChevronDown className="w-5 h-5 text-gray-400" />
                  : <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {material.content && expandedSections.includes(material.id) && (
              <div className="px-4 pb-4">
                <div className="pt-4 border-t border-gray-100">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line text-gray-700">
                      {material.content}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}