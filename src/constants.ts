// Canvas and image settings
export const CANVAS_OPACITY = 0.05;
export const CANVAS_MARGIN = 20; // px

// Arc visual settings
export const ARC_STROKE_WIDTH = 3; // px
export const ARC_GAP = 3; // px between arcs at same radius
export const CIRCLE_SPACING = 6; // px between concentric circles (stroke + gap)

// Arc generation settings
export const MIN_ARC_LENGTH = 0.1; // radians
export const MAX_ARC_LENGTH = 0.4; // radians
export const ARC_LENGTH_RANGE = MAX_ARC_LENGTH - MIN_ARC_LENGTH;

// Sampling settings
export const MIN_SAMPLES_PER_ARC = 10;
export const SAMPLES_PER_PIXEL = 5; // Higher = more samples for longer arcs

// Radius settings
export const STARTING_RADIUS = 6; // px
export const RADIUS_BUFFER = 10; // px beyond corner to ensure full coverage