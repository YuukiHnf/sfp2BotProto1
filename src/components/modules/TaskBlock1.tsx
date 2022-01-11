import { useEffect, useState } from "react";
import {
  taskCollectionType,
  taskParamCollectionType,
} from "../../types/taskTypes";

//MaterialUI v4
import Card from "@material-ui/core/Card";
import {
  Avatar,
  Button,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  makeStyles,
  Theme,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";
import { commentCollectionType } from "../../types/commentTypes";
import CommentBlock1 from "./CommentBlock1";
import { db, functions } from "../../firebase/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

type PropsType = {
  task: taskCollectionType;
  //   param: taskParamCollectionType | null;
};

const useStyles = (theme: Theme) => {
  return makeStyles({
    card: {
      maxWidth: 400,
    },
    content: {
      marginTop: theme.spacing(1),
    },
  });
};

const TaskBlock1 = (props: PropsType) => {
  const { task } = props;
  const [param, setParam] = useState<taskParamCollectionType>(
    {} as taskParamCollectionType
  );
  const applyTask2User = httpsCallable(functions, "applyTask2User");

  const [showComment, setShowComment] = useState(false);

  let theme = useTheme();
  let styles = useStyles(theme)();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "taskParams", task.id), (taskSnap) => {
      if (taskSnap.exists()) {
        setParam({
          ...taskSnap.data(),
          id: taskSnap.id,
        } as taskParamCollectionType);
      }
    });
    return () => {
      unSub();
    };
  }, []);

  const onClickDone = async () => {
    await applyTask2User({
      params: { uid: task.by.uid, taskId: task.id, taskState: "Done" },
    });
  };

  const state2Color = () => {
    if (param.state === "ToDo") {
      return "white";
    } else if (param.state === "Waiting") {
      return "red";
    } else if (param.state === "Doing") {
      return "green";
    } else if (param.state === "DoingChat") {
      return "yellow";
    } else if (param.state === "Done") {
      return "blue";
    }
  };

  return (
    <>
      <Card className={styles.card}>
        <CardHeader
          title={`state : ${param.state ?? "waiting..."}`}
          subheader={`担当者:${task.by.displayName ?? "未割り当て"}`}
          avatar={
            <Avatar>
              <Person></Person>
            </Avatar>
          }
          style={{ backgroundColor: state2Color() }}
        ></CardHeader>
        <CardContent>
          {param.state === "Waiting" && (
            <button onClick={() => onClickDone()}>完了許可を出す</button>
          )}
          <Typography variant="h4">{task.info.title}</Typography>
          <Typography variant="subtitle1">
            {param?.state} : (Cost -{param.timeCost ?? "waiting..."})
          </Typography>
          <Typography className={styles.content}>
            説明 : {task.info.desc}
          </Typography>
          <Button
            size="small"
            onClick={() => {
              setShowComment((trueOrfalse) => !trueOrfalse);
            }}
          >
            {showComment ? "コメントを閉じる" : "コメントを見る"}
          </Button>
        </CardContent>

        {showComment && <CommentBlock1 id={task.id} />}
      </Card>
    </>
  );
};

export default TaskBlock1;
