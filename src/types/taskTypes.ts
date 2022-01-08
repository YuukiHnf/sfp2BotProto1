// taskのState状態
export type TaskStateType = "ToDo" | "Doing" | "DoingChat" | "Waiting" | "Done";

// firebaseのTask Collection
export type taskCollectionType = {
  id: string;
  info: {
    title: string;
    desc: string;
    imageUrl: string;
    createdat: string;
  };
  by: {
    uid: string;
    displayName: string;
    avatarUrl: string;
  };
};
// firebaseのtaskParameter Collection
export type taskParamCollectionType = {
  id: string;
  timeCost: number;
  afterDone: string;
  state: TaskStateType;
  by: string;
};

// taskを定義するときの情報
export type allTaskInfomatioinType = {
  id: string;
  info: {
    title: string;
    imageUrl: string;
    createdat: string;
  };
  state: TaskStateType;
  timeCost: number;
  afterDone: string;
  by: string;
};
