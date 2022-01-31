import React, { useCallback, useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  makeStyles,
  Modal,
  IconButton,
  Box,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import CameraIcon from "@material-ui/icons/Camera";
import EmailIcon from "@material-ui/icons/Email";

import TextField1 from "../atoms/TextField1";
import Button1 from "../atoms/Button1";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";
import useLogin from "../../Hooks/useLogin";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";

export const Auth = () => {
  //Auth componentのstate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //新規の場合のstate
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // 管理者（true）かゲストユーザか（false）
  const [isAdmin, setIsAdmin] = useState(true);
  // ログイン（true）か新規作成（false）か
  const [isLogin, setIsLogin] = useState(true);

  //Login
  const { onLogin, onSignIn } = useLogin();

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  //console.log(user);

  const onClickLoginButton = useCallback(async () => {
    try {
      const usrCredient = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("[SUCCESS] : ", usrCredient.user);

      // globalなstateへの反映
      if (usrCredient) {
        onLogin({
          dbUser: {
            uid: usrCredient.user.uid,
            username: usrCredient.user.displayName,
            photoURL: usrCredient.user.photoURL,
            isAnonymous: usrCredient.user.isAnonymous ?? false,
          },
          isAdmin: isAdmin,
        });
      }
    } catch (e) {}
  }, [email, password, onLogin, dispatch]);

  const onClickSignUpButton = useCallback(async () => {
    try {
      const usrCredient = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // globalなstateへの反映
      if (usrCredient) {
        onSignIn(usrCredient, userName, isAdmin);
      }
      console.log("[SUCCESS] : ", usrCredient.user);
    } catch (e: any) {
      alert(`[My-AuthWithEmail-Error]:${e.message}`);
    }
  }, [auth, email, password]);

  //console.log(`email:${email} password:${password}`);

  return (
    <>
      <Grid container component="main">
        <CssBaseline />
        <div>
          <Grid container>
            <Grid item xs>
              {isAdmin ? (
                isLogin ? (
                  <h2>Admin Login</h2>
                ) : (
                  <h2>Admin New User</h2>
                )
              ) : isLogin ? (
                <h2>Guest Login</h2>
              ) : (
                <h2>Guest New User</h2>
              )}
            </Grid>
          </Grid>
          {!isLogin && (
            <>
              <TextField1
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </>
          )}
          <TextField1
            name="email"
            value={email}
            onChange={useCallback((e) => setEmail(e.target.value), [setEmail])}
          />
          <TextField1
            name="password"
            value={password}
            onChange={useCallback(
              (e) => setPassword(e.target.value),
              [setPassword]
            )}
          />
          <Button1
            disabled={!email || password.length < 6}
            startIcon={<EmailIcon />}
            onClick={isLogin ? onClickLoginButton : onClickSignUpButton}
          >
            {isLogin ? "LOGIN" : "CREAT"}
          </Button1>
        </div>
      </Grid>
      <br />
      <br />
      {!isAdmin ? (
        <Grid item xs>
          <span onClick={() => setIsAdmin(true)}>Admin?</span>
        </Grid>
      ) : (
        <Grid item xs>
          <span onClick={() => setIsAdmin(false)}>Guest?</span>
        </Grid>
      )}
      <br />
      <br />
      {!isLogin ? (
        <Grid item xs>
          <span onClick={() => setIsLogin(true)}>Login?</span>
        </Grid>
      ) : (
        <Grid item xs>
          <span onClick={() => setIsLogin(false)}>New User?</span>
        </Grid>
      )}
    </>
  );
};
