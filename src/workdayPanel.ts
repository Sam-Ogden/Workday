import * as vscode from "vscode";
import getWebviewContent from "./webViewContent";
import { State, StoreActions } from "./types";

export default function workdayPanel(
  { dispatch, getState, subscribe }: StoreActions,
  context: vscode.ExtensionContext
) {
  let panel: vscode.WebviewPanel | undefined;
  let columnToShowIn = vscode.ViewColumn.Active;

  const init = () => {
    if (panel) {
      panel.reveal();
    } else {
      panel = vscode.window.createWebviewPanel(
        "workday",
        "My Workday",
        columnToShowIn,
        { enableScripts: true, retainContextWhenHidden: true }
      );

      panel.webview.onDidReceiveMessage(
        dispatch,
        undefined,
        context.subscriptions
      );
      panel.onDidDispose(() => {
        persist(getState());
        panel = undefined;
      });

      panel.webview.html = getWebviewContent();
      context.subscriptions.push(panel);
      subscribe(render);
      subscribe(persist);
    }
    return panel;
  };

  const render = (state: State) => {
    panel?.webview.postMessage(state);
  };

  const persist = (state: State) =>
    context.workspaceState.update("data", state);

  const getPanel = () => panel;

  return { render, init, getPanel };
}
