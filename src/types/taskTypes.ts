// taskのState状態
export type TaskStateType = "ToDo" | "Doing" | "DoingChat" | "Waiting" | "Done";

// firebaseのTask Collection
export type taskCollectionType = {
  id: string;
  info: {
    title: string;
    imageUrl: string;
    createdat: string;
  };
};
// firebaseのtaskParameter Collection
export type taskParamCollectionType = {
  id: string;
  timeCost: Number;
  afterDone: Number;
  state: TaskStateType;
  by: string;
};
