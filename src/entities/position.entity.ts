import { Heading } from "@entities/heading.entity";

/**
 * Entity representing the current positioning of a rover.
 */
export type Position = {
  x: number;
  y: number;
  heading: Heading;
};
