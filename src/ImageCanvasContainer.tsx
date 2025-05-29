import React, { useState, useEffect, useCallback } from 'react';
import ImageCanvas from './ImageCanvas';
import RadialSVGOverlay from './RadialSVGOverlay';
import ImageUpload from './ImageUpload';
import { CANVAS_OPACITY, CANVAS_MARGIN } from './constants';
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

  // Set CSS custom properties for dynamic styling
  useEffect(() => {
    document.documentElement.style.setProperty('--canvas-opacity', CANVAS_OPACITY.toString());
    document.documentElement.style.setProperty('--canvas-margin', `${CANVAS_MARGIN}px`);
  }, []);

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
  }, []);

  return (
    <div className="image-canvas-container">
      <div className="canvas-wrapper">
        <ImageCanvas
          imageSrc={imageSrc}
          windowSize={windowSize}
          onImageLoad={handleImageLoad}
          onCanvasData={handleCanvasData}
          onCanvasSize={handleCanvasSize}
        />
        {imageLoaded && (
          <RadialSVGOverlay canvasSize={canvasSize} imageData={imageData} />
        )}
      </div>
      <ImageUpload onImageSelect={handleImageSelect} />
    </div>
  );
};

export default ImageCanvasContainer;
