import { container } from "./container";

const [, , path] = process.argv;

if (!path) {
  console.log("please supply a file path");
  process.exit(1);
}

const exitStatus = container.cradle.simulateCommand.execute(path);
process.exit(exitStatus);
