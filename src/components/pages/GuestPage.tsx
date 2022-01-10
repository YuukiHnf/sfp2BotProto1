import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, updateUserState } from "../../features/user/userSlicer";
import { db, getUserCollectionRef } from "../../firebase/firebase";
import useLogin from "../../Hooks/useLogin";
import { activeUsersCollectionType } from "../../types/userStateType";
import GuestBusyPage from "./GuestPages/GuestBusyPage";
import GuestFreePaga from "./GuestPages/GuestFreePaga";

const GuestPage = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  // const [activeUserState, setActiveUserState] =
  //   useState<activeUsersCollectionType>({} as activeUsersCollectionType);
  const { onLogout } = useLogin();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "activeUsers", user.uid), (userSnap) => {
      if (userSnap.exists()) {
        dispatch(
          updateUserState({
            state: userSnap.data().userTaskState.state,
            currentTask: userSnap.data().userTaskState.currentTask,
          })
        );
      }
    });
    return () => {
      unSub();
      onLogout();
    };
  }, []);

  return (
    <>
      <div>GUEST USER : {user.info.displayName}さん</div>

      {user.userTaskState.state === "busy" ? (
        <GuestBusyPage />
      ) : (
        <GuestFreePaga />
      )}
    </>
  );
};

export default GuestPage;
