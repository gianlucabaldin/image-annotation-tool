import { IShape, SHAPE_TYPES } from "./types";

/**
 * Draws a rectangle on the canvas context with the specified color and style.
 *
 * @param {IShape} shape - the coordinates of the rectangle
 * @param {CanvasRenderingContext2D} ctx - the canvas context to draw on
 * @param {string} [color="blue"] - the color of the rectangle outline
 * @param {boolean} [dashed=false] - whether the outline should be dashed (when drawing)
 */
export const drawShape = (
  shape: IShape,
  ctx: CanvasRenderingContext2D,
  shapeType: SHAPE_TYPES = SHAPE_TYPES.RECTANGLE,
  color: string = "blue",
  dashed: boolean = false
) => {
  const { firstClickX, firstClickY, endX, endY } = shape;
  if (!firstClickX || !firstClickY || !endX || !endY) return;
  const width = endX - firstClickX;
  const height = endY - firstClickY;
  ctx.strokeStyle = color;
  if (dashed) {
    ctx.setLineDash([5, 5]);
  }
  if (shapeType === SHAPE_TYPES.RECTANGLE) {
    ctx.strokeRect(firstClickX, firstClickY, width, height);
  } else {
    const centerX = (firstClickX + endX) / 2;
    const centerY = (firstClickY + endY) / 2;
    const raggio = Math.sqrt(
      (firstClickX - centerX) ** 2 + (firstClickY - centerY) ** 2
    );
    // Disegna il cerchio
    ctx.beginPath();
    ctx.arc(centerX, centerY, raggio, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.setLineDash([]);
};
