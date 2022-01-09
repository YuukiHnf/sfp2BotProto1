import { signOut } from "firebase/auth";
import { doc, writeBatch } from "firebase/firestore";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login, logout, selectUser } from "../features/user/userSlicer";
import { auth, db } from "../firebase/firebase";
import { DBUserType } from "../types/userStateType";

const useLogin = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const history = useHistory();

  // Login
  const onLogin = async (usr: { dbUser: DBUserType; isAdmin: boolean }) => {
    // Firebase側の処理
    // activeUserに書きこみ、userParamのActiveをTrueにするのを "Batch"処理

    const batch = writeBatch(db);
    const activeUsersRef = doc(db, "activeUsers", usr.dbUser.uid);
    const userParamRef = doc(db, "userParams", usr.dbUser.uid);

    batch.set(activeUsersRef, {
      userTaskState: {
        state: "free",
        currentTask: "",
      },
      info: {
        avatarUrl: usr.dbUser.photoURL,
        displayName: usr.dbUser.username,
      },
      isAdmin: usr.isAdmin,
    });
    batch.set(userParamRef, {
      isActive: true,
      userTaskState: { currentTask: "", state: "free" },
    });
    // Batch書き込み
    await batch.commit();

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
    const onSignOut = async () => {
      console.log("try:signOut");
      try {
        await signOut(auth);
        const batch = writeBatch(db);
        const activeUsersRef = doc(db, "activeUsers", user.uid);
        const userParamRef = doc(db, "userParams", user.uid);

        batch.delete(activeUsersRef);
        batch.update(userParamRef, { isActive: false });
        // Batch書き込み
        await batch.commit();
        dispatch(logout(undefined));
        console.log("success:signOut");
      } catch (e: any) {
        alert(e.message);
      }
    };

    onSignOut();

    // urlの /移動
    history.push("/");
  };

  return { onLogin, onLogout };
};

export default useLogin;
