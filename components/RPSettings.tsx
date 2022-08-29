import { SwitchItem } from "@rikka/API/components/settings";
import { Store } from "@rikka/API/storage";
import * as React from "react";

type settingsProps = {
  settings: Store;
}

type settingsState = {
  hideRk: boolean;
}

export class RPSettings extends React.Component<settingsProps, settingsState> {
  state = {
    hideRk: this.props.settings.get("hideRk", false) as boolean,
  };

  render() {
    return (
      <div>
        <SwitchItem
          value={this.state.hideRk}
          onChange={(v: boolean) => {
            this.props.settings.set("hideRk", !v);
            this.setState({
              hideRk: v,
            });
          }}
        >Hide Rikka (unrecommended)</SwitchItem>
      </div>
    );
  }
}
