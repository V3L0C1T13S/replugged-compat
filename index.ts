import { IPC_Consts } from "@rikka/API/Constants";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { registerURLCallback } from "@rikka/modules/browserWindowtils";
import { ipcRenderer } from "electron";
import { copyFileSync, existsSync } from "fs";
import { join } from "path";
import React from "react";
import { RPSettings } from "./components/RPSettings";
import { rpPath } from "./constants/pc";
import manifest from "./manifest.json";

export default class RepluggedCompat extends RikkaPlugin {
  private rpInstallPath = rpPath;

  private powercordInstance?: any;

  preInject() {
    registerURLCallback((url, opts, window, originalLoadUrl) => {
      const match = url.match(/^https:\/\/((?:canary|ptb)\.)?discord(app)?\.com\/_powercord\//);
      if (match) {
        (window as any).webContents._powercordOgUrl = url;
        return originalLoadUrl(`https://${match[1] || ""}discord.com/app`, opts);
      }
      return originalLoadUrl(url, opts);
    }, /^https:\/\/((?:canary|ptb)\.)?discord(app)?\.com\/_powercord\//);

    require("./ipc/main");
  }

  inject() {
    $rk.settingsManager.registerSettings("replugged-compat", {
      category: "replugged-compat",
      label: "Replugged Compat",
      render: () => React.createElement(RPSettings, {
        settings: this.settings,
      }),
    });

    if (!existsSync(this.rpInstallPath)) {
      ipcRenderer.invoke(IPC_Consts.SHOW_DIALOG, {
        title: "Replugged Compat",
        type: "error",
        message: "Unable to find a valid Replugged installation.",
        detail: "Please download and install Replugged following the instructions in the README.",
        buttons: ["OK"],
      });
      return;
    }
    copyFileSync(join(__dirname, "preload.js"), join(this.rpInstallPath, "src", "preload.js"));

    this.log("Loading Replugged");
    const pc = require(`${this.rpInstallPath}/src/preload`);
    this.log("Finished loading Replugged");
    this.powercordInstance = pc;
  }

  uninject() {
    if (!this.powercordInstance) return;
    this.powercordInstance.shutdown().catch(() => {
      this.error("Failed to shutdown Replugged, ignoring error");
    });
  }
}
