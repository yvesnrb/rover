import { Position } from "@entities/position.entity";

/**
 * Provider for serializing objects into a string that matches this
 * project's spec.
 */
export interface SerializerProvider {
  serialize(positions: Position[]): string;
}
