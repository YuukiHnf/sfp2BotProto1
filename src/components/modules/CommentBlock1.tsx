import { Avatar, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { commentCollectionType } from "../../types/commentTypes";
import styles from "./CommentBlock1.module.css";

//materialUI
import SendIcon from "@material-ui/icons/Send";

type PropsType = {
  id: string;
};

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

const inputStartComments: Array<commentCollectionType> = [
  {
    commentId: "c1",
    text: "hello",
    avatarUrl:
      "https://firebasestorage.googleapis.com/v0/b/twitter-cloneapp-2c188.appspot.com/o/avatar%2F0.3bhndevu9y2_avatar1.png?alt=media&token=42547298-4ca8-417c-aa9f-509f916160e0",
    createdAt: "12:00",
    displayName: "Tsuji",
  },
];

function getUniqueStr(myStrong?: number): string {
  let strong = 1000;
  if (myStrong) strong = myStrong;
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  );
}

const CommentBlock1 = (props: PropsType) => {
  const { id } = props;
  const [comments, setComments] = useState<Array<commentCollectionType>>([]);
  const [inputComment, setInputComment] = useState("");

  const classes = useStyles();

  useEffect(() => {
    setComments(inputStartComments);
  }, []);

  const submitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newComment: commentCollectionType = {
      commentId: getUniqueStr(),
      text: inputComment,
      createdAt: "12:01",
      displayName: "Yuki",
      avatarUrl:
        "https://firebasestorage.googleapis.com/v0/b/twitter-cloneapp-2c188.appspot.com/o/avatar%2F0.3bhndevu9y2_avatar1.png?alt=media&token=42547298-4ca8-417c-aa9f-509f916160e0",
    };
    setComments([...comments, newComment]);
    setInputComment("");
  };
  //console.log(comments);
  return (
    <>
      {comments &&
        comments.map((com) => (
          <div key={com.commentId}>
            <Avatar src={com.avatarUrl} className={classes.small} />

            <span>{com.displayName} </span>
            <span>@{com.createdAt} : </span>
            <span>{com.text} </span>
          </div>
        ))}

      <form onSubmit={submitComment}>
        <input
          className={styles.post_input}
          type="text"
          placeholder="Type new comment..."
          value={inputComment}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInputComment(e.target.value);
          }}
        />
        <button
          disabled={!inputComment}
          className={
            inputComment ? styles.post_button : styles.post_buttonDisable
          }
          type="submit"
        >
          <SendIcon className={styles.post_sendIcon} />
        </button>
      </form>
    </>
  );
};

export default CommentBlock1;
