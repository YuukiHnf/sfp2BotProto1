import { TextField } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { login, selectUser } from "../../features/user/userSlicer";
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

const tableColumns = ["ID", "状態", "内容", "所要時間", "編集", "削除"];

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
  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);

  // state tasks
  const [tasks, setTasks] = useState<Array<taskCollectionType>>([]);
  const [tasksParam, setTasksParam] = useState<Array<taskParamCollectionType>>(
    []
  );

  const createNewTask = () => {
    //firestoreに書き込み
    if (!editedTaskId) {
      // 新規作成
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
    } else {
      const newTask: taskCollectionType = {
        id: editedTaskId,
        info: {
          title: inputTitle,
          imageUrl: inputImageUrl,
          createdat: "timeStamp",
          desc: inputDesc,
        },
      };
      const newTaskParam: taskParamCollectionType = {
        id: editedTaskId,
        timeCost: inputTimeCost,
        afterDone: inputAfterDone,
        state: "ToDo",
        by: "",
      };
      setTasks([...tasks.filter((task) => task.id !== editedTaskId), newTask]);
      setTasksParam([
        ...tasksParam.filter((task) => task.id !== editedTaskId),
        newTaskParam,
      ]);
      setEditedTaskId(null);
    }

    onClearAllLocalState();
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

  const getLocalTasks = (id: string) => {
    return tasks.filter((task) => task.id === id)[0];
  };

  const onClickDelete = (id: string) => {
    // 本当はFirebaseで更新するだけ
    setTasks([...tasks.filter((task) => task.id !== id)]);
    setTasksParam([...tasksParam.filter((task) => task.id !== id)]);
  };

  // こいつはまだ編集可能にするだけ
  const onClickEdit = (id: string) => {
    setInputAfterDone(getLocalTaskParam(id).afterDone);
    setInputDesc(getLocalTasks(id).info.desc);
    setInputImageUrl(getLocalTasks(id).info.desc);
    setInputTimeCost(getLocalTaskParam(id).timeCost);
    setInputTitle(getLocalTasks(id).info.title);
    setEditedTaskId(id);
  };

  const onClearAllLocalState = () => {
    setInputAfterDone("");
    setInputDesc("");
    setInputImageUrl("");
    setInputTimeCost(0);
    setInputTitle("");
  };
  return (
    <>
      <h1>AdminTaskPage</h1>
      <h2>{editedTaskId ? "EditExitTask" : "New Task"}</h2>
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
        {editedTaskId ? "Edit" : "ADD"}
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
              <td>
                <button onClick={() => onClickEdit(task.id)}>EDIT</button>
              </td>
              <td>
                <button onClick={() => onClickDelete(task.id)}>DELE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminTaskPage;
