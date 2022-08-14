import { Position } from "@entities/position.entity";
import { SerializerProvider } from "@providers/serializer.provider";

export class NodeSerializerProvider implements SerializerProvider {
  serialize(positions: Position[]): string {
    return positions.reduce((acc, c) => {
      return acc.concat(`${c.x} ${c.y} ${c.heading}\n`);
    }, "");
  }
}
