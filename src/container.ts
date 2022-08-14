import { createContainer, InjectionMode } from "awilix";
import { join } from "path";

export const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.loadModules([
  [join(__dirname, "providers", "impl", "!(*.spec|*.d|*.test).{js,ts}")],
]);
