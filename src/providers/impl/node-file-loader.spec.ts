import { NodeFileLoaderProvider } from "./node-file-loader.provider";

const fileLoader = new NodeFileLoaderProvider();

describe("Node File Loader Provider", () => {
  it("should load a file that exists", () => {
    const file = fileLoader.load("src/fixtures/ok-input-one.txt");
    expect(file).toStrictEqual("5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM\n");
  });

  it("should return null for a path that does not exist", () => {
    const file = fileLoader.load("src/fixtures/this-file-does-not-exist.txt");
    expect(file).toBeNull();
  });
});
