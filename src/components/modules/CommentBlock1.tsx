import { Avatar, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { commentCollectionType } from "../../types/commentTypes";
import styles from "./CommentBlock1.module.css";

//materialUI
import SendIcon from "@material-ui/icons/Send";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getTaskCollectionRef } from "../../firebase/firebase";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";

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

// const inputStartComments: Array<commentCollectionType> = [
//   {
//     commentId: "c1",
//     text: "hello",
//     avatarUrl:
//       "https://firebasestorage.googleapis.com/v0/b/twitter-cloneapp-2c188.appspot.com/o/avatar%2F0.3bhndevu9y2_avatar1.png?alt=media&token=42547298-4ca8-417c-aa9f-509f916160e0",
//     createdat: serverTimestamp(),
//     displayName: "Tsuji",
//   },
// ];

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
  const user = useAppSelector(selectUser);

  const classes = useStyles();

  useEffect(() => {
    // 所望のDocument Refを取得
    const taskDocRef = doc(getTaskCollectionRef, id);
    // SubCollectionの取得
    const subCollection = collection(taskDocRef, "comments");

    const q = query(subCollection, orderBy("createdat", "asc"));

    const unSub = onSnapshot(q, (querySnashot) => {
      setComments(
        querySnashot.docs.map((snap) => {
          console.log(snap.data());
          return {
            commentId: snap.id,
            text: snap.data().text,
            avatarUrl: snap.data().avatarUrl,
            createdat: snap.data().createdat,
            displayName: snap.data().displayName,
          };
        })
      );
    });

    // setComments(inputStartComments);
    return () => {
      unSub();
    };
  }, []);

  const submitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newComment: Omit<commentCollectionType, "commentId"> = {
      text: inputComment,
      createdat: serverTimestamp(),
      displayName: user.info.displayName ?? "",
      avatarUrl: user.info.photoUrl ?? "",
    };
    // subCollectionへの追加
    const taskDocRef = doc(getTaskCollectionRef, id);
    // SubCollectionの取得
    const subCollection = collection(taskDocRef, "comments");
    // 追加
    const docRef = await addDoc(subCollection, newComment);
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
            {/* <span>@{com.createdat} : </?span> */}
            <span>{com.text}</span>
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
