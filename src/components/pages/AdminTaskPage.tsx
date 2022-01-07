import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";
import { TaskStateType } from "../../types/taskTypes";

import MyHeader from "../organisms/Header";

type TableTaskType = {
  id: string;
  taskState: TaskStateType;
  timeCost: Number;
  info: {
    title: string;
    desc: string;
    imageUrl: string;
  };
};

const tableColumns = ["ID", "状態", "内容", "説明", "所要時間"];

const AdminTaskPage = () => {
  const user = useAppSelector(selectUser);
  const history = useHistory();

  // state input
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputImageUrl, setInputImageUrl] = useState("");
  const [inputTimeCost, setInputTimeCost] = useState(0);

  // state tasks
  const [tasks, setTasks] = useState<Array<TableTaskType>>([
    {
      id: "a1",
      taskState: "ToDo",
      timeCost: 10,
      info: {
        title: "本を動かす",
        desc: "本を丸々から丸々へ動かす",
        imageUrl: "",
      },
    },
  ]);

  useEffect(() => {
    // もしLoginしていないのなら、Login画面に移す
    if (user.uid === "" || !user.isAdmin) {
      history.push("/");
    }
  }, []);
  return (
    <>
      <h1>AdminTaskPage</h1>
      <table style={{ border: "1", width: "200", padding: "10" }}>
        <tbody>
          <tr>
            {tableColumns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>

          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.taskState}</td>
              <td>{task.info.title}</td>
              <td>{task.info.desc}</td>
              <td>{task.timeCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminTaskPage;
