export default function CSSTestPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="bg-white border rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">CSS Compilation Test</h1>
          <p className="mb-4">This page tests if our CSS classes are being compiled correctly.</p>
        </div>

        {/* Hardcoded theme class test */}
        <div className="gmc-forest-light">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Hardcoded gmc-forest-light class</h2>
            <div className="space-y-3">
              <div className="h-12 bg-primary text-primary-foreground rounded flex items-center px-4">
                Primary in Forest Light theme
              </div>
              <div className="h-12 bg-[hsl(var(--primary))] text-white rounded flex items-center px-4">
                Direct HSL var(--primary)
              </div>
              <div className="h-12 bg-[#2d4a3a] text-white rounded flex items-center px-4">
                Hardcoded #2d4a3a (forest green)
              </div>
            </div>
          </div>
        </div>

        {/* Test GMC color classes */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">GMC Color Classes</h2>
          <div className="space-y-3">
            <div className="h-12 bg-gmc-forest-600 text-white rounded flex items-center px-4">
              bg-gmc-forest-600
            </div>
            <div className="h-12 bg-gmc-ocean-500 text-white rounded flex items-center px-4">
              bg-gmc-ocean-500  
            </div>
            <div className="h-12 bg-gmc-earth-600 text-white rounded flex items-center px-4">
              bg-gmc-earth-600
            </div>
            <div className="h-12 bg-gmc-sunset-500 text-white rounded flex items-center px-4">
              bg-gmc-sunset-500
            </div>
          </div>
        </div>

        {/* Test standard Tailwind colors for comparison */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Standard Tailwind Colors (for comparison)</h2>
          <div className="space-y-3">
            <div className="h-12 bg-green-600 text-white rounded flex items-center px-4">
              bg-green-600 (should work)
            </div>
            <div className="h-12 bg-blue-500 text-white rounded flex items-center px-4">
              bg-blue-500 (should work)
            </div>
            <div className="h-12 bg-amber-600 text-white rounded flex items-center px-4">
              bg-amber-600 (should work)
            </div>
            <div className="h-12 bg-orange-500 text-white rounded flex items-center px-4">
              bg-orange-500 (should work)
            </div>
          </div>
        </div>

        {/* Inline styles for absolute confirmation */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Inline Styles (should always work)</h2>
          <div className="space-y-3">
            <div 
              className="h-12 text-white rounded flex items-center px-4"
              style={{ backgroundColor: '#2d4a3a' }}
            >
              Inline Forest Green #2d4a3a
            </div>
            <div 
              className="h-12 text-white rounded flex items-center px-4"
              style={{ backgroundColor: '#0ea5e9' }}
            >
              Inline Ocean Blue #0ea5e9
            </div>
            <div 
              className="h-12 text-white rounded flex items-center px-4"
              style={{ backgroundColor: '#a16207' }}
            >
              Inline Earth Brown #a16207
            </div>
            <div 
              className="h-12 text-white rounded flex items-center px-4"
              style={{ backgroundColor: '#f97316' }}
            >
              Inline Sunset Orange #f97316
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}