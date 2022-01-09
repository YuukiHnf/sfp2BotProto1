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
      <img
        src={
          "https://msp.c.yimg.jp/images/v2/FUTi93tXq405grZVGgDqG29mKfDPUdcP3LGnVI6yE5FijAJDq9h2DXur7w3cZMFbaf3wbpF0Q3rIdTPVuRC-R_yKydiFfhnn2zaKsl29Z01rrPAVeYexiF5n7XDAxuOT3z6Ls1VWliBMDXKO8cr6Z1wg8FezC-TNk_qdv-dUWZLqJP_bQTU9cHyL7g-lJkbrKRBng-qcCkLU9S1fw0DqNa_76aSm2vIjFfKjoFJcusRuM3h2JlcxZXInyrTqixUZNrtCGJclQI67vI3EqkhKnVFi6jxHwKdG0AuupvEJCfY=/bot-icon-robot-logotype-flat-260nw-1497911912.jpg?errorImage=false"
        }
      />
      {user.userState.state === "busy" ? (
        <GuestBusyPage activeUserInfo={activeUserState} />
      ) : (
        <GuestFreePaga />
      )}
    </>
  );
};

export default GuestPage;
