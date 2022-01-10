// firebase/userParams collectionの中身DB
export type UserParamsType = {
  uid: string;
  userStates: {
    state: UserStateType;
    currentTask: string;
  };
  isActive: boolean;
};

//FirebaseのAuthUserの情報
export type DBUserType = {
  uid: string;
  username: string | null;
  email?: string | null;
  password?: string;
  photoURL: string | null;
  isAnonymous: boolean;
};

//FirebaseのactiveUserDBのType
// user状態管理用Type
export type UserStateType = "free" | "busy";

// タスクに関する情報
export type UserTaskStateType = {
  state: UserStateType;
  currentTask: string;
};

export type activeUsersCollectionType = {
  uid: string;
  info: {
    photoUrl: string;
    displayName: string;
  };
  userTaskState: UserTaskStateType;
  isAdmin: boolean;
};
//FirebaseのusrParamsDBのType
export type userParamsCollectionType = {
  uid: string;
  userState: {
    state: UserStateType;
    currentTask: string;
  };
  isActive: boolean;
};

// GlobalStateのType
export type globalUserStateType = {
  uid: string;
  isAdmin: boolean;
  info: {
    photoUrl: string | null;
    displayName: string | null;
  };
  isActive: boolean;
  userTaskState: {
    state: UserStateType;
    currentTask: string | null;
  };
};
