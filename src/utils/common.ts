import { IShape, SHAPE_COLORS, SHAPE_TYPES } from "./types";

/**
 * Draws a shape on the canvas based on the provided shape data, using the given rendering context and shape type.
 *
 * @param {IShape} shape - the shape object containing the coordinates and other details of the shape
 * @param {CanvasRenderingContext2D} ctx - the 2D rendering context for the canvas
 * @param {SHAPE_TYPES} [shapeType=SHAPE_TYPES.RECTANGLE] - the type of shape to be drawn (default: rectangle)
 * @param {boolean} [dashed=false] - a boolean indicating if the shape should be drawn as dashed lines (default: false)
 */
export const drawShape = (
  shape: IShape,
  ctx: CanvasRenderingContext2D,
  shapeType: SHAPE_TYPES = SHAPE_TYPES.RECTANGLE,
  dashed: boolean = false
) => {
  const { firstClickX, firstClickY, endX, endY } = shape;
  if (!firstClickX || !firstClickY || !endX || !endY) return;
  const width = endX - firstClickX;
  const height = endY - firstClickY;
  if (dashed) {
    ctx.setLineDash([5, 5]);
  }
  if (shapeType === SHAPE_TYPES.RECTANGLE) {
    ctx.strokeStyle = SHAPE_COLORS.RECTANGLE;
    ctx.strokeRect(firstClickX, firstClickY, width, height);
  } else {
    const centerX = (firstClickX + endX) / 2;
    const centerY = (firstClickY + endY) / 2;
    const raggio = Math.sqrt(
      (firstClickX - centerX) ** 2 + (firstClickY - centerY) ** 2
    );
    ctx.strokeStyle = SHAPE_COLORS.CIRCLE;
    ctx.beginPath();
    ctx.arc(centerX, centerY, raggio, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.setLineDash([]);
};
