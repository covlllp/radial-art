import React, { useState, useEffect } from 'react';
import ImageCanvas from './ImageCanvas';
import './styles.css';

const ImageCanvasContainer: React.FC = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageData, setImageData] = useState<ImageData | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCanvasData = (data: ImageData) => {
    setImageData(data);
  };

  return (
    <div className="image-canvas-container">
      <ImageCanvas
        imageSrc="/img/Chromecast%20Image.jpg"
        windowSize={windowSize}
        onImageLoad={handleImageLoad}
        onCanvasData={handleCanvasData}
      />
    </div>
  );
};

export default ImageCanvasContainer;