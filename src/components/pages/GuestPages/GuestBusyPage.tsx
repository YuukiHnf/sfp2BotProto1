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
import { httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlicer";
import { db, functions } from "../../../firebase/firebase";
import useLogin from "../../../Hooks/useLogin";
import { taskCollectionType } from "../../../types/taskTypes";
import { activeUsersCollectionType } from "../../../types/userStateType";
import Button1 from "../../atoms/Button1";
import CommentBlock1 from "../../modules/CommentBlock1";

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
  const applyTask2User = httpsCallable(functions, "applyTask2User");
  const { onLogout } = useLogin();

  const onClickWaiting = async () => {
    await applyTask2User({
      params: { uid: user.uid, taskId: ptrTask.id, taskState: "Waiting" },
    });
  };

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
          {ptrTask.state === "Doing" || ptrTask.state === "DoingChat" ? (
            <>
              <Typography variant="h4">{ptrTask.info.desc}</Typography>
              <Button1
                disabled={false}
                startIcon={<Icon />}
                onClick={() => {
                  onClickWaiting();
                }}
              >
                完了報告する!
              </Button1>
              <br />
              {user.userTaskState.currentTask && (
                <CommentBlock1 id={user.userTaskState.currentTask} />
              )}
            </>
          ) : (
            <>
              <p>チェック中です....</p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default GuestBusyPage;
