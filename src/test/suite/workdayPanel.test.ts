import * as assert from "assert";

import * as vscode from "vscode";
import workdayPanel from "../../workdayPanel";
import Store from "../../store";
import today from "../../today";
import { State, Item } from "../../types";
import actions from "../../actions";
import reducer from "../../reducer";

const INITIAL_STATE: State = {
  [today]: [
    { id: "1", title: "todo 1", complete: false, date: today },
    { id: "2", title: "todo 2", complete: false, date: today },
    { id: "3", title: "todo 3", complete: true, date: today },
  ],
};

const getContext = () =>
  ({
    subscriptions: [],
    workspaceState: { get: () => {}, update: () => {} },
  } as any);

suite("Workday panel", () => {
  test("Adds panel and message listener to context", () => {
    const store = Store();
    const context = getContext();
    const panel = workdayPanel(store, context);
    panel.init();
    assert.equal(context.subscriptions.length, 2);
  });

  test("Returns previously created panel if already initialized", () => {
    const store = Store(INITIAL_STATE);
    const context = getContext();
    const item = workdayPanel(store, context);
    const firstPanel = item.init();
    const secondPanel = item.init();
    assert.equal(Object.is(firstPanel, secondPanel), true);
  });

  test("Updates view on store update", () => {
    const store = Store(INITIAL_STATE, reducer);
    const context = getContext();
    const item = workdayPanel(store, context);
    const panel = item.init();
    let call: State | undefined;
    panel.webview.postMessage = function (arg: State): any {
      call = arg;
    };
    const title = "test-todo";
    store.dispatch({
      type: actions.ADD_TODO,
      payload: { title },
    });
    assert.equal(
      call?.[today].some((todo: Item) => todo.title === title),
      true
    );
  });
});
