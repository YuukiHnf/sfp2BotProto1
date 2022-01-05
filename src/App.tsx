import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import AdminPage from "./components/pages/AdminPage";
import { Auth } from "./components/pages/Auth";
import GuestPage from "./components/pages/GuestPage";
import { initialGlobalUserState, selectUser } from "./features/user/userSlicer";
import { UserStateType } from "./types/userStateType";
import MyHeader from "./components/organisms/Header";

function App() {
  const user = useAppSelector(selectUser);
  console.log(user);
  return (
    <>
      <MyHeader />
      {user === initialGlobalUserState.user ? (
        <Auth />
      ) : user.isAdmin ? (
        <AdminPage />
      ) : (
        <GuestPage />
      )}
    </>
  );
}

export default App;
