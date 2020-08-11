import actions from "./actions";
import { State, Item, Action } from "./types";

const getId = () => Math.random().toString(36).slice(-10);

export default function reducer(state: State, { type, payload }: Action) {
  const today = new Date().toLocaleDateString("en-us");
  switch (type) {
    case actions.ADD_TODO:
      return {
        ...state,
        [today]: [
          ...(state[today] ?? []),
          { ...payload, id: getId(), date: today },
        ],
      };
    case actions.TOGGLE_TODO:
      const newState = { ...state };
      newState[payload.date].forEach(
        (todo: Item) =>
          todo.id === payload.id && (todo.complete = !todo.complete)
      );
      return newState;
  }
  return state;
}
