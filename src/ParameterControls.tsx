import React from 'react';

export interface ParameterValues {
  canvasOpacity: number;
  arcStrokeWidth: number;
  arcGap: number;
  circleSpacing: number;
  minArcLength: number;
  maxArcLength: number;
  startingRadius: number;
}

interface ParameterControlsProps {
  parameters: ParameterValues;
  onParameterChange: (parameter: keyof ParameterValues, value: number) => void;
}

const ParameterControls: React.FC<ParameterControlsProps> = ({
  parameters,
  onParameterChange,
}) => {
  const controlsConfig = [
    {
      key: 'canvasOpacity' as keyof ParameterValues,
      label: 'Canvas Opacity',
      min: 0.01,
      max: 1.0,
      step: 0.01,
    },
    {
      key: 'arcStrokeWidth' as keyof ParameterValues,
      label: 'Arc Thickness',
      min: 1,
      max: 10,
      step: 0.5,
    },
    {
      key: 'arcGap' as keyof ParameterValues,
      label: 'Arc Gap',
      min: 0,
      max: 20,
      step: 0.5,
    },
    {
      key: 'circleSpacing' as keyof ParameterValues,
      label: 'Circle Spacing',
      min: 1,
      max: 20,
      step: 1,
    },
    {
      key: 'minArcLength' as keyof ParameterValues,
      label: 'Min Arc Length',
      min: 0.05,
      max: 1.0,
      step: 0.05,
    },
    {
      key: 'maxArcLength' as keyof ParameterValues,
      label: 'Max Arc Length',
      min: 0.1,
      max: 2.0,
      step: 0.05,
    },
    {
      key: 'startingRadius' as keyof ParameterValues,
      label: 'Starting Radius',
      min: 3,
      max: 20,
      step: 1,
    },
  ];

  return (
    <div className="parameter-controls">
      <div className="controls-grid">
        {controlsConfig.map((control) => (
          <div key={control.key} className="control-item">
            <label className="control-label">
              {control.label}: {parameters[control.key].toFixed(2)}
            </label>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={parameters[control.key]}
              onChange={(e) =>
                onParameterChange(control.key, parseFloat(e.target.value))
              }
              className="control-slider"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParameterControls;
