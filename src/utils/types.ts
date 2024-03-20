export enum ACTION_TYPES {
  DRAW_RECTANGLE = "DRAW_RECTANGLE",
  DRAW_CIRCLE = "DRAW_CIRCLE",
  SELECT = "SELECT",
}

export enum SHAPE_TYPES {
  RECTANGLE,
  CIRCLE,
}

export enum SHAPE_COLORS {
  RECTANGLE = "blue",
  CIRCLE = "green",
}

export interface IAnnotation {
  firstClickX?: number | null;
  firstClickY?: number | null;
  endX?: number | null;
  endY?: number | null;
  type?: SHAPE_TYPES;
  label?: string;
}
