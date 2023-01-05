import React from 'react';
import PropTypes from 'prop-types';

export default function Canvas(props) {
  const { draw, height, width } = props;
  const canvas = React.useRef();
  React.useEffect(() => {
    const context = canvas.current.getContext('2d');
    draw(context);
  });

  return <canvas ref={canvas} height={height} width={width} />;
}

Canvas.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  draw: PropTypes.func.isRequired,
};
