import React, { useEffect, useState } from "react";
import {
  taskCollectionType,
  taskParamCollectionType,
} from "../../types/taskTypes";

//MaterialUI v4
import Card from "@material-ui/core/Card";
import {
  Avatar,
  CardContent,
  CardHeader,
  makeStyles,
  Theme,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";

type PropsType = {
  task: taskCollectionType;
  //   param: taskParamCollectionType | null;
};

// ぎじFirestore
const inputTaskParams: Array<taskParamCollectionType> = [
  {
    id: "A1",
    timeCost: 10,
    afterDone: "A2",
    state: "ToDo",
    by: "1",
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
  const [params, setParams] = useState<taskParamCollectionType | null>(null);
  let theme = useTheme();
  let styles = useStyles(theme)();

  useEffect(() => {
    setParams(inputTaskParams[0]);
  }, []);

  return (
    <>
      <Card className={styles.card}>
        <CardHeader
          title="Hoge氏"
          subheader="住所不定"
          avatar={
            <Avatar>
              <Person></Person>
            </Avatar>
          }
        ></CardHeader>
        <CardContent>
          <Typography variant="h4">{task.info.title}</Typography>
          <Typography variant="subtitle1">
            {params?.state} : (Cost -{params?.timeCost})
          </Typography>
          <Typography className={styles.content}>
            説明 : {task.info.desc}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default TaskBlock1;
