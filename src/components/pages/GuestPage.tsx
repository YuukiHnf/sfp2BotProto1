import { doc, onSnapshot } from "firebase/firestore";
import { getToken } from "firebase/messaging";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, updateUserState } from "../../features/user/userSlicer";
import { db, getUserCollectionRef, messaging } from "../../firebase/firebase";
import useLogin from "../../Hooks/useLogin";
import { activeUsersCollectionType } from "../../types/userStateType";
import GuestBusyPage from "./GuestPages/GuestBusyPage";
import GuestFreePaga from "./GuestPages/GuestFreePaga";

const GuestPage = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

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
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted");

        getToken(messaging, {
          vapidKey: process.env.REACT_APP_FCM_VAPIDKEY,
        }).then((currentToken) => {
          if (currentToken) {
            // トークン取得成功
            console.log("currentToken:", currentToken);
          } else {
            console.log("[FCM] Token取得失敗");
          }
        });
      } else {
        console.log("Notification permission notify.");
      }
    });
    return () => {
      unSub();
    };
  }, []);

  return (
    <>
      <div>GUEST USER : {user.info.displayName}さん</div>
      <img
        src="https://msp.c.yimg.jp/images/v2/FUTi93tXq405grZVGgDqG29mKfDPUdcP3LGnVI6yE5FijAJDq9h2DXur7w3cZMFbaf3wbpF0Q3rIdTPVuRC-R_yKydiFfhnn2zaKsl29Z01rrPAVeYexiF5n7XDAxuOT3z6Ls1VWliBMDXKO8cr6Z1wg8FezC-TNk_qdv-dUWZLqJP_bQTU9cHyL7g-lJkbrKRBng-qcCkLU9S1fw0DqNa_76aSm2vIjFfKjoFJcusRuM3h2JlcxZXInyrTqixUZNrtCGJclQI67vI3EqkhKnVFi6jxHwKdG0AuupvEJCfY=/bot-icon-robot-logotype-flat-260nw-1497911912.jpg?errorImage=false"
        style={{ width: "30%", height: "auto" }}
      />

      {user.userTaskState.state === "busy" ? (
        <GuestBusyPage />
      ) : (
        <GuestFreePaga />
      )}
    </>
  );
};

export default GuestPage;
