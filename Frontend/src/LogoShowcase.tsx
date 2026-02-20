import { EcoAllyLogo } from "./components/EcoAllyLogo";

export default function LogoShowcase() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 max-w-md mx-auto">
      <div className="space-y-8">
        <h1 className="text-center text-gray-800 mb-8">EcoAlly Logo Variations</h1>
        
        {/* Different sizes */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm text-gray-600 mb-4">Small Size</h3>
            <EcoAllyLogo size="sm" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm text-gray-600 mb-4">Medium Size (Default)</h3>
            <EcoAllyLogo size="md" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm text-gray-600 mb-4">Large Size</h3>
            <EcoAllyLogo size="lg" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm text-gray-600 mb-4">Extra Large Size</h3>
            <EcoAllyLogo size="xl" />
          </div>
        </div>

        {/* On different backgrounds */}
        <div className="space-y-4">
          <div className="bg-[#2ECC71] p-6 rounded-2xl">
            <h3 className="text-sm text-white mb-4">On Green Background</h3>
            <EcoAllyLogo size="md" className="filter brightness-0 invert" />
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl">
            <h3 className="text-sm text-white mb-4">On Dark Background</h3>
            <EcoAllyLogo size="md" className="filter brightness-0 invert" />
          </div>
        </div>

        {/* Centered version */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-600 mb-6 text-center">Centered Logo</h3>
          <div className="flex justify-center">
            <EcoAllyLogo size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}