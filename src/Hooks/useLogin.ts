import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { login, logout } from "../features/user/userSlicer";
import { DBUserType } from "../types/userStateType";

const useLogin = () => {
  const dispatch = useAppDispatch();

  const history = useHistory();

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
    // urlの /移動
    history.push("/");
  };

  return { onLogin, onLogout };
};

export default useLogin;
