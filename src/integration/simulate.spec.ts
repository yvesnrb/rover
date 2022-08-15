import { SimulateCommand } from "@commands/simulate.command";
import { readFileSync } from "fs";
import { container } from "../container";

const log = jest.spyOn(console, "log").mockImplementation(() => undefined);

describe("Simulate Command Integration Test", () => {
  beforeEach(() => {
    container.dispose();
    log.mockClear();
  });

  it("should log the result of a successful simulation", () => {
    const simulateCommand =
      container.resolve<SimulateCommand>("simulateCommand");
    const exitStatus = simulateCommand.execute("src/fixtures/ok-input-one.txt");
    const expectedOutput = readFileSync(
      "src/fixtures/ok-output-one.txt"
    ).toString();

    expect(log).toHaveBeenCalledWith(expectedOutput);
    expect(exitStatus).toStrictEqual(0);
  });

  it("should log an error message for an invalid file", () => {
    const simulateCommand =
      container.resolve<SimulateCommand>("simulateCommand");
    const exitStatus = simulateCommand.execute(
      "src/fixtures/malformed-input-one.txt"
    );

    expect(log).toHaveBeenCalledWith(
      "simulation error!\nparsing failure: invalid bounds"
    );
    expect(exitStatus).toStrictEqual(1);
  });

  it("should log an error message for an out of bounds rover", () => {
    const simulateCommand =
      container.resolve<SimulateCommand>("simulateCommand");
    const exitStatus = simulateCommand.execute(
      "src/fixtures/oob-input-one.txt"
    );

    expect(log).toHaveBeenCalledWith("simulation error!\nout of bounds");
    expect(exitStatus).toStrictEqual(1);
  });

  it("should log an error message for a collision", () => {
    const simulateCommand =
      container.resolve<SimulateCommand>("simulateCommand");
    const exitStatus = simulateCommand.execute(
      "src/fixtures/collision-input-one.txt"
    );

    expect(log).toHaveBeenCalledWith("simulation error!\ncollision");
    expect(exitStatus).toStrictEqual(1);
  });
});
