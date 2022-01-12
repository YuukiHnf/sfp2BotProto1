import {
  doc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import React, { useCallback, useEffect, useState } from "react";
import { batch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { login, selectUser } from "../../features/user/userSlicer";
import {
  db,
  functions,
  getTaskCollectionRef,
  getTaskParamCollectionRef,
} from "../../firebase/firebase";
import useLogin from "../../Hooks/useLogin";
import {
  allTaskInfomatioinType,
  taskCollectionType,
  taskParamCollectionType,
  TaskStateType,
} from "../../types/taskTypes";
import Button1 from "../atoms/Button1";
import TextField1 from "../atoms/TextField1";
import TaskTableBody1 from "../modules/TaskTableBody1";

const tableColumns = [
  "ID",
  "タイトル",
  "状態",
  "内容",
  "所要時間",
  "順序",
  "編集",
  "削除",
];

const AdminTaskPage = () => {
  const user = useAppSelector(selectUser);
  const history = useHistory();
  const { onLogout } = useLogin();

  // state input
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputImageUrl, setInputImageUrl] = useState("");
  const [inputTimeCost, setInputTimeCost] = useState(0);
  const [inputAfterDone, setInputAfterDone] = useState("");
  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);

  // state tasks
  const [tasks, setTasks] = useState<Array<taskCollectionType>>([]);

  // delete関数
  // const deleteFn = httpsCallable(functions, "recursizeDelete");

  const onClickCreateOrUpdateButton = async () => {
    // //firestoreに書き込み
    const newTaskData: Omit<taskCollectionType, "id"> = {
      state: "ToDo",
      info: {
        title: inputTitle,
        imageUrl: inputImageUrl,
        createdat: serverTimestamp(),
        desc: inputDesc,
      },
      by: {
        uid: "",
        displayName: "",
        avatarUrl: "",
      },
    };
    const newTaskParamData: Omit<taskParamCollectionType, "id"> = {
      timeCost: inputTimeCost,
      afterDone: inputAfterDone,
      state: "ToDo",
      by: "",
    };
    if (!editedTaskId) {
      /** 新規作成
       * tasks コレクションと taskParams コレクションの二つを同時に更新したい。
       *   このデータの一貫性は担保したい
       *   新規に追加するだけ
       * よってWriteができるバッチ処理を行う
       */

      try {
        // 新しい書き込みバッチの生成
        const batch = writeBatch(db);

        // 新しいtask DocumentとそのIdを作る
        const newTaskRef = doc(getTaskCollectionRef);
        // Idを反映させたtaskParam Documentを作る
        const newTaskParamRef = doc(db, "taskParams", newTaskRef.id);

        // バッチ更新
        batch.set(newTaskRef, newTaskData);
        batch.set(newTaskParamRef, newTaskParamData);

        // バッチをコミットする
        await batch.commit();
      } catch (e) {
        alert(`[My-CREATE-Error]:${e}`);
      }
    } else {
      /** 編集
       * tasks コレクションと taskParams コレクションの二つを同時に更新したい。
       * 　　このデータの一貫性は担保したい
       * 　　今は tasks の snapshot しか持っていない
       * よってReadとWriteが両方できるトランザクション処理を行う気もしたけど、Idが自明なのでバッチ処理でいいのではないか
       */
      try {
        // 新しい書き込みバッチの生成
        const batch = writeBatch(db);

        // 新しいtask DocumentとそのIdを作る
        const newTaskRef = doc(db, "tasks", editedTaskId);
        // Idを反映させたtaskParam Documentを作る
        const newTaskParamRef = doc(db, "taskParams", editedTaskId);

        // バッチ更新
        batch.set(newTaskRef, newTaskData);
        batch.set(newTaskParamRef, newTaskParamData);

        // バッチをコミットする
        await batch.commit();
      } catch (e) {
        alert(`[My-Update-Error]:${e}`);
      }
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

  const onClickDelete = async (id: string) => {
    try {
      /** 削除
       * batchで削除する
       */

      const batch = writeBatch(db);
      // 本当はSub Collectionコメントを削除しないといけない

      // task collection の削除
      //await deleteDoc(doc(db, "tasks", id));
      batch.delete(doc(db, "tasks", id));
      // deleteFn({ path: `tasks/${id}` });
      // taskParam collection の削除
      // await deleteDoc(doc(db, "taskParams", id));
      batch.delete(doc(db, "taskParams", id));

      await batch.commit();
    } catch (e) {
      alert(`[My-DELETE-Error]:${e}`);
    }
  };

  // こいつはまだ編集可能にするだけ
  const onClickEdit = (
    task: taskCollectionType,
    _taskParam: taskParamCollectionType
  ) => {
    setInputAfterDone(_taskParam.afterDone);
    setInputDesc(task.info.desc);
    setInputImageUrl(task.info.desc);
    setInputTimeCost(_taskParam.timeCost);
    setInputTitle(task.info.title);
    setEditedTaskId(task.id);
  };
  //全てのinputStateを空にする
  const onClearAllLocalState = () => {
    setInputAfterDone("");
    setInputDesc("");
    setInputImageUrl("");
    setInputTimeCost(0);
    setInputTitle("");
  };

  //console.log(tasks);
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
        onClick={() => onClickCreateOrUpdateButton()}
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

          {tasks.map(
            (task) =>
              task && (
                <TaskTableBody1
                  key={task.id}
                  task={task}
                  onClickEdit={onClickEdit}
                  onClickDelete={onClickDelete}
                />
              )
          )}
        </tbody>
      </table>
    </>
  );
};

export default AdminTaskPage;
