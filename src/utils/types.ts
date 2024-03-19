export enum ACTION_TYPES {
  DRAW_RECTANGLE = "DRAW_RECTANGLE",
  DRAW_CIRCLE = "DRAW_CIRCLE",
  SELECT = "SELECT",
}

export interface IRectangle {
  startX?: number | null;
  startY?: number | null;
  endX?: number | null;
  endY?: number | null;
}

export interface ICircle {
  centerX?: number | null;
  centerY?: number | null;
  radius?: number | null;
}
