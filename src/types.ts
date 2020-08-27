export type Item = {
  id: string;
  title: string;
  complete: boolean;
  date: string;
  createdDate: string;
};

export type State = {
  [date: string]: Item[];
};

export type Action = { type: string; payload: any };

export type StoreActions = {
  dispatch: (action: Action) => any;
  getState: () => any;
  subscribe: (callback: (state: any) => void) => void;
};

export type Reducer = (state: any, action: Action) => any;
export type Store = (initialState: object, reducer: Reducer) => StoreActions;
