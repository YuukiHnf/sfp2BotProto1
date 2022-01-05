import React, { useCallback } from "react";
import { useAppDispatch } from "../app/hooks";
import { login, logout } from "../features/user/userSlicer";
import { DBUserType } from "../types/userType";

const useLogin = () => {
  const dispatch = useAppDispatch();

  // Login
  const onLogin = (usr: { dbUser: DBUserType; isAdmin: boolean }) => {
    // firebaseのLogin方法

    // Globalstateに反映させる
    dispatch(
      login({
        dbUser: usr.dbUser,
        isAdmin: usr.isAdmin,
      })
    );
  };

  // Logout
  const onLogout = () => {
    //firebaseのLogout処理

    dispatch(logout(undefined));
  };

  return { onLogin, onLogout };
};

export default useLogin;
