import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";
import { db, getUserCollectionRef } from "../../firebase/firebase";
import useLogin from "../../Hooks/useLogin";
import { activeUsersCollectionType } from "../../types/userStateType";
import GuestBusyPage from "./GuestPages/GuestBusyPage";
import GuestFreePaga from "./GuestPages/GuestFreePaga";

const GuestPage = () => {
  const user = useAppSelector(selectUser);

  const [activeUserState, setActiveUserState] =
    useState<activeUsersCollectionType>({} as activeUsersCollectionType);
  const { onLogout } = useLogin();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "activeUsers", user.uid), (userSnap) => {
      setActiveUserState({
        ...userSnap.data(),
        uid: userSnap.id,
      } as activeUsersCollectionType);
    });
    return () => {
      unSub();
      onLogout();
    };
  }, []);

  return (
    <>
      <div>GUEST USER : {user.info.displayName}さん</div>

      {user.userState.state === "busy" ? (
        <GuestBusyPage activeUserInfo={activeUserState} />
      ) : (
        <GuestFreePaga />
      )}
    </>
  );
};

export default GuestPage;
