import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";
import {
  taskCollectionType,
  taskParamCollectionType,
} from "../../types/taskTypes";
import TaskBlock1 from "../modules/TaskBlock1";

//擬似的なFirestoreからの入力
const inputTaskstate: Array<taskCollectionType> = [
  {
    id: "A1",
    info: {
      title: "ゴミ拾い",
      desc: "拾う",
      createdat: "",
      imageUrl: "",
    },
  },
];

const AdminPage = () => {
  const user = useAppSelector(selectUser);
  const history = useHistory();

  const [tasks, setTasks] = useState<Array<taskCollectionType>>([]);
  // const [taskParams, setTaskParams] = useState<Array<taskParamCollectionType>>(
  //   []
  // );

  // const getTaskParams = (id: string) => {
  //   return taskParams.filter((task) => task.id === id)[0];
  // };

  useEffect(() => {
    // もしLoginしていないのなら、Login画面に移す
    if (user.uid === "") {
      history.push("/");
    }

    setTasks(inputTaskstate);
    // setTaskParams(inputTaskParams);
  }, []);

  return (
    <>
      <h1>Home</h1>
      <div>
        {tasks.map((task) => (
          <TaskBlock1 task={task} />
        ))}
      </div>
    </>
  );
};

export default AdminPage;
