import { initializeApp } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const isEmulating = window.location.hostname === "localhost";
const storePort = 8080;
const storagePort = 9199;
const authPort = 9099;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: isEmulating ? "" : process.env.REACT_APP_FIREBASE_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: isEmulating
    ? ""
    : process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: isEmulating ? "" : process.env.REACT_APP_MESSAGEING_SENDER,
  appId: isEmulating ? "" : process.env.REACT_APP_FIREBASE_APIID,
  databaseURL: isEmulating ? "" : process.env.REACT_APP_FIREBASE_DATABASEURL,
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

if (isEmulating) {
  connectFirestoreEmulator(db, "localhost", storePort);
  connectAuthEmulator(auth, `http://localhost:${authPort}`);
  connectStorageEmulator(storage, "localhost", storagePort);
}

//タスク系
export const getTaskCollectionRef = collection(db, "tasks");
export const getTaskParamCollectionRef = collection(db, "taskParams");
export const getCommentCollectionRefByTaskId = (id: string) =>
  doc(db, "tasks", id, "comments");

// ユーザ系
export const getUserCollectionRef = collection(db, "activeUsers");
export const getUserParamCollectionRef = collection(db, "userParams");
