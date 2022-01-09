import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import {
  UserStateType,
  DBUserType,
  globalUserStateType,
} from "../../types/userStateType";

export const initialGlobalUserState: { user: globalUserStateType } = {
  user: {
    uid: "",
    isAdmin: false,
    info: {
      photoUrl: "",
      displayName: "unKnown",
    },
    isActive: false,
    userState: {
      state: "free",
      currentTask: "",
    },
  },
};

/**
 * useSlice
 * 名前: user
 * 初期状態：initailState
 * Event：
 *  ・login：firebase Loginの時に実行する
 *  ・logout：firebase Logoutの時に実行する
 *  ・updateUserState：自身のstateを変更するときに使う
 */
export const userSlicer = createSlice({
  name: "user",
  initialState: initialGlobalUserState,
  reducers: {
    login: (
      // LoginAction
      state,
      action: PayloadAction<{ dbUser: DBUserType; isAdmin: boolean }>
    ) => {
      const { dbUser, isAdmin } = action.payload;
      // globalStateの更新
      state.user = {
        uid: dbUser.uid,
        isAdmin: isAdmin,
        info: {
          photoUrl: dbUser.photoURL,
          displayName: dbUser.username,
        },
        isActive: true,
        userState: {
          state: "free",
          currentTask: "",
        },
      };
    },
    logout: (state, action) => {
      //LogoutAction
      state.user = initialGlobalUserState.user;
    },
    updateUserState: (state, action: PayloadAction<UserStateType>) => {
      //stateのUpdateAction
      state.user.userState.state = action.payload;
    },
  },
});

export const { login, logout, updateUserState } = userSlicer.actions;

export const selectUser = (state: RootState) => state?.user.user;

export default userSlicer.reducer;
