import { SimulateCommand } from "@commands/simulate.command";
import { container } from "./container";

const simulateCommand = container.resolve<SimulateCommand>("simulateCommand");
const [, , path] = process.argv;

if (!path) {
  console.log("please supply a file path");
  process.exit(1);
}

const exitStatus = simulateCommand.execute(path);
process.exit(exitStatus);
