import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import { UserStateType } from "../../types/userStateType";
import { DBUserType } from "../../types/userType";

export type stateUserType = {
  uid: string;
  photoUrl?: string;
  displayName: string;
  state: UserStateType;
  isAdmin: boolean;
  currentTask: string;
};

const initialState: { user: stateUserType } = {
  user: {
    uid: "",
    state: { state: "free" },
    isAdmin: false,
    currentTask: "",
    photoUrl: "",
    displayName: "unKnown",
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
  initialState,
  reducers: {
    login: (
      // LoginAction
      state,
      action: PayloadAction<{ dbUser: DBUserType; isAdmin: boolean }>
    ) => {
      const { dbUser, isAdmin } = action.payload;
      state.user = {
        uid: dbUser.uid,
        state: { state: "free" },
        isAdmin: isAdmin,
        currentTask: "",
        photoUrl: dbUser.photoURL,
        displayName: dbUser.username,
      };
    },
    logout: (state, action) => {
      //LogoutAction
      state.user = initialState.user;
    },
    updateUserState: (state, action: PayloadAction<UserStateType>) => {
      //stateのUpdateAction
      state.user.state = action.payload;
    },
  },
});

export const { login, logout, updateUserState } = userSlicer.actions;

export const selectUser = (state: RootState) => state?.user.user;

export default userSlicer.reducer;
