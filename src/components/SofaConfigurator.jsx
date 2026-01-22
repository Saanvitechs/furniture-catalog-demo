import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SofaConfigurator({ productImage = null, onClose = null }) {
  const [selectedLeg, setSelectedLeg] = useState(1)
  const [selectedHue, setSelectedHue] = useState(0)
  const [showColorControls, setShowColorControls] = useState(false)

  // Get the sofa base image
  const baseSofaImage = productImage || '/sofabase/sofa_base.png'
  const colorLayerImage = '/sofabase/normalized_sofa_1.png'
  const legsImage = `/sofalegs/legs_variant_${selectedLeg}.png`

  // Leg variants available
  const legVariants = [1, 2, 3, 4, 5]

  // Color presets (hue values in degrees)
  const colorPresets = [
    { name: 'Original', hue: 0, saturation: 100, brightness: 100 },
    { name: 'Warm Brown', hue: 15, saturation: 80, brightness: 95 },
    { name: 'Cool Gray', hue: 0, saturation: 20, brightness: 85 },
    { name: 'Burgundy', hue: 340, saturation: 70, brightness: 90 },
    { name: 'Navy', hue: 220, saturation: 60, brightness: 75 },
    { name: 'Sage', hue: 95, saturation: 45, brightness: 80 },
  ]

  const currentColor = colorPresets[selectedHue]

  // Calculate CSS filter for color layer
  const getColorFilter = () => {
    const { hue, saturation, brightness } = colorPresets[selectedHue]
    return `hue-rotate(${hue}deg) saturate(${saturation}%) brightness(${brightness}%)`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Sofa Configurator</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Close"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Preview Section */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Preview</h3>
                
                {/* Sofa Image Container - Relative with Absolute Overlays */}
                <div className="relative w-full aspect-square max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
                  {/* Base Sofa Image */}
                  <img
                    src={baseSofaImage}
                    alt="Sofa Base"
                    className="absolute inset-0 w-full h-full object-contain"
                  />

                  {/* Color Layer (if color changed) */}
                  {selectedHue !== 0 && (
                    <img
                      src={colorLayerImage}
                      alt="Color Layer"
                      className="absolute inset-0 w-full h-full object-contain mix-blend-multiply pointer-events-none"
                      style={{
                        filter: getColorFilter(),
                      }}
                    />
                  )}

                  {/* Legs Image (Top Layer) */}
                  <img
                    src={legsImage}
                    alt={`Legs Variant ${selectedLeg}`}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                </div>
              </div>

              {/* Current Configuration Display */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600 font-medium">Legs Style:</span>
                  <span className="text-gray-900 ml-2">Variant {selectedLeg}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600 font-medium">Color:</span>
                  <span className="text-gray-900 ml-2">{currentColor.name}</span>
                </div>
              </div>
            </div>

            {/* Controls Section */}
            <div className="lg:col-span-1 space-y-6">
              {/* Legs Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Legs Variant</h3>
                <div className="space-y-2">
                  {legVariants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedLeg(variant)}
                      className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedLeg === variant
                          ? 'bg-[#B77466] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Variant {variant}
                    </button>
                  ))}
                </div>
              </div>

             

            
              {/* Reset Button */}
              <button
                onClick={() => {
                  setSelectedLeg(1)
                  setSelectedHue(0)
                  setShowColorControls(false)
                }}
                className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
              >
                Reset Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
