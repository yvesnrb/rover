import { ParsedFile } from "@entities/parsed-file.entity";

/**
 * Provider for parsing files.
 */
export interface ParserProvider {
  /**
   * Parse a raw string.
   *
   * @param raw - String representing a raw file.
   * @returns A ParsedFile entity.
   *
   * @throws Error("parsing failure: invalid bounds")
   * Thrown if the bounds section of the file is invalid.
   *
   * @throws Error("parsing failure: invalid rover position")
   * Thrown if a rover line has an invalid position.
   *
   * @throws Error("parsing failure: invalid rover heading")
   * Thrown if a rover line has an invalid heading.
   *
   * @throws Error("parsing failure: invalid command")
   * Thrown if a rover line has an invalid command.
   *
   * @throws Error("parsing failure: unmatched position-command pair")
   * Thrown if the rover section of the file has an odd number of
   * lines, indicating a rover without either a position or a command.
   */
  parse(raw: string): ParsedFile;
}
