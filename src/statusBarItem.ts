import * as vscode from "vscode";
import { State, StoreActions } from "./types";

import today from "./today";

export default function workdayPanel(
  { subscribe }: StoreActions,
  context: vscode.ExtensionContext
) {
  let statusBarItem: vscode.StatusBarItem;

  const init = () => {
    if (!statusBarItem) {
      statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
      );
      statusBarItem.command = "workday.workday";
      statusBarItem.show();
      context.subscriptions.push(statusBarItem);
      subscribe(render);
    }
    return statusBarItem;
  };

  const render = (state: State) => {
    const totalTodos = state[today]?.length ?? 0;
    const completedTodos =
      state[today]?.filter((todo) => todo.complete === true).length ?? 0;
    statusBarItem.text = `${completedTodos}/${totalTodos} tasks`;
  };

  const getStatusBarItem = () => statusBarItem;

  return { render, init, getStatusBarItem };
}
