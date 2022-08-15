import { ParsedFile } from "@entities/parsed-file.entity";
import { FileLoaderProvider } from "@providers/file-loader.provider";
import { ParserProvider } from "@providers/parser.provider";
import { SatelliteProvider } from "@providers/satellite.provider";
import { SerializerProvider } from "@providers/serializer.provider";
import {
  instance,
  mock,
  when,
  verify,
  strictEqual,
  reset,
  anything,
} from "ts-mockito";
import { SimulateCommand } from "./simulate.command";

const log = jest.spyOn(console, "log").mockImplementation(() => undefined);

const nodeFileLoaderProvider = mock<FileLoaderProvider>();
const nodeParserProvider = mock<ParserProvider>();
const nasaSatelliteProvider = mock<SatelliteProvider>();
const nodeSerializerProvider = mock<SerializerProvider>();

const simulateCommand = new SimulateCommand({
  nodeFileLoaderProvider: instance(nodeFileLoaderProvider),
  nodeParserProvider: instance(nodeParserProvider),
  nasaSatelliteProvider: instance(nasaSatelliteProvider),
  nodeSerializerProvider: instance(nodeSerializerProvider),
});

const parsedFile: ParsedFile = {
  bounds: { x: 10, y: 10 },
  rovers: [
    {
      initialPosition: { x: 0, y: 0, heading: "N" },
      commands: ["M", "M", "M", "M"],
    },
    {
      initialPosition: { x: 10, y: 10, heading: "S" },
      commands: ["M", "M", "M", "M"],
    },
  ],
};

describe("Simulate Command", () => {
  beforeEach(() => {
    log.mockClear();
    reset(nodeFileLoaderProvider);
    reset(nodeParserProvider);
    reset(nasaSatelliteProvider);
    reset(nodeSerializerProvider);
  });

  it("should log a file loader error and return 1", () => {
    when(nodeFileLoaderProvider.load("mock path")).thenReturn(null);

    const exitStatus = simulateCommand.execute("mock path");

    expect(exitStatus).toStrictEqual(1);
    expect(log).toHaveBeenCalledWith("could not open mock path");
  });

  it("should log a simulation error and return 1", () => {
    when(nodeFileLoaderProvider.load("mock path")).thenReturn("mock file");
    when(nodeParserProvider.parse("mock file")).thenThrow(
      new Error("mock error")
    );

    const exitStatus = simulateCommand.execute("mock path");

    expect(exitStatus).toStrictEqual(1);
    expect(log).toHaveBeenCalledWith("simulation error!\nmock error");
  });

  it("should set the bounds", () => {
    when(nodeFileLoaderProvider.load("mock path")).thenReturn("mock file");
    when(nodeParserProvider.parse("mock file")).thenReturn(parsedFile);

    simulateCommand.execute("mock path");

    verify(
      nasaSatelliteProvider.setBounds(parsedFile.bounds.x, parsedFile.bounds.y)
    ).once();
  });

  it("should connect the rovers", () => {
    when(nodeFileLoaderProvider.load("mock path")).thenReturn("mock file");
    when(nodeParserProvider.parse("mock file")).thenReturn(parsedFile);

    simulateCommand.execute("mock path");

    verify(
      nasaSatelliteProvider.connect(
        strictEqual("Rover 0"),
        strictEqual(parsedFile.rovers[0].initialPosition)
      )
    ).once();
    verify(
      nasaSatelliteProvider.connect(
        strictEqual("Rover 1"),
        strictEqual(parsedFile.rovers[1].initialPosition)
      )
    ).once();
  });

  it("should send the commands", () => {
    when(nodeFileLoaderProvider.load("mock path")).thenReturn("mock file");
    when(nodeParserProvider.parse("mock file")).thenReturn(parsedFile);

    simulateCommand.execute("mock path");
    verify(
      nasaSatelliteProvider.sendCommand(
        strictEqual("Rover 0"),
        strictEqual("M")
      )
    ).times(4);
    verify(
      nasaSatelliteProvider.sendCommand(
        strictEqual("Rover 1"),
        strictEqual("M")
      )
    ).times(4);
  });

  it("should log a serialized version of the values of the report", () => {
    when(nodeFileLoaderProvider.load("mock path")).thenReturn("mock file");
    when(nodeParserProvider.parse("mock file")).thenReturn(parsedFile);
    when(nasaSatelliteProvider.report()).thenReturn({});
    when(nodeSerializerProvider.serialize(anything())).thenReturn(
      "mock serialization"
    );

    simulateCommand.execute("mock path");
    expect(log).toHaveBeenCalledWith("mock serialization");
  });
});
