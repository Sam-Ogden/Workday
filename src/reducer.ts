import actions from "./actions";
import { State, Item, Action } from "./types";

const getId = () => Math.random().toString(36).slice(-10);

export default function reducer(state: State, { type, payload }: Action) {
  const today = new Date().toLocaleDateString("en-us");
  let newState;
  switch (type) {
    case actions.ADD_TODO:
      return {
        ...state,
        [today]: [
          ...(state[today] ?? []),
          { ...payload, id: getId(), date: today, complete: false },
        ],
      };
    case actions.TOGGLE_TODO:
      newState = { ...state };
      newState[payload.date].forEach(
        (todo: Item) =>
          todo.id === payload.id && (todo.complete = !todo.complete)
      );
      return newState;
    case actions.DELETE_TODO:
      newState = { ...state };
      newState[payload.date] = newState[payload.date].filter(
        (todo: Item) => todo.id !== payload.id
      );
      return newState;
  }
  return state;
}
