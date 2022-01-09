import { Grid, makeStyles } from "@material-ui/core";
import { getDocs, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";
import { getTaskCollectionRef } from "../../firebase/firebase";
import {
  taskCollectionType,
  taskParamCollectionType,
} from "../../types/taskTypes";
import TaskBlock1 from "../modules/TaskBlock1";

//擬似的なFirestoreからの入力
// const inputTaskstate: Array<taskCollectionType> = [
//   {
//     id: "A1",
//     info: {
//       title: "ゴミ拾い",
//       desc: "拾う",
//       createdat: "",
//       imageUrl: "",
//     },
//   },
//   {
//     id: "A2",
//     info: {
//       title: "ゴミ拾い",
//       desc: "拾う",
//       createdat: "",
//       imageUrl: "",
//     },
//   },
//   {
//     id: "A3",
//     info: {
//       title: "ゴミ拾い",
//       desc: "拾う",
//       createdat: "",
//       imageUrl: "",
//     },
//   },
//   {
//     id: "A4",
//     info: {
//       title: "ゴミ拾い",
//       desc: "拾う",
//       createdat: "",
//       imageUrl: "",
//     },
//   },
// ];

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

  return (
    <>
      <h1>Home</h1>
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
