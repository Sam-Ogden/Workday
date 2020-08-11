import * as assert from "assert";

import Store from "../../store";

const INITIAL_STATE = {
  test: true,
};

const reducer = () => ({ test: false });

suite("Store", () => {
  test("Uses initial state", () => {
    const store = Store(INITIAL_STATE);
    assert.equal(store.getState().test, INITIAL_STATE.test);
  });

  test("Updates state", () => {
    const store = Store(INITIAL_STATE, reducer);
    store.dispatch({ type: "", payload: {} });
    assert.equal(store.getState().test, !INITIAL_STATE.test);
  });

  test("Calls subscribers on state update", () => {
    const store = Store(INITIAL_STATE, reducer);
    let call: any;
    const callback = (state: any) => (call = state);
    store.subscribe(callback);
    store.dispatch({ type: "", payload: {} });
    assert.equal(call.test, !INITIAL_STATE.test);
  });
});
