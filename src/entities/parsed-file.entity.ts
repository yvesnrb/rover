import { Command } from "./command.entity";
import { Position } from "./position.entity";

/**
 * Entity representing the result of a successful file parsing.
 */
export type ParsedFile = {
  /**
   * Coordinate pair of the upper bounds of the rover area.
   */
  bounds: { x: number; y: number };
  /**
   * Array of objects containing the initial position and the commands
   * for each rover.
   */
  rovers: { initialPosition: Position; commands: Command[] }[];
};
