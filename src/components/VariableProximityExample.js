import React, { useRef } from 'react';
import VariableProximity from './VariableProximity';

const VariableProximityExample = () => {
  const containerRef = useRef(null);

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center min-h-screen bg-gray-50 p-8"
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-8">
          <VariableProximity
            label="Billionaire OS"
            fromFontVariationSettings="'wght' 400"
            toFontVariationSettings="'wght' 900"
            containerRef={containerRef}
            radius={100}
            falloff="exponential"
            className="cursor-pointer"
          />
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          <VariableProximity
            label="The AI Operating System"
            fromFontVariationSettings="'wght' 300"
            toFontVariationSettings="'wght' 700"
            containerRef={containerRef}
            radius={80}
            falloff="linear"
          />
        </p>
        <p className="text-lg text-gray-500">
          <VariableProximity
            label="for Wealth, Career & Growth"
            fromFontVariationSettings="'wght' 300"
            toFontVariationSettings="'wght' 600"
            containerRef={containerRef}
            radius={60}
            falloff="gaussian"
          />
        </p>
      </div>
    </div>
  );
};

export default VariableProximityExample;
