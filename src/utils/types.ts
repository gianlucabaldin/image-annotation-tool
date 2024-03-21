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
  HOVERED = "yellow",
}

export interface IAnnotation {
  id?: string;
  firstClickX?: number | null;
  firstClickY?: number | null;
  seconcClickX?: number | null;
  seconcClickY?: number | null;
  type?: SHAPE_TYPES;
  label?: string;
}
