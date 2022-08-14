import { SerializerProvider } from "@providers/serializer.provider";
import { NodeSerializerProvider } from "./node-serializer.provider";

const serializer: SerializerProvider = new NodeSerializerProvider();

describe("Node Serializer Provider", () => {
  it("should serialize an array of positions", () => {
    const out = serializer.serialize([
      { heading: "N", x: 3, y: 3 },
      { heading: "S", x: 0, y: 0 },
      { heading: "E", x: 1, y: 3 },
    ]);

    expect(out).toStrictEqual("3 3 N\n0 0 S\n1 3 E\n");
  });
});
