import { join } from "path";

const rkDir = "../../../../dist/Rikka";

(global as any).NEW_BACKEND = !process.versions.electron.startsWith("13") && process.contextIsolated;

require("../polyfills");

require("./ipc/renderer");

if ((global as any).NEW_BACKEND) {
  const getFunctions = [
    ["querySelector", false],
    ["querySelectorAll", true],
    ["getElementById", false],
    ["getElementsByClassName", true],
    ["getElementsByName", true],
    ["getElementsByTagName", true],
    ["getElementsByTagNameNS", true],
  ];

  // ??? Why is this necessary?
  getFunctions.forEach(([getMethod, isCollection]) => {
    // @ts-ignore
    const realGetter = document[getMethod].bind(document);
    if (isCollection) {
      // @ts-ignore
      document[getMethod] = (...args: any) => {
        const webpack = require("powercord/webpack");
        const nodes = Array.from(realGetter(...args));
        nodes.forEach((node) => webpack.__lookupReactReference(node));
        return nodes;
      };
    } else {
      // @ts-ignore
      document[getMethod] = (...args: any) => {
        const webpack = require("powercord/webpack");
        const node = realGetter(...args);
        webpack.__lookupReactReference(node);
        return node;
      };
    }
  });
}

require("module").Module.globalPaths.push(join(__dirname, "fake_node_modules"));

const Powercord = require("./Powercord");

(global as any).powercord = new Powercord();
