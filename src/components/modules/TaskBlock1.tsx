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
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

type PropsType = {
  task: taskCollectionType;
  //   param: taskParamCollectionType | null;
};

// // ぎじFirestore
// const inputTaskParams: Array<taskParamCollectionType> = [
//   {
//     id: "A1",
//     timeCost: 10,
//     afterDone: "A2",
//     state: "ToDo",
//     by: "1",
//   },
//   {
//     id: "A2",
//     timeCost: 15,
//     afterDone: "",
//     state: "Done",
//     by: "3",
//   },
//   {
//     id: "A3",
//     timeCost: 10,
//     afterDone: "",
//     state: "Doing",
//     by: "1",
//   },
//   {
//     id: "A4",
//     timeCost: 20,
//     afterDone: "",
//     state: "DoingChat",
//     by: "2",
//   },
// ];

const inputComments: Array<commentCollectionType> = [
  {
    commentId: "bananbabds",
    text: "hello",
    avatarUrl:
      "https://firebasestorage.googleapis.com/v0/b/twitter-cloneapp-2c188.appspot.com/o/avatar%2F0.3bhndevu9y2_avatar1.png?alt=media&token=42547298-4ca8-417c-aa9f-509f916160e0",
    createdAt: "",
    displayName: "Tsuji",
  },
];

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
  const [params, setParams] = useState<taskParamCollectionType>(
    {} as taskParamCollectionType
  );

  const [showComment, setShowComment] = useState(false);

  let theme = useTheme();
  let styles = useStyles(theme)();

  useEffect(() => {
    (async () => {
      const paramRef = doc(db, "taskParams", task.id);
      const docSnap = await getDoc(paramRef);
      //console.log(paramSnapshot);
      if (docSnap.exists()) {
        setParams({
          ...docSnap.data(),
          id: docSnap.id,
        } as taskParamCollectionType);
      }
    })();
  }, []);

  const state2Color = () => {
    if (params.state === "ToDo") {
      return "white";
    } else if (params.state === "Waiting") {
      return "red";
    } else if (params.state === "Doing") {
      return "green";
    } else if (params.state === "DoingChat") {
      return "yellow";
    } else if (params.state === "Done") {
      return "blue";
    }
  };

  return (
    <>
      <Card className={styles.card}>
        <CardHeader
          title={`state : ${params.state ?? "waiting..."}`}
          subheader={`担当者:${task.by.displayName ?? "未割り当て"}`}
          avatar={
            <Avatar>
              <Person></Person>
            </Avatar>
          }
          style={{ backgroundColor: state2Color() }}
        ></CardHeader>
        <CardContent>
          <Typography variant="h4">{task.info.title}</Typography>
          <Typography variant="subtitle1">
            {params?.state} : (Cost -{params.timeCost ?? "waiting..."})
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
