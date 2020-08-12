import * as vscode from "vscode";

import createStore from "./store";
import reducer from "./reducer";
import createWorkdayPanel from "./workdayPanel";
import createStatusBarItem from "./statusBarItem";
import carryTodos from "./carryTodos";

export function activate(context: vscode.ExtensionContext) {
  let store = createStore(context.workspaceState.get("data"), reducer);
  let panel = createWorkdayPanel(store, context);
  let status = createStatusBarItem(store, context);

  vscode.commands.registerCommand("workday.workday", () => {
    carryTodos(store, context);
    panel.init();
    status.init();
  });
}

export function deactivate() {}
