import { SatelliteProvider } from "@providers/satellite.provider";
import { NasaSatelliteProvider } from "./nasa-satellite.provider";

let nasaSatelliteProvider: SatelliteProvider;

describe("NASA Satellite Provider", () => {
  beforeEach(() => {
    nasaSatelliteProvider = new NasaSatelliteProvider();
    nasaSatelliteProvider.setBounds(10, 10);

    nasaSatelliteProvider.connect("rover 1", { heading: "N", x: 0, y: 0 });
    nasaSatelliteProvider.connect("rover 2", { heading: "W", x: 5, y: 5 });
    nasaSatelliteProvider.connect("rover 3", { heading: "S", x: 3, y: 2 });
    nasaSatelliteProvider.connect("rover 4", { heading: "E", x: 9, y: 9 });
  });

  it("should process a movement command", () => {
    nasaSatelliteProvider.sendCommand("rover 1", "M");
    nasaSatelliteProvider.sendCommand("rover 2", "M");
    nasaSatelliteProvider.sendCommand("rover 3", "M");
    nasaSatelliteProvider.sendCommand("rover 4", "M");

    expect(nasaSatelliteProvider.report()).toStrictEqual({
      "rover 1": { heading: "N", x: 0, y: 1 },
      "rover 2": { heading: "W", x: 4, y: 5 },
      "rover 3": { heading: "S", x: 3, y: 1 },
      "rover 4": { heading: "E", x: 10, y: 9 },
    });
  });

  it("should process a rotation command", () => {
    nasaSatelliteProvider.sendCommand("rover 1", "L");
    nasaSatelliteProvider.sendCommand("rover 2", "R");
    nasaSatelliteProvider.sendCommand("rover 3", "L");
    nasaSatelliteProvider.sendCommand("rover 4", "R");

    expect(nasaSatelliteProvider.report()).toStrictEqual({
      "rover 1": { heading: "W", x: 0, y: 0 },
      "rover 2": { heading: "N", x: 5, y: 5 },
      "rover 3": { heading: "E", x: 3, y: 2 },
      "rover 4": { heading: "S", x: 9, y: 9 },
    });
  });

  it("should throw on an attempt to create a duplicate connection", () => {
    expect(() => {
      nasaSatelliteProvider.connect("rover 1", { heading: "W", x: 1, y: 1 });
    }).toThrow("duplicate");
  });

  it("should throw on an attempt to create an out of bounds connection", () => {
    expect(() => {
      nasaSatelliteProvider.connect("rover 5", { heading: "W", x: 11, y: 1 });
    }).toThrow("out of bounds");
  });

  it("should throw on an attempt to create a collisive connection", () => {
    expect(() => {
      nasaSatelliteProvider.connect("rover 5", { heading: "W", x: 5, y: 5 });
    }).toThrow("collision");
  });

  it("should throw on an attempt to move a rover that doesn't exist", () => {
    expect(() => {
      nasaSatelliteProvider.sendCommand("rover 5", "M");
    }).toThrow("no connection");
  });

  it("should throw on an attempt to move a rover out of bounds", () => {
    expect(() => {
      nasaSatelliteProvider.sendCommand("rover 1", "L");
      nasaSatelliteProvider.sendCommand("rover 1", "M");
    }).toThrow("out of bounds");
  });

  it("should throw on an attempt to move a rover into another", () => {
    nasaSatelliteProvider.connect("rover 5", { heading: "W", x: 1, y: 0 });

    expect(() => {
      nasaSatelliteProvider.sendCommand("rover 5", "M");
    }).toThrow("collision");
  });
});
