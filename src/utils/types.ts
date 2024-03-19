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
