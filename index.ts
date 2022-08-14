import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { registerURLCallback } from "@rikka/modules/browserWindowtils";
import { copyFileSync } from "fs";
import { join } from "path";
import { rpPath } from "./constants/pc";
import manifest from "./manifest.json";

export default class RepluggedCompat extends RikkaPlugin {
  private rpInstallPath = rpPath;

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
    copyFileSync(join(__dirname, "preload.js"), join(this.rpInstallPath, "src", "preload.js"));

    this.log("Loading Replugged");
    require(`${this.rpInstallPath}/src/preload`);
    this.log("Finished loading Replugged");
  }
}
