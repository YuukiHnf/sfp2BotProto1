import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useAppSelector } from "../../app/hooks";
import {
  initialGlobalUserState,
  selectUser,
} from "../../features/user/userSlicer";
import useLogin from "../../Hooks/useLogin";
import { Box } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

type PropsType = {
  pages: Array<{ pageName: string; onClick: void }>;
};

const ButtonAppBar = () => {
  //const { pages } = props;
  const classes = useStyles();
  // state
  const user = useAppSelector(selectUser);
  //Login
  const { onLogout } = useLogin();
  // const [pages, setPages] = useState<
  //   Array<{ pageName: string; onClick: void }>
  // >([]);

  const history = useHistory();

  //console.log(pages);
  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="default"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            BOT-Work
          </Typography>
          {user.isAdmin && (
            <>
              <Box sx={{ flexGrow: 1 }}>
                <Button onClick={() => history.push("/")} color="inherit">
                  HOME
                </Button>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Button onClick={() => history.push("/users")} color="inherit">
                  USERS
                </Button>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Button onClick={() => history.push("/tasks")} color="inherit">
                  TASKS
                </Button>
              </Box>
            </>
          )}
          <Button color="secondary" onClick={onLogout}>
            Logout
          </Button>

          {/* {user !== initialGlobalUserState.user ?? (
            <Button color="default">Logout"</Button>
          )} */}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default ButtonAppBar;
