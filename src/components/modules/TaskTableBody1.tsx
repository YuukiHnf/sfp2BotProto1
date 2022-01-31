import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  taskCollectionType,
  taskParamCollectionType,
} from "../../types/taskTypes";

type PropsType = {
  task: taskCollectionType;
  onClickEdit: (
    arg0: taskCollectionType,
    arg1: taskParamCollectionType
  ) => void;
  onClickDelete: (arg0: string) => void;
};

const TaskTableBody1 = (props: PropsType) => {
  const { task, onClickEdit, onClickDelete } = props;
  const [param, setParam] = useState<taskParamCollectionType>();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "taskParams", task.id), (docSnap) => {
      if (docSnap.exists()) {
        setParam({
          ...docSnap.data(),
          id: docSnap.id,
        } as taskParamCollectionType);
      }
    });
    return () => {
      unSub();
    };
  }, []);

  return (
    <tr>
      <td>{task.id}</td>
      <td>
        {task.info.title}
        {/* {task.info.title} @ {task.info.createdat} */}
      </td>
      <td>{param && param.state}</td>
      <td>{task.info.desc}</td>
      <td>{param && param.timeCost}</td>
      <td>
        {param &&
          param.afterDone.length !== 0 &&
          `${param.afterDone}が終わった後`}
      </td>
      <td>
        {param && (
          <button onClick={() => onClickEdit(task, param)}>EDIT</button>
        )}
      </td>
      <td>
        <button onClick={() => onClickDelete(task.id)}>DELE</button>
      </td>
    </tr>
  );
};

export default TaskTableBody1;
