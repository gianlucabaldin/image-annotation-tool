import { IRectangle } from "./types";

export const drawRectangle = (
  // startX: number,
  // startY: number,
  // endX: number,
  // endY: number,
  rectangle: IRectangle,
  ctx: CanvasRenderingContext2D,
  isDrawing: boolean = false
) => {
  const { startX, startY, endX, endY } = rectangle;
  if (!startX || !startY || !endX || !endY) return;
  const width = endX - startX;
  const height = endY - startY;
  //   ctx.strokeStyle = isDrawing ? "blue" : "red";
  ctx.strokeStyle = "red";
  ctx.strokeRect(startX, startY, width, height);
};
