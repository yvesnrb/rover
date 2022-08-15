import { Command } from "@entities/command.entity";
import { ParsedFile } from "@entities/parsed-file.entity";
import { Position } from "@entities/position.entity";
import { ParserProvider } from "@providers/parser.provider";
import { BuildResolverOptions, Lifetime, RESOLVER } from "awilix";

export class NodeParserProvider implements ParserProvider {
  static [RESOLVER]: BuildResolverOptions<ParserProvider> = {
    name: "nodeParserProvider",
    lifetime: Lifetime.SINGLETON,
  };

  /**
   * Parse the bounds from an array of raw file lines.
   *
   * @param lines - Array of raw file lines.
   * @returns Object containing the coordinates of the bounds.
   *
   * @throws Error("parsing failure: invalid bounds")
   * Thrown if the bounds are not numbers.
   */
  #parseBounds(lines: string[]): ParsedFile["bounds"] {
    const coordinates = lines[0].split(" ");
    const x = Number(coordinates[0]);
    const y = Number(coordinates[1]);

    if (isNaN(x) || isNaN(y))
      throw new Error("parsing failure: invalid bounds");
    return { x, y };
  }

  /**
   * Parse a position line.
   *
   * @param line - The line to parse.
   * @returns A parsed Position object.
   *
   * @throws Error("parsing failure: invalid rover position")
   * Thrown if the position section of the line is invalid.
   *
   * @throws Error("parsing failure: invalid rover heading")
   * Thrown if the heading section of the line is invalid.
   */
  #parsePosition(line: string): Position {
    const lineArray = line.split(" ");
    const x = Number(lineArray[0]);
    const y = Number(lineArray[1]);
    const heading = lineArray[2];

    if (isNaN(x) || isNaN(y))
      throw new Error("parsing failure: invalid rover position");

    if (
      heading !== "N" &&
      heading !== "S" &&
      heading !== "E" &&
      heading !== "W"
    )
      throw new Error("parsing failure: invalid rover heading");

    return { x, y, heading };
  }

  /**
   * Parse a commands line.
   *
   * @param line - The line to parse.
   * @returns Array of Command strings.
   *
   * @throws Error("parsing failure: invalid command")
   * Thrown if an invalid command is on this line.
   */
  #parseCommands(line: string): Command[] {
    const commands = line.split("");

    commands.forEach((c) => {
      if (c !== "L" && c !== "R" && c !== "M")
        throw new Error("parsing failure: invalid command");
    });

    return commands as Command[];
  }

  /**
   * Parse the position-command pairs from an array of raw file lines.
   *
   * @param lines - Array of raw file lines.
   * @returns - Array of objects containing each rover's initial
   * position and its commands.
   *
   * @throws Error("parsing failure: unmatched position-command pair")
   * Thrown if the position-command section is odd numbered.
   */
  #parseRovers(lines: string[]): ParsedFile["rovers"] {
    const roverLines = lines.splice(1, lines.length - 2);
    const roverPairs: [string, string][] = [];

    if (roverLines.length % 2 !== 0)
      throw new Error("parsing failure: unmatched position-command pair");

    for (let i = 0; i < roverLines.length; i += 2) {
      roverPairs.push([roverLines[i], roverLines[i + 1]]);
    }

    return roverPairs.map((p) => ({
      initialPosition: this.#parsePosition(p[0]),
      commands: this.#parseCommands(p[1]),
    }));
  }

  parse(raw: string): ParsedFile {
    const lines = raw.split("\n");
    const bounds = this.#parseBounds(lines);
    const rovers = this.#parseRovers(lines);

    return { bounds, rovers: rovers };
  }
}
