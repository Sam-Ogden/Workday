import * as vscode from "vscode";
import { StoreActions, Item, State } from "./types";
import actions from "./actions";
import { todayMS } from "./today";

/**
 * Finds all old todos that have not been completed
 * removes them and then adds them to todays todo.
 */
export default function carryTodos(
  store: StoreActions,
  context: vscode.ExtensionContext
) {
  getOldIncompleteTodos(
    store.getState(),
    context.workspaceState.get("lastCarryUpdate") || 0
  ).forEach(({ title, date, id }: Item) => {
    store.dispatch({
      type: actions.ADD_TODO,
      payload: { title: `${title} (${date})` },
    });
    store.dispatch({ type: actions.DELETE_TODO, payload: { id, date } });
  });
  context.workspaceState.update("lastCarryUpdate", todayMS);
}

const getOldIncompleteTodos = (state: State, fromDate: number) =>
  fromDate === todayMS
    ? []
    : Object.entries(state)
        .filter(([key]) => {
          const dateTime = new Date(key).getTime();
          return dateTime >= fromDate && dateTime < todayMS;
        })
        ?.map(([_, todos]: any) => todos.filter((todo: Item) => !todo.complete))
        ["flat" as any]();
