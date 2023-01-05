import React from 'react';
import Canvas from '../components/canvas';
import img from '../images/me.jpg';

export default function ImageLoader() {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [canvasWidth, setCanvasWidth] = React.useState(0);
  const [canvasHeight, setCanvasHeight] = React.useState(0);
  const image = React.useRef();

  const onImageLoad = () => {
    setImageLoaded(true);
    const { naturalHeight, naturalWidth } = image.current;
    setCanvasWidth(naturalWidth);
    setCanvasHeight(naturalHeight);
  };
  const draw = (context) => {
    context.drawImage(image.current, 0, 0);
    const data = context.getImageData(0, 0, canvasWidth, canvasHeight);
    console.log(data);
  };

  return (
    <div>
      <img ref={image} src={img} onLoad={onImageLoad} />
      {imageLoaded ? (
        <Canvas height={canvasHeight} width={canvasWidth} draw={draw} />
      ) : null}
    </div>
  );
}
