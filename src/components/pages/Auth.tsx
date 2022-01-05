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

export const Auth = () => {
  //Auth componentのstate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);

  //Login
  const { onLogin } = useLogin();

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  console.log(user);

  const onClickLoginButton = useCallback(() => {
    onLogin({
      dbUser: {
        uid: "1",
        username: "yuki",
        email: email,
        password: password,
        photoURL: "string",
        isAnonymous: false,
      },
      isAdmin: isAdmin,
    });
  }, [email, password, onLogin, dispatch]);

  console.log(`email:${email} password:${password}`);

  return (
    <Grid container component="main">
      <CssBaseline />
      <div>
        <Grid container>
          <Grid item xs>
            {isAdmin ? <h2>Admin Login</h2> : <h2>Guest Login</h2>}
          </Grid>
          {!isAdmin ? (
            <Grid item xs>
              <span onClick={() => setIsAdmin(true)}>AdminLogin?</span>
            </Grid>
          ) : (
            <Grid item xs>
              <span onClick={() => setIsAdmin(false)}>GuestLogin?</span>
            </Grid>
          )}
        </Grid>
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
          onClick={onClickLoginButton}
        >
          LOGIN
        </Button1>
        {/* <Button1
          disabled={false}
          startIcon={<EmailIcon />}
          onClick={onClickLogoutButton}
        >
          LOGOUT
        </Button1> */}
      </div>
    </Grid>
  );
};
