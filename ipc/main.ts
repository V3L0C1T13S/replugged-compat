import {
  clearCache, compileSass, DevToolsClose, DevToolsOpen,
} from "@rikka/modules/util";
import child_process from "child_process";
import { BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { promisify } from "util";
import { rpPath } from "../constants/pc";

if (!ipcMain) throw new Error("IPC main is not available");

const exec = promisify(child_process.exec);

function getPreload() {
  return join(rpPath, "src", "preload.js");
}

async function execCommand(_: any, ...params: any) {
  // @ts-ignore
  return exec(...params);
}

ipcMain.on("POWERCORD_GET_PRELOAD", getPreload);
ipcMain.handle("POWERCORD_OPEN_DEVTOOLS", DevToolsOpen);
ipcMain.handle("POWERCORD_CLOSE_DEVTOOLS", DevToolsClose);
ipcMain.handle("POWERCORD_CACHE_CLEAR", clearCache);
// FIXME: Powercord/Replugged resolves some file:/// urls to a different path, Rikka doesn't do this
ipcMain.handle("POWERCORD_COMPILE_MF_SASS", compileSass);
ipcMain.handle("POWERCORD_WINDOW_IS_MAXIMIZED", (e) => BrowserWindow.fromWebContents(e.sender)?.isMaximized());
ipcMain.handle("POWERCORD_EXEC_COMMAND", execCommand);
