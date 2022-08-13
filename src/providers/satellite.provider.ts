import { Command } from "@entities/command.entity";
import { Position } from "@entities/position.entity";

/**
 * Provider for interacting with a remote satellite.
 */
export interface SatelliteProvider {
  /**
   * Set the upper right bounds of the movement grid.
   *
   * @param x - The x value of the coordinate.
   * @param y - The y value of the coordinate.
   */
  setBounds(x: number, y: number): void;
  /**
   * Connect to a rover.
   *
   * @param name - Arbitrary name for this connection.
   * @param initialPosition - Position this rover will start in.
   *
   * @throws Error("duplicate")
   * Thrown if there is already an active connection with this name.
   *
   * @throws Error("out of bounds")
   * Thrown if the initial position is out of bounds.
   *
   * @throws Error("collision")
   * Thrown if the initial position collides with an existing rover.
   */
  connect(name: string, initialPosition: Position): void;
  /**
   * Send a command to a connected rover.
   *
   * @param rover - The name of a connected rover.
   * @param command - Command to send to this rover.
   *
   * @throws Error("no connection")
   * Thrown if there is no registered connection for this rover.
   *
   * @throws Error("out of bounds")
   * Thrown if this command has caused the rover to move out of
   * bounds.
   *
   * @throws Error("collision")
   * Thrown if this command has caused a collision.
   */
  sendCommand(rover: string, command: Command): void;
  /**
   * Get a report of all connections.
   *
   * @returns A record where the key is a connection name and the
   * value is its current position.
   */
  report(): Record<string, Position>;
}
