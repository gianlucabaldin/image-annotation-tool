import {
  getAnnotationCenterPoint,
  getAnnotationWidthAndHeight,
  isPointInRectangle,
  isPointInsideCircle,
} from "./draw";
import { SHAPE_TYPES } from "./types";

describe("getAnnotationCenterPoint", () => {
  it("should return the correct center point for a rectangle annotation", () => {
    const annotation = {
      type: SHAPE_TYPES.RECTANGLE,
      firstClickX: 10,
      firstClickY: 20,
      secondClickX: 50,
      secondClickY: 40,
    };

    const centerPoint = getAnnotationCenterPoint(annotation);

    expect(centerPoint).toEqual({ x: 30, y: 30 });
  });

  it("should return undefined if any of the coordinates are missing", () => {
    const annotation = {
      type: SHAPE_TYPES.RECTANGLE,
      firstClickX: 10,
      firstClickY: 20,
      // Missing secondClickX and secondClickY
    };

    const centerPoint = getAnnotationCenterPoint(annotation);

    expect(centerPoint).toBeUndefined();
  });
});

describe("getAnnotationWidthAndHeight", () => {
  it("should return the correct width and height for a rectangle annotation", () => {
    const annotation = {
      type: SHAPE_TYPES.RECTANGLE,
      firstClickX: 10,
      firstClickY: 20,
      secondClickX: 50,
      secondClickY: 40,
    };

    const coordinates = getAnnotationWidthAndHeight(annotation);
    const { width, height } = coordinates!;

    expect(width).toEqual(40);
    expect(height).toEqual(20);
  });

  it("should return undefined if any of the coordinates are missing", () => {
    const annotation = {
      type: SHAPE_TYPES.RECTANGLE,
      firstClickX: 10,
      firstClickY: 20,
      // Missing secondClickX and secondClickY
    };

    const result = getAnnotationWidthAndHeight(annotation);

    expect(result).toBeUndefined();
  });
});

describe("isPointInRectangle", () => {
  it("should return true if the point is inside the rectangle", () => {
    const annotation = {
      type: SHAPE_TYPES.RECTANGLE,
      firstClickX: 10,
      firstClickY: 10,
      secondClickX: 50,
      secondClickY: 50,
    };
    const pointInside = isPointInRectangle(30, 30, annotation);
    expect(pointInside).toBeTruthy();
  });

  it("should return false if the point is outside the rectangle", () => {
    const annotation = {
      type: SHAPE_TYPES.RECTANGLE,
      firstClickX: 10,
      firstClickY: 10,
      secondClickX: 50,
      secondClickY: 50,
    };
    const pointOutside = isPointInRectangle(60, 60, annotation);
    expect(pointOutside).toBeFalsy();
  });

  it("should return false if the rectangle annotation is not valid", () => {
    const annotation = {
      type: SHAPE_TYPES.RECTANGLE,
      firstClickX: 10,
      firstClickY: 10,
      // Missing secondClickX e secondClickY
    };
    const pointInside = isPointInRectangle(30, 30, annotation);
    expect(pointInside).toBeFalsy();
  });
});

describe("isPointInsideCircle", () => {
  it("should return true if the point is inside the circle", () => {
    const centerX = 50;
    const centerY = 50;
    const radius = 30;
    const pointInside = isPointInsideCircle(40, 40, centerX, centerY, radius);
    expect(pointInside).toBeTruthy();
  });

  it("should return false if the point is outside the circle", () => {
    const centerX = 50;
    const centerY = 50;
    const radius = 30;
    const pointOutside = isPointInsideCircle(80, 80, centerX, centerY, radius);
    expect(pointOutside).toBeFalsy();
  });
});
