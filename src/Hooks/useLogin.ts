import { signOut, updateProfile, UserCredential } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login, logout, selectUser } from "../features/user/userSlicer";
import { auth, functions } from "../firebase/firebase";
import { DBUserType } from "../types/userStateType";

const useLogin = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const history = useHistory();

  // Login
  const onLogin = async (usr: { dbUser: DBUserType; isAdmin: boolean }) => {
    // Firebase側の処理
    // activeUserに書きこみ、userParamのActiveをTrueにするのを "Batch"処理
    // // cloudFunction-registerActiveUser
    const registerAsActiveUser = httpsCallable(
      functions,
      "registerAsActiveUser"
    );
    registerAsActiveUser().then((result: any) => {
      console.log("registerAsActiveUser : ", result.data.isOk);
    });

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
        //cloudFunction - unregisterActiveUser()
        // // cloudFunction-registerActiveUser
        const unRegisterAsActiveUser = httpsCallable(
          functions,
          "unRegisterAsActiveUser"
        );
        unRegisterAsActiveUser({ uid: user.uid }).then((result: any) => {
          console.log("unRegisterAsActiveUser : ", result.data.isOk);
        });
        await signOut(auth);
        dispatch(logout(undefined));
      } catch (e: any) {
        alert(e.message);
      }
    };

    onSignOut();

    // urlの /移動
    history.push("/");
  };

  const onSignIn = async (
    usrCredient: UserCredential,
    userName: string,
    isAdmin: boolean
  ) => {
    // userのDisplayNameやPhotoUrlを更新
    auth.currentUser &&
      (await updateProfile(usrCredient.user, {
        displayName: userName,
      }));
    // userParamを立てる（ListenerでFunctionsがしてくれている）
    // Login時の処理をする
    //  ・cloudFunction-registerActiveUser
    const registerUserParamsListener = httpsCallable(
      functions,
      "registerAsActiveUser"
    );
    registerUserParamsListener().then((result: any) => {
      console.log("registerAsActiveUser : ", result.data.isOk);
    });
    // globalに入れる
    onLogin({
      dbUser: {
        uid: usrCredient.user.uid,
        username: usrCredient.user.displayName,
        photoURL: usrCredient.user.photoURL,
        isAnonymous: usrCredient.user.isAnonymous ?? false,
      },
      isAdmin: isAdmin,
    });
  };

  return { onLogin, onLogout, onSignIn };
};

export default useLogin;
