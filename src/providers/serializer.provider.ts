import { Position } from "@entities/position.entity";

/**
 * Provider for serializing objects into a string that matches this
 * project's spec.
 */
export interface SerializerProvider {
  /**
   * Serialize final rover positions.
   *
   * @param positions - An array of positions to serialize.
   * @returns Serialized string.
   */
  serialize(positions: Position[]): string;
}
