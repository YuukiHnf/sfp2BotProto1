import { TextField } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";
import {
  allTaskInfomatioinType,
  taskCollectionType,
  taskParamCollectionType,
  TaskStateType,
} from "../../types/taskTypes";
import Button1 from "../atoms/Button1";
import TextField1 from "../atoms/TextField1";

//乱数ID
function getUniqueStr(myStrong?: number): string {
  let strong = 1000;
  if (myStrong) strong = myStrong;
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  );
}

const tableColumns = ["ID", "状態", "内容", "所要時間"];

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
const inputTaskParams: Array<taskParamCollectionType> = [
  {
    id: "A1",
    timeCost: 10,
    afterDone: "A2",
    state: "ToDo",
    by: "1",
  },
];

const AdminTaskPage = () => {
  const user = useAppSelector(selectUser);
  const history = useHistory();

  // state input
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputImageUrl, setInputImageUrl] = useState("");
  const [inputTimeCost, setInputTimeCost] = useState(0);
  const [inputAfterDone, setInputAfterDone] = useState("");
  const [editedTask, setEditedTask] = useState<Array<allTaskInfomatioinType>>(
    []
  );

  // state tasks
  const [tasks, setTasks] = useState<Array<taskCollectionType>>([]);
  const [tasksParam, setTasksParam] = useState<Array<taskParamCollectionType>>(
    []
  );

  const createNewTask = () => {
    //firestoreに書き込み
    const tmpId = getUniqueStr().toString();
    // firestore Push
    //ここは自動なのでいらない
    const newTask: taskCollectionType = {
      id: tmpId,
      info: {
        title: inputTitle,
        imageUrl: inputImageUrl,
        createdat: "timeStamp",
        desc: inputDesc,
      },
    };
    const newTaskParam: taskParamCollectionType = {
      id: tmpId,
      timeCost: inputTimeCost,
      afterDone: inputAfterDone,
      state: "ToDo",
      by: "",
    };

    setTasks([...tasks, newTask]);
    setTasksParam([...tasksParam, newTaskParam]);
  };
  const isInputAllData = useCallback(() => {
    return (
      inputTitle.length !== 0 &&
      inputDesc.toString().length !== 0 &&
      inputTimeCost !== 0
    );
  }, []);

  useEffect(() => {
    // もしLoginしていないのなら、Login画面に移す
    if (user.uid === "" || !user.isAdmin) {
      history.push("/");
    }

    setTasks(inputTaskstate);
    setTasksParam(inputTaskParams);
  }, []);

  const getLocalTaskParam = (id: string) => {
    return tasksParam.filter((task) => task.id === id)[0];
  };
  return (
    <>
      <h1>AdminTaskPage</h1>
      <div>{}</div>
      <TextField1
        value={inputTitle}
        name={"title"}
        onChange={(e) => {
          setInputTitle(e.target.value);
        }}
      />
      <TextField1
        value={inputDesc}
        name={"desc"}
        onChange={(e) => {
          setInputDesc(e.target.value);
        }}
      />
      <TextField1
        value={inputTimeCost.toString()}
        name={"timeCost"}
        onChange={(e) => {
          setInputTimeCost(Number(e.target.value));
        }}
      />
      <TextField1
        value={inputImageUrl.toString()}
        name={"imageUrl"}
        onChange={(e) => {
          setInputImageUrl(e.target.value);
        }}
      />
      <TextField1
        value={inputAfterDone.toString()}
        name={"afterDone"}
        onChange={(e) => {
          setInputAfterDone(e.target.value);
        }}
      />
      <Button1
        disabled={isInputAllData()}
        startIcon={undefined}
        onClick={() => createNewTask()}
      >
        ADD
      </Button1>
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
              <td>{getLocalTaskParam(task.id).state}</td>
              <td>{task.info.title}</td>
              <td>{getLocalTaskParam(task.id).timeCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminTaskPage;
