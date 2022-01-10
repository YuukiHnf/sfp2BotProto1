import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Icon,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlicer";
import { db } from "../../../firebase/firebase";
import useLogin from "../../../Hooks/useLogin";
import { taskCollectionType } from "../../../types/taskTypes";
import { activeUsersCollectionType } from "../../../types/userStateType";
import Button1 from "../../atoms/Button1";

type PropsType = {
  //activeUserInfo: activeUsersCollectionType;
};

const GuestBusyPage = (props: PropsType) => {
  //const { activeUserInfo } = props;
  const user = useAppSelector(selectUser);
  const [ptrTask, setPtrTask] = useState<taskCollectionType>({
    id: "",
    info: {
      title: "",
      desc: "",
      imageUrl: "",
      createdat: serverTimestamp(),
    },
    by: {
      uid: "",
      displayName: "",
      avatarUrl: "",
    },
  } as taskCollectionType);
  const { onLogout } = useLogin();

  useEffect(() => {
    if (user.userTaskState.currentTask) {
      const unSub = onSnapshot(
        doc(db, "tasks", user.userTaskState.currentTask),
        (snapShot) => {
          if (snapShot.exists()) {
            setPtrTask({
              ...snapShot.data(),
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
  }, [user.userTaskState.currentTask]);

  console.log("ptrTask", ptrTask);

  return (
    <>
      <h2>{user.info.displayName}さんには</h2>
      <h1>{ptrTask.info.title ?? ""}</h1>
      <h2>して欲しい!!</h2>
      <Card>
        <CardHeader
          title={`${ptrTask.info.title}` ?? ""}
          subheader={"実行委員Aさんより"}
          avatar={
            <Avatar>
              <Person></Person>
            </Avatar>
          }
        ></CardHeader>
        <CardContent>
          <Typography variant="h4">{ptrTask.info.desc}</Typography>
          <Button1
            disabled={false}
            startIcon={<Icon />}
            onClick={() => {
              console.log("完了");
            }}
          >
            完了報告する!
          </Button1>
        </CardContent>
      </Card>
    </>
  );
};

export default GuestBusyPage;
