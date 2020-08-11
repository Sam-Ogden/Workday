import * as vscode from "vscode";

import createStore from "./store";
import reducer from "./reducer";
import createWorkdayPanel from "./workdayPanel";

export function activate(context: vscode.ExtensionContext) {
  let store = createStore(context.workspaceState.get("data"), reducer);
  let panel = createWorkdayPanel(store, context);

  vscode.commands.registerCommand("workday.workday", () => {
    panel.init();
  });
}

export function deactivate() {}
