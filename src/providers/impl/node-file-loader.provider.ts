import { FileLoaderProvider } from "@providers/file-loader.provider";
import { BuildResolverOptions, Lifetime, RESOLVER } from "awilix";
import { readFileSync } from "fs";

export class NodeFileLoaderProvider implements FileLoaderProvider {
  static [RESOLVER]: BuildResolverOptions<FileLoaderProvider> = {
    name: "nodeFileLoaderProvider",
    lifetime: Lifetime.SINGLETON,
  };

  load(path: string): string | null {
    try {
      const buffer = readFileSync(path);
      return buffer.toString();
    } catch {
      return null;
    }
  }
}
