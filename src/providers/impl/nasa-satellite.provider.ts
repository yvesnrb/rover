import { Command } from "@entities/command.entity";
import { Heading } from "@entities/heading.entity";
import { Position } from "@entities/position.entity";
import { SatelliteProvider } from "@providers/satellite.provider";
import { BuildResolverOptions, Lifetime, RESOLVER } from "awilix";

export class NasaSatelliteProvider implements SatelliteProvider {
  static [RESOLVER]: BuildResolverOptions<SatelliteProvider> = {
    name: "nasaSatelliteProvider",
    lifetime: Lifetime.SINGLETON,
  };

  /**
   * Record representing currently open connections and their
   * positions.
   */
  #connections: Record<string, Position> = {};

  /**
   * Object representing the current upper right bounds of the rover
   * area.
   */
  #bounds: { x: number; y: number } = { x: 0, y: 0 };

  /**
   * Verify that a position is out of bounds.
   *
   * @param position - Position to verify
   * @returns True if the position is out of bounds, false otherwise.
   */
  #isOutOfBounds(position: Position): boolean {
    if (
      position.x > this.#bounds.x ||
      position.x < 0 ||
      position.y > this.#bounds.y ||
      position.y < 0
    )
      return true;
    return false;
  }

  /**
   * Verify if any rovers have collided.
   *
   * @returns True if any hovers have collided, false otherwise.
   */
  #isColliding(): boolean {
    const positions = Object.values(this.#connections);
    const stringPositions = positions.map((p) =>
      JSON.stringify({ x: p.x, y: p.y })
    );

    return new Set(stringPositions).size < stringPositions.length;
  }

  /**
   * Process a movement command.
   *
   * @param current - Current position to process.
   * @returns The updated position after the movement.
   */
  #move(current: Position): Position {
    switch (current.heading) {
      case "N":
        return { ...current, y: current.y + 1 };
      case "S":
        return { ...current, y: current.y - 1 };
      case "E":
        return { ...current, x: current.x + 1 };
      case "W":
        return { ...current, x: current.x - 1 };
    }
  }

  /**
   * Process a rotation command.
   *
   * @param current - Current position to process.
   * @param direction - Direction to rotate in.
   * @returns The updated position after the rotation.
   */
  #rotate(current: Position, direction: "L" | "R"): Position {
    const wrapIndex = (i: number) => ((i % 4) + 4) % 4;
    const headings: Heading[] = ["N", "E", "S", "W"];
    const currentHeadingIndex = headings.findIndex(
      (h) => h === current.heading
    );

    switch (direction) {
      case "L":
        return {
          ...current,
          heading: headings[wrapIndex(currentHeadingIndex - 1)],
        };
      case "R":
        return {
          ...current,
          heading: headings[wrapIndex(currentHeadingIndex + 1)],
        };
    }
  }

  setBounds(x: number, y: number): void {
    this.#bounds = { x, y };
  }

  connect(name: string, initialPosition: Position): void {
    if (this.#connections[name]) throw new Error("duplicate");
    if (this.#isOutOfBounds(initialPosition)) throw new Error("out of bounds");

    this.#connections[name] = initialPosition;
    if (this.#isColliding()) throw new Error("collision");
  }

  sendCommand(rover: string, command: Command): void {
    const currentPosition = this.#connections[rover];
    let updatedPosition: Position;

    if (!currentPosition) throw new Error("no connection");

    switch (command) {
      case "L":
        updatedPosition = this.#rotate(currentPosition, "L");
        break;
      case "R":
        updatedPosition = this.#rotate(currentPosition, "R");
        break;
      case "M":
        updatedPosition = this.#move(currentPosition);
        break;
    }

    if (this.#isOutOfBounds(updatedPosition)) throw new Error("out of bounds");

    this.#connections[rover] = updatedPosition;
    if (this.#isColliding()) throw new Error("collision");
  }

  report(): Record<string, Position> {
    return this.#connections;
  }
}
