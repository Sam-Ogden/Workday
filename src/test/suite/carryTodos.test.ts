import * as assert from "assert";

import carryTodos from "../../carryTodos";
import today, { todayMS } from "../../today";
import createStore from "../../store";
import reducer from "../../reducer";

const yesterday = new Date(new Date().getTime() - 86400000).toLocaleDateString(
  "en-us"
);
const dayBeforeYesterday = new Date(
  new Date().getTime() - 2 * 86400000
).toLocaleDateString("en-us");

const INITIAL_STATE = {
  [today]: [{ id: "1", title: "todo 1", complete: false, date: today }],
  [yesterday]: [
    { id: "2", title: "todo 2", complete: false, date: yesterday },
    { id: "3", title: "todo 3", complete: false, date: yesterday },
  ],
  [dayBeforeYesterday]: [
    { id: "4", title: "todo 4", complete: false, date: dayBeforeYesterday },
    { id: "5", title: "todo 5", complete: true, date: dayBeforeYesterday },
  ],
};

suite("Carry todos", () => {
  test("Carrys incomplete todos from all history", () => {
    const store = createStore(INITIAL_STATE, reducer);
    let returnedUpdateDate: number = 0;
    carryTodos(store, {
      workspaceState: {
        get: () => 0,
        update: (_: any, updateDate: number) =>
          (returnedUpdateDate = updateDate),
      },
    } as any);
    assert.equal(returnedUpdateDate, todayMS);
    assert.equal(store.getState()[today].length, 4);
    assert.equal(store.getState()[yesterday].length, 0);
    assert.equal(store.getState()[dayBeforeYesterday][0].id, "5");
  });

  test("Only carrys from dates after lastCarryUpdate date state value", () => {
    const store = createStore(INITIAL_STATE, reducer);
    carryTodos(store, {
      workspaceState: {
        get: () => new Date(yesterday).getTime(),
        update: () => {},
      },
    } as any);
    assert.equal(store.getState()[dayBeforeYesterday].length, 2);
    assert.equal(store.getState()[yesterday].length, 0);
    assert.equal(store.getState()[today].length, 3);
  });
});
