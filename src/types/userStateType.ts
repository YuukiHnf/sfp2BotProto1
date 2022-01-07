// user状態管理用Type
export type UserStateType = "free" | "busy";

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
