import { SimulateCommand } from "@commands/simulate.command";
import { FileLoaderProvider } from "@providers/file-loader.provider";
import { ParserProvider } from "@providers/parser.provider";
import { SatelliteProvider } from "@providers/satellite.provider";
import { SerializerProvider } from "@providers/serializer.provider";
import { createContainer, InjectionMode } from "awilix";
import { join } from "path";

/**
 * Type for the injection proxy that awilix uses as the only argument
 * of the constructor when it instantiates new dependencies. It will
 * contain all dependencies that have been loaded by the `loadModules`
 * glob defined above.
 */
export type Proxy = {
  nodeParserProvider: ParserProvider;
  nasaSatelliteProvider: SatelliteProvider;
  nodeSerializerProvider: SerializerProvider;
  nodeFileLoaderProvider: FileLoaderProvider;
  simulateCommand: SimulateCommand;
};

export const container = createContainer<Proxy>({
  injectionMode: InjectionMode.PROXY,
});

container.loadModules([
  [join(__dirname, "providers", "impl", "!(*.spec|*.d|*.test).{js,ts}")],
  [join(__dirname, "commands", "!(*.spec|*.d|*.test).{js,ts}")],
]);
