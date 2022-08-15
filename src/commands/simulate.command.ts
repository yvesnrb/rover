import { FileLoaderProvider } from "@providers/file-loader.provider";
import { ParserProvider } from "@providers/parser.provider";
import { SatelliteProvider } from "@providers/satellite.provider";
import { SerializerProvider } from "@providers/serializer.provider";
import { BuildResolverOptions, Lifetime, RESOLVER } from "awilix";
import { Proxy } from "container";

/**
 * Command class that will process the 'simulate' command.
 */
export class SimulateCommand {
  static [RESOLVER]: BuildResolverOptions<SimulateCommand> = {
    name: "simulateCommand",
    lifetime: Lifetime.SINGLETON,
  };

  #fileLoader: FileLoaderProvider;

  #parser: ParserProvider;

  #satellite: SatelliteProvider;

  #serializer: SerializerProvider;

  constructor(proxy: Proxy) {
    this.#fileLoader = proxy.nodeFileLoaderProvider;
    this.#parser = proxy.nodeParserProvider;
    this.#satellite = proxy.nasaSatelliteProvider;
    this.#serializer = proxy.nodeSerializerProvider;
  }

  /**
   * Execute the command.
   *
   * @param path - Path of the input file to load.
   * @returns POSIX exit status of the simulation.
   */
  execute(path: string): 0 | 1 {
    const file = this.#fileLoader.load(path);

    if (!file) {
      console.log(`could not open ${path}`);
      return 1;
    }

    try {
      const parsed = this.#parser.parse(file);
      this.#satellite.setBounds(parsed.bounds.x, parsed.bounds.y);

      parsed.rovers.forEach((r, i) => {
        this.#satellite.connect(`Rover ${i}`, r.initialPosition);
      });

      parsed.rovers.forEach((r, i) => {
        r.commands.forEach((c) => {
          this.#satellite.sendCommand(`Rover ${i}`, c);
        });
      });

      const finalPositions = Object.values(this.#satellite.report());
      console.log(this.#serializer.serialize(finalPositions));
    } catch (e) {
      if (e instanceof Error) console.log(`simulation error!\n${e.message}`);
      return 1;
    }
    return 0;
  }
}
