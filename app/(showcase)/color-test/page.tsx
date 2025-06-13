export default function ColorTestPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">GMC Color Test</h1>
          <p className="text-gray-600 mb-6">Testing if our custom colors are working in Tailwind</p>
        </div>

        {/* GMC Forest Colors */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">GMC Forest Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-gmc-forest-50 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Forest 50</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-forest-200 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Forest 200</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-forest-400 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Forest 400</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-forest-600 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600 text-white">Forest 600</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-forest-800 rounded border border-gray-200"></div>
              <p className="text-sm text-white">Forest 800</p>
            </div>
          </div>
        </div>

        {/* GMC Ocean Colors */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">GMC Ocean Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-gmc-ocean-50 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Ocean 50</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-ocean-200 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Ocean 200</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-ocean-400 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Ocean 400</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-ocean-600 rounded border border-gray-200"></div>
              <p className="text-sm text-white">Ocean 600</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-ocean-800 rounded border border-gray-200"></div>
              <p className="text-sm text-white">Ocean 800</p>
            </div>
          </div>
        </div>

        {/* GMC Earth Colors */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">GMC Earth Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-gmc-earth-50 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Earth 50</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-earth-200 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Earth 200</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-earth-400 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Earth 400</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-earth-600 rounded border border-gray-200"></div>
              <p className="text-sm text-white">Earth 600</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-earth-800 rounded border border-gray-200"></div>
              <p className="text-sm text-white">Earth 800</p>
            </div>
          </div>
        </div>

        {/* GMC Sunset Colors */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">GMC Sunset Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-gmc-sunset-50 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Sunset 50</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-sunset-200 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Sunset 200</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-sunset-400 rounded border border-gray-200"></div>
              <p className="text-sm text-gray-600">Sunset 400</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-sunset-600 rounded border border-gray-200"></div>
              <p className="text-sm text-white">Sunset 600</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gmc-sunset-800 rounded border border-gray-200"></div>
              <p className="text-sm text-white">Sunset 800</p>
            </div>
          </div>
        </div>

        {/* Standard Tailwind for comparison */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Standard Tailwind (for comparison)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-green-600 rounded"></div>
              <p className="text-sm text-gray-600">Green 600</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-blue-500 rounded"></div>
              <p className="text-sm text-gray-600">Blue 500</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-amber-600 rounded"></div>
              <p className="text-sm text-gray-600">Amber 600</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-orange-500 rounded"></div>
              <p className="text-sm text-gray-600">Orange 500</p>
            </div>
          </div>
        </div>

        {/* Button Tests */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Button Color Tests</h2>
          <div className="space-x-4">
            <button className="px-6 py-3 bg-gmc-forest-600 text-white rounded-lg hover:bg-gmc-forest-700 transition-colors">
              Forest Button
            </button>
            <button className="px-6 py-3 bg-gmc-ocean-500 text-white rounded-lg hover:bg-gmc-ocean-600 transition-colors">
              Ocean Button
            </button>
            <button className="px-6 py-3 bg-gmc-earth-600 text-white rounded-lg hover:bg-gmc-earth-700 transition-colors">
              Earth Button
            </button>
            <button className="px-6 py-3 bg-gmc-sunset-500 text-white rounded-lg hover:bg-gmc-sunset-600 transition-colors">
              Sunset Button
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}