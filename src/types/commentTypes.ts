import { FieldValue } from "firebase/firestore";

export type commentCollectionType = {
  commentId: string;
  text: string;
  avatarUrl: string;
  createdat: FieldValue;
  displayName: string;
};
