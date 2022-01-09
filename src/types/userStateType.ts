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
  username: string;
  email?: string;
  password?: string;
  photoURL: string;
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
  userState: UserTaskStateType;
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
    photoUrl: string;
    displayName: string;
  };
  isActive: boolean;
  userState: {
    state: UserStateType;
    currentTask: string;
  };
};
