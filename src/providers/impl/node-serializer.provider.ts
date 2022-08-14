import { Position } from "@entities/position.entity";
import { SerializerProvider } from "@providers/serializer.provider";
import { BuildResolverOptions, Lifetime, RESOLVER } from "awilix";

export class NodeSerializerProvider implements SerializerProvider {
  static [RESOLVER]: BuildResolverOptions<SerializerProvider> = {
    name: "nodeSerializerProvider",
    lifetime: Lifetime.SINGLETON,
  };

  serialize(positions: Position[]): string {
    return positions.reduce((acc, c) => {
      return acc.concat(`${c.x} ${c.y} ${c.heading}\n`);
    }, "");
  }
}
