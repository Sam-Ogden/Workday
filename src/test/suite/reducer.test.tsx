import * as assert from "assert";

import reducer from "../../reducer";
import actions from "../../actions";
import today from "../../today";

const INITIAL_STATE = {
  [today]: [
    {
      id: "1",
      title: "todo 1",
      complete: false,
      date: today,
      createdDate: today,
    },
  ],
};
suite("Reducer", () => {
  test("Add todo action", () => {
    const res = reducer(INITIAL_STATE, {
      type: actions.ADD_TODO,
      payload: { title: "todo 2", complete: false },
    });
    assert.equal(res[today][0].title, "todo 1");
    assert.equal(res[today][1].title, "todo 2");
    assert.equal(!!res[today][1].id, true);
    assert.equal(res[today][1].complete, false);
    assert.equal(res[today][1].date, today);
  });

  test("toggle todo action", () => {
    const res = reducer(INITIAL_STATE, {
      type: actions.TOGGLE_TODO,
      payload: { id: INITIAL_STATE[today][0].id, date: today },
    });
    assert.equal(res[today][0].complete, true);
  });

  test("delete todo action", () => {
    const res = reducer(INITIAL_STATE, {
      type: actions.DELETE_TODO,
      payload: { id: INITIAL_STATE[today][0].id, date: today },
    });
    assert.equal(res[today].length, 0);
  });
});
