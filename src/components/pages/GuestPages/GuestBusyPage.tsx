import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase";
import useLogin from "../../../Hooks/useLogin";
import { taskCollectionType } from "../../../types/taskTypes";
import { activeUsersCollectionType } from "../../../types/userStateType";

type PropsType = {
  activeUserInfo: activeUsersCollectionType;
};

const GuestBusyPage = (props: PropsType) => {
  const { activeUserInfo } = props;
  const [ptrTask, setPtrTask] = useState<taskCollectionType>(
    {} as taskCollectionType
  );
  const { onLogout } = useLogin();

  useEffect(() => {
    if (activeUserInfo.userTaskState.currentTask) {
      const unSub = onSnapshot(
        doc(db, "tasks", activeUserInfo.userTaskState.currentTask),
        (snapShot) => {
          if (snapShot.exists()) {
            setPtrTask({
              ...snapShot.data,
              id: snapShot.id,
            } as taskCollectionType);
          }
        }
      );
      return () => {
        unSub();
        onLogout();
      };
    }
  }, []);

  return <div>今のタスクは{ptrTask.info.title}</div>;
};

export default GuestBusyPage;
