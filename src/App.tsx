import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  login,
  logout,
  selectUser,
  updateUserState,
} from "./features/user/userSlicer";
import { UserStateType } from "./types/userStateType";

function App() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  console.log(user);

  const onLogin = (isAdmin: boolean) => {
    dispatch(
      login({
        dbUser: {
          uid: "1",
          username: "yuki",
          email: "string",
          password: "string",
          photoURL: "string",
          isAnonymous: false,
        },
        isAdmin: isAdmin,
      })
    );
  };

  const onUpdateState = (state: UserStateType) => {
    if (user.uid) {
      dispatch(updateUserState(state));
    }
  };

  const onLogout = () => {
    dispatch(logout(undefined));
  };

  return (
    <>
      <div>App</div>
      <br />
      <button onClick={() => onLogin(false)}>LOGIN</button>
      <br />
      <button onClick={() => onLogin(true)}>LOGIN as Admin</button>
      <br />
      <button onClick={() => onUpdateState({ state: "free" })}>
        State change Free
      </button>
      <br />
      <button onClick={() => onUpdateState({ state: "busy" })}>
        State change Busy
      </button>
      <br />
      <button onClick={onLogout}>LOGOUT</button>
    </>
  );
}

export default App;
