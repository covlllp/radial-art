import React, { useEffect, useState, useMemo } from 'react';
import { ParameterValues } from './ParameterControls';
import {
  MIN_SAMPLES_PER_ARC,
  SAMPLES_PER_PIXEL,
  RADIUS_BUFFER,
} from './constants';

interface RadialSVGOverlayProps {
  canvasSize: { width: number; height: number };
  imageData: ImageData | null;
  centerPoint?: { x: number; y: number };
  parameters: ParameterValues;
}

interface ArcSegment {
  radius: number;
  startAngle: number;
  endAngle: number;
  color: string;
}

const RadialSVGOverlay: React.FC<RadialSVGOverlayProps> = ({
  canvasSize,
  imageData,
  centerPoint,
  parameters,
}) => {
  const getAverageColorForArc = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ): string => {
    if (!imageData) return '#000000';

    let totalR = 0,
      totalG = 0,
      totalB = 0,
      sampleCount = 0;

    // Sample points along the arc
    const angleDiff = endAngle - startAngle;
    const samples = Math.max(
      MIN_SAMPLES_PER_ARC,
      Math.floor((angleDiff * radius) / SAMPLES_PER_PIXEL),
    ); // More samples for longer arcs

    for (let i = 0; i <= samples; i++) {
      const angle = startAngle + (angleDiff * i) / samples;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (x >= 0 && y >= 0 && x < imageData.width && y < imageData.height) {
        const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4;
        totalR += imageData.data[index];
        totalG += imageData.data[index + 1];
        totalB += imageData.data[index + 2];
        sampleCount++;
      }
    }

    if (sampleCount === 0) return '#000000';

    const avgR = Math.round(totalR / sampleCount);
    const avgG = Math.round(totalG / sampleCount);
    const avgB = Math.round(totalB / sampleCount);

    return `rgb(${avgR}, ${avgG}, ${avgB})`;
  };

  const arcSegments = useMemo(() => {
    if (!imageData || canvasSize.width === 0 || canvasSize.height === 0) {
      return [];
    }

    const centerX = centerPoint?.x ?? canvasSize.width / 2;
    const centerY = centerPoint?.y ?? canvasSize.height / 2;

    // Calculate distance to all four corners and use the maximum
    const topLeft = Math.sqrt(centerX * centerX + centerY * centerY);
    const topRight = Math.sqrt(
      (canvasSize.width - centerX) * (canvasSize.width - centerX) +
        centerY * centerY,
    );
    const bottomLeft = Math.sqrt(
      centerX * centerX +
        (canvasSize.height - centerY) * (canvasSize.height - centerY),
    );
    const bottomRight = Math.sqrt(
      (canvasSize.width - centerX) * (canvasSize.width - centerX) +
        (canvasSize.height - centerY) * (canvasSize.height - centerY),
    );

    const maxRadius =
      Math.max(topLeft, topRight, bottomLeft, bottomRight) + RADIUS_BUFFER;
    const segments: ArcSegment[] = [];

    // Generate concentric circles with spacing (stroke + gap)
    for (
      let radius = parameters.startingRadius;
      radius <= maxRadius;
      radius += parameters.circleSpacing
    ) {
      const startAngle = Math.random() * Math.PI * 2;
      const endAngle = startAngle + Math.PI * 2;
      let currentAngle = startAngle;

      // Generate random arc segments for this circle
      while (currentAngle < endAngle) {
        // Random arc length
        const arcLengthRange = parameters.maxArcLength - parameters.minArcLength;
        const arcLength = parameters.minArcLength + Math.random() * arcLengthRange;
        const segmentEndAngle = Math.min(currentAngle + arcLength, endAngle);

        const color = getAverageColorForArc(
          centerX,
          centerY,
          radius,
          currentAngle,
          segmentEndAngle,
        );

        segments.push({
          radius,
          startAngle: currentAngle,
          endAngle: segmentEndAngle,
          color,
        });

        // Add gap between segments (convert to radians based on radius)
        const gapInRadians = parameters.arcGap / radius;
        currentAngle = segmentEndAngle + gapInRadians;
      }
    }

    return segments;
  }, [imageData, canvasSize.width, canvasSize.height, centerPoint, parameters]);

  const createArcPath = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ): string => {
    const startX = centerX + Math.cos(startAngle) * radius;
    const startY = centerY + Math.sin(startAngle) * radius;
    const endX = centerX + Math.cos(endAngle) * radius;
    const endY = centerY + Math.sin(endAngle) * radius;

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  if (!imageData || canvasSize.width === 0 || canvasSize.height === 0) {
    return null;
  }

  const centerX = centerPoint?.x ?? canvasSize.width / 2;
  const centerY = centerPoint?.y ?? canvasSize.height / 2;

  return (
    <svg
      width={canvasSize.width}
      height={canvasSize.height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      {arcSegments.map((segment, index) => (
        <path
          key={index}
          d={createArcPath(
            centerX,
            centerY,
            segment.radius,
            segment.startAngle,
            segment.endAngle,
          )}
          stroke={segment.color}
          strokeWidth={parameters.arcStrokeWidth}
          fill="none"
        />
      ))}
    </svg>
  );
};

export default RadialSVGOverlay;
