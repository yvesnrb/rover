import { ParserProvider } from "@providers/parser.provider";
import { readFileSync } from "fs";
import { NodeParserProvider } from "./node-parser.provider";

const okInputOne = readFileSync("./src/fixtures/ok-input-one.txt").toString();
const malformedInputOne = readFileSync(
  "./src/fixtures/malformed-input-one.txt"
).toString();
const malformedInputTwo = readFileSync(
  "./src/fixtures/malformed-input-two.txt"
).toString();
const malformedInputThree = readFileSync(
  "./src/fixtures/malformed-input-three.txt"
).toString();
const malformedInputFour = readFileSync(
  "./src/fixtures/malformed-input-four.txt"
).toString();
const malformedInputFive = readFileSync(
  "./src/fixtures/malformed-input-five.txt"
).toString();

const nodeParserProvider: ParserProvider = new NodeParserProvider();

describe("Node Parser Provider", () => {
  it("should parse the bounds", () => {
    const parsedFile = nodeParserProvider.parse(okInputOne);
    expect(parsedFile.bounds).toStrictEqual({ x: 5, y: 5 });
  });

  it("should parse the rovers", () => {
    const parsedFile = nodeParserProvider.parse(okInputOne);
    expect(parsedFile.rovers).toStrictEqual([
      {
        initialPosition: { heading: "N", x: 1, y: 2 },
        commands: ["L", "M", "L", "M", "L", "M", "L", "M", "M"],
      },
      {
        initialPosition: { heading: "E", x: 3, y: 3 },
        commands: ["M", "M", "R", "M", "M", "R", "M", "R", "R", "M"],
      },
    ]);
  });

  it("should throw on invalid bounds", () => {
    expect(() => {
      nodeParserProvider.parse(malformedInputOne);
    }).toThrow("parsing failure: invalid bounds");
  });

  it("should throw on invalid rover position", () => {
    expect(() => {
      nodeParserProvider.parse(malformedInputThree);
    }).toThrow("parsing failure: invalid rover position");
  });

  it("should throw on invalid rover heading", () => {
    expect(() => {
      nodeParserProvider.parse(malformedInputFour);
    }).toThrow("parsing failure: invalid rover heading");
  });

  it("should throw on invalid command", () => {
    expect(() => {
      nodeParserProvider.parse(malformedInputFive);
    }).toThrow("parsing failure: invalid command");
  });

  it("should throw if rover section has unmatched position-command pairs", () => {
    expect(() => {
      nodeParserProvider.parse(malformedInputTwo);
    }).toThrow("parsing failure: unmatched position-command pair");
  });
});
