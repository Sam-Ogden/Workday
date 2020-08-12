import * as assert from "assert";

import statusBarItem from "../../statusBarItem";
import Store from "../../store";
import today from "../../today";
import { State } from "../../types";
import actions from "../../actions";
import reducer from "../../reducer";

const INITIAL_STATE: State = {
  [today]: [
    { id: "1", title: "todo 1", complete: false, date: today },
    { id: "2", title: "todo 2", complete: false, date: today },
    { id: "3", title: "todo 3", complete: true, date: today },
  ],
};

suite("Status Bar item", () => {
  test("Adds status item to context", () => {
    const store = Store();
    const context = {
      subscriptions: [],
    } as any;
    const item = statusBarItem(store, context);
    item.init();
    assert.equal(context.subscriptions.length, 1);
  });

  test("Renders correct number of tasks", () => {
    const store = Store(INITIAL_STATE);
    const item = statusBarItem(store, { subscriptions: [] } as any);
    item.init();
    const text = item.getStatusBarItem().text;
    assert.equal(text, "1/3 tasks");
  });

  test("Updates status on store update", () => {
    const store = Store(INITIAL_STATE, reducer);
    const item = statusBarItem(store, { subscriptions: [] } as any);
    item.init();
    store.dispatch({
      type: actions.TOGGLE_TODO,
      payload: INITIAL_STATE[today][0],
    });
    const text = item.getStatusBarItem().text;
    assert.equal(text, "2/3 tasks");
  });
});
