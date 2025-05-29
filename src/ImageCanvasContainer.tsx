import React, { useState, useEffect, useCallback } from 'react';
import ImageCanvas from './ImageCanvas';
import RadialSVGOverlay from './RadialSVGOverlay';
import ImageUpload from './ImageUpload';
import ParameterControls, { ParameterValues } from './ParameterControls';
import { CANVAS_MARGIN } from './constants';
import './styles.css';

const ImageCanvasContainer: React.FC = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [imageSrc, setImageSrc] = useState('/img/Chromecast%20Image.jpg');
  const [centerPoint, setCenterPoint] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const [parameters, setParameters] = useState<ParameterValues>({
    canvasOpacity: 0.05,
    arcStrokeWidth: 3,
    arcGap: 3,
    circleSpacing: 6,
    minArcLength: 0.1,
    maxArcLength: 0.4,
    startingRadius: 6,
  });

  // Set CSS custom properties for dynamic styling
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--canvas-opacity',
      parameters.canvasOpacity.toString(),
    );
    document.documentElement.style.setProperty(
      '--canvas-margin',
      `${CANVAS_MARGIN}px`,
    );
  }, [parameters.canvasOpacity]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleCanvasData = useCallback((data: ImageData) => {
    setImageData(data);
  }, []);

  const handleCanvasSize = useCallback(
    (size: { width: number; height: number }) => {
      setCanvasSize(size);
    },
    [],
  );

  const handleImageSelect = useCallback((newImageSrc: string) => {
    setImageSrc(newImageSrc);
    setImageLoaded(false);
    setImageData(null);
    setCanvasSize({ width: 0, height: 0 });
    setCenterPoint(undefined);
  }, []);

  const handleCanvasClick = useCallback((x: number, y: number) => {
    setCenterPoint({ x, y });
  }, []);

  const handleParameterChange = useCallback(
    (parameter: keyof ParameterValues, value: number) => {
      setParameters((prev) => ({ ...prev, [parameter]: value }));
    },
    [],
  );

  return (
    <div className="image-canvas-container">
      <div className="canvas-wrapper">
        <ImageCanvas
          imageSrc={imageSrc}
          windowSize={windowSize}
          onImageLoad={handleImageLoad}
          onCanvasData={handleCanvasData}
          onCanvasSize={handleCanvasSize}
          onCanvasClick={handleCanvasClick}
        />
        {imageLoaded && (
          <RadialSVGOverlay
            canvasSize={canvasSize}
            imageData={imageData}
            centerPoint={centerPoint}
            parameters={parameters}
          />
        )}
      </div>
      <div className="bottom-controls">
        <ImageUpload onImageSelect={handleImageSelect} />
        <ParameterControls
          parameters={parameters}
          onParameterChange={handleParameterChange}
        />
      </div>
    </div>
  );
};

export default ImageCanvasContainer;
