import React from "react";
import {
  taskCollectionType,
  taskParamCollectionType,
} from "../../types/taskTypes";

type PropsType = {
  task: taskCollectionType;
  param: taskParamCollectionType | null;
};

const TaskBlock1 = (props: PropsType) => {
  const { task, param } = props;
  return <div></div>;
};

export default TaskBlock1;
