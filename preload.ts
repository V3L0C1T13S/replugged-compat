import { join } from "path";

const rkDir = "../../../../dist/Rikka";

(global as any).NEW_BACKEND = !process.versions.electron.startsWith("13") && process.contextIsolated;

require("../polyfills");

require("./ipc/renderer");

require("module").Module.globalPaths.push(join(__dirname, "fake_node_modules"));

const Powercord = require("./Powercord");

(global as any).powercord = new Powercord();
