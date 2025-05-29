import React, { useRef, useEffect } from 'react';

interface ImageCanvasProps {
  imageSrc: string;
  windowSize: { width: number; height: number };
  onImageLoad: () => void;
  onCanvasData: (data: ImageData) => void;
  onCanvasSize: (size: { width: number; height: number }) => void;
  onCanvasClick: (x: number, y: number) => void;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({
  imageSrc,
  windowSize,
  onImageLoad,
  onCanvasData,
  onCanvasSize,
  onCanvasClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleImageLoad = () => {
      if (!canvas || !image || !ctx) return;

      const { naturalWidth, naturalHeight } = image;
      const { width: windowWidth, height: windowHeight } = windowSize;

      // Calculate scaling to fit window while maintaining aspect ratio
      const scale = Math.min(
        windowWidth / naturalWidth,
        windowHeight / naturalHeight,
      );
      const scaledWidth = naturalWidth * scale;
      const scaledHeight = naturalHeight * scale;

      // Set canvas size
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      // Draw image scaled to fit
      ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

      // Get image data for pixel information
      const imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);
      onCanvasData(imageData);
      onCanvasSize({ width: scaledWidth, height: scaledHeight });
      onImageLoad();
    };

    image.addEventListener('load', handleImageLoad);

    // Trigger load if image is already loaded
    if (image.complete) {
      handleImageLoad();
    }

    return () => {
      image.removeEventListener('load', handleImageLoad);
    };
  }, [imageSrc, windowSize, onImageLoad, onCanvasData, onCanvasSize]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    onCanvasClick(x, y);
  };

  return (
    <>
      <img
        ref={imageRef}
        src={imageSrc}
        style={{ display: 'none' }}
        alt="Source for canvas"
      />
      <canvas
        ref={canvasRef}
        className="image-canvas"
        onClick={handleCanvasClick}
        style={{ cursor: 'crosshair' }}
      />
    </>
  );
};

export default ImageCanvas;
