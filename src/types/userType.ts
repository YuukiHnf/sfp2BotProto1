//FirebaseのAuthUserの情報

export type DBUserType = {
  uid: string;
  username: string;
  email?: string;
  password?: string;
  photoURL: string;
  isAnonymous: boolean;
};
