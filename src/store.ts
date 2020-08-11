import { Action, State, StoreActions, Reducer } from "./types";

export default function store(
  initialState: any = {},
  reducer: Reducer = (state: any) => state
) {
  let state = initialState;
  let subs: any = [];
  const dispatch: StoreActions["dispatch"] = (action: Action) => {
    state = reducer(state, action);
    subs.forEach((cb: any) => cb(state));
    return state;
  };
  const getState: StoreActions["getState"] = () => ({ ...state });
  const subscribe: StoreActions["subscribe"] = (cb) => {
    subs.push(cb);
    cb(state);
  };
  return { dispatch, getState, subscribe };
}
