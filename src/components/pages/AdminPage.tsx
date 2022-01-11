import { Grid, makeStyles } from "@material-ui/core";
import { onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";
import { functions, getTaskCollectionRef } from "../../firebase/firebase";
import useLogin from "../../Hooks/useLogin";
import {
  taskCollectionType,
  taskParamCollectionType,
} from "../../types/taskTypes";
import TaskBlock1 from "../modules/TaskBlock1";

const useStyles = makeStyles((theme) => ({
  grid: {
    //margin: "auto",
    xs: 4,
    //lg: 3,
    //xl: 3,
    //maxWidth: 400,
  },
}));

const AdminPage: React.VFC = () => {
  const user = useAppSelector(selectUser);
  const history = useHistory();
  const classes = useStyles();
  const { onLogout } = useLogin();

  const [tasks, setTasks] = useState<Array<taskCollectionType>>([]);

  useEffect(() => {
    // もしLoginしていないのなら、Login画面に移す
    if (user.uid === "") {
      history.push("/");
    }

    const unSub = onSnapshot(getTaskCollectionRef, (taskSnaps) => {
      setTasks(
        taskSnaps.docs.map(
          (snap) => ({ ...snap.data(), id: snap.id } as taskCollectionType)
        )
      );
    });

    return () => {
      unSub();
    };
  }, []);

  //console.log(tasks);
  const [applyUserId, setApplyUserId] = useState("");
  const [applyTaskId, setApplyTaskId] = useState("");
  const applyTask2User = httpsCallable(functions, "applyTask2User");

  const onClickApply = async () => {
    await applyTask2User({
      params: { uid: applyUserId, taskId: applyTaskId, taskState: "Doing" },
    });
  };

  return (
    <>
      <h1>Home</h1>
      <p>USEID</p>
      <input
        type="text"
        value={applyUserId}
        onChange={(e) => {
          setApplyUserId(e.target.value);
        }}
      />
      <br />
      <p>TASKID</p>
      <input
        type="text"
        value={applyTaskId}
        onChange={(e) => {
          setApplyTaskId(e.target.value);
        }}
      />
      <br />
      <button onClick={() => onClickApply()}>Apply</button>
      <div>
        {/* {showComment ?? <CommentBlock1 id={task.id} />} */}
        <Grid container spacing={2}>
          {tasks &&
            tasks.map(
              (task) =>
                task && (
                  <Grid key={`task-${task.id}`} item xs={4}>
                    <TaskBlock1 task={task} />
                  </Grid>
                )
            )}
        </Grid>
      </div>
    </>
  );
};

export default AdminPage;
