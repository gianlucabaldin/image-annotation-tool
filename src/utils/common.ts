import { IRectangle } from "./types";

/**
 * Draws a rectangle on the canvas context with the specified color and style.
 *
 * @param {IRectangle} rectangle - the coordinates of the rectangle
 * @param {CanvasRenderingContext2D} ctx - the canvas context to draw on
 * @param {string} [color="blue"] - the color of the rectangle outline
 * @param {boolean} [dashed=false] - whether the outline should be dashed (when drawing)
 */
export const drawRectangle = (
  rectangle: IRectangle,
  ctx: CanvasRenderingContext2D,
  color: string = "blue",
  dashed: boolean = false
) => {
  const { startX, startY, endX, endY } = rectangle;
  if (!startX || !startY || !endX || !endY) return;
  const width = endX - startX;
  const height = endY - startY;
  ctx.strokeStyle = color;
  if (dashed) {
    ctx.setLineDash([5, 5]);
  }
  ctx.strokeRect(startX, startY, width, height);
  ctx.setLineDash([]);
};
