import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import AdminPage from "./components/pages/AdminPage";
import { Auth } from "./components/pages/Auth";
import GuestPage from "./components/pages/GuestPage";
import { initialGlobalUserState, selectUser } from "./features/user/userSlicer";
import Router, { Route, Switch, useHistory } from "react-router-dom";

import MyHeader from "./components/organisms/Header";
import AdminUserPage from "./components/pages/AdminUserPage";
import AdminTaskPage from "./components/pages/AdminTaskPage";
import { useEffect } from "react";

function App() {
  const user = useAppSelector(selectUser);

  const history = useHistory();
  //console.log(user);

  return (
    <>
      <MyHeader />
      {user === initialGlobalUserState.user ? (
        <>
          <Auth />
        </>
      ) : user.isAdmin ? (
        <Switch>
          <Route exact path="/">
            <AdminPage />
          </Route>
          <Route exact path="/users">
            <AdminUserPage />
          </Route>
          <Route exact path="/tasks">
            <AdminTaskPage />
          </Route>
          <Route path="*">
            <h1>404</h1>
          </Route>
        </Switch>
      ) : (
        <Switch>
          <GuestPage />
          <Route path="*">
            <h1>404</h1>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
