import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { login, logout, selectUser } from "./features/user/userSlicer";

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
      <button onClick={onLogout}>LOGOUT</button>
    </>
  );
}

export default App;
