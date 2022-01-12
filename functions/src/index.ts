import * as functions from "firebase-functions";
import admin = require("firebase-admin");
// const firebase_tools = require("firebase-tools");
// import firebase_tools from "firebase-tools";
admin.initializeApp();

// cloudFunction用のDB
const adminDB = admin.firestore();
// taskのState状態
export type TaskStateType = "ToDo" | "Doing" | "DoingChat" | "Waiting" | "Done";

// firebaseのTask Collection
export type taskCollectionType = {
  id: string;
  info: {
    title: string;
    desc: string;
    imageUrl: string;
    createdat: any;
  };
  by: {
    uid: string;
    displayName: string;
    avatarUrl: string;
  };
};

//FirebaseのactiveUserDBのType
// user状態管理用Type
export type UserStateType = "free" | "busy";

// タスクに関する情報
export type UserTaskStateType = {
  state: UserStateType;
  currentTask: string;
};

export type activeUsersCollectionType = {
  uid: string;
  info: {
    avatarUrl: string;
    displayName: string;
  };
  userTaskState: UserTaskStateType;
  isAdmin: boolean;
};
//FirebaseのusrParamsDBのType
export type userParamsCollectionType = {
  uid: string;
  userState: {
    state: UserStateType;
    currentTask: string;
  };
  isActive: boolean;
};

// /** taskCollectionが削除された時にcomments SubCollectionが削除されるようにする関数
//  * https://firebase.google.com/docs/firestore/solutions/delete-collections
//  * 引数は path:
//  * 1, 削除をEventとして受け取る -> 本当は再起関数にする
//  * 2, SubCollectionを参照する
//  * 3, 消す
//  */
exports.deleteTask = functions.firestore
  .document("tasks/{taskID}")
  .onDelete(async (snap, context) => {
    //subCollectionの取得
    const subCollectionRef = adminDB.collection(
      `tasks/${context.params.taskID}/comments`
    );
    const snapshot = await subCollectionRef.get();
    // もしデータがない場合
    if (snapshot.size === 0) {
      return;
    }
    const batch = adminDB.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  });
// exports.recursizeDelete = functions
//   .runWith({
//     timeoutSeconds: 540,
//     memory: "2GB",
//   })
//   .https.onCall(async (data, context) => {
//     // Only allow admin users to execute this function.
//     if (!context.auth?.uid) {
//       throw new functions.https.HttpsError(
//         "permission-denied",
//         "Must be an administrative user to initiate delete."
//       );
//     }

//     const path = data.path;
//     console.log(
//       `User ${context.auth.uid} has requested to delete path ${path}`
//     );

//     // Run a recursive delete on the given document or collection path.
//     // The 'token' must be set in the functions config, and can be generated
//     // at the command line by running 'firebase login:ci'.
//     await firebase_tools.firestore.delete(path, {
//       project: process.env.GCLOUD_PROJECT,
//       recursive: true,
//       yes: true,
//       token:
//         "1//0e83V0aw4KC1DCgYIARAAGA4SNwF-L9IrFuRCbk666-cUUwlbQClBxBIrQdpm7mU4wapr7Eu1Ok93O1IA8tMujoSi6uba8yykLDM",
//     });

//     return {
//       path: path,
//     };
//   });

/** （Botが）仕事を割り当てるための関数
 * 1:引数に、userIDとtaskIDをもらう
 * 2:users, activeUsers, taskParams, tasksの全てをBatchで書き換える
 * (呼び出してもらう関数)
 */
exports.applyTask2User = functions.https.onCall(
  async (
    data: { params: { uid: string; taskId: string; taskState: TaskStateType } },
    context
  ) => {
    const { uid, taskId, taskState } = data.params;
    if (context.auth) {
      const batch = adminDB.batch();

      console.log(
        `[Apply] uid:${uid}@${typeof uid}, taskId:${taskId}@${typeof taskId}`
      );
      // 変更対象
      const userRef = adminDB.collection("activeUsers").doc(uid);
      const userParamRef = adminDB.collection("userParams").doc(uid);
      const taskRef = adminDB.collection("tasks").doc(taskId);
      const taskParamRef = adminDB.collection("taskParams").doc(taskId);

      // タスクを割り当てられた時のユーザ状態
      const userNewData = {
        userTaskState:
          taskState === "Done"
            ? { state: "free", currentTask: "" } //タスクが終わった時はこれ
            : { state: "busy", currentTask: taskId }, //タスクが途中または新規割り当ての時はこれ
      };

      // batch登録
      batch.update(userRef, userNewData);
      batch.update(userParamRef, userNewData);
      taskState === "Doing" &&
        batch.update(taskRef, {
          by: { uid: uid },
        }); //新規割り当ての時だけ & triggerしてdisplayNameなどを更新
      batch.update(taskParamRef, { state: taskState, by: uid });

      return batch
        .commit()
        .then(() => {
          console.log("[SUCCESS]applyTask2User");
          return { isOk: true };
        })
        .catch(() => {
          // error処理
          throw new functions.https.HttpsError(
            "unavailable",
            "batch処理ができなかった"
          );
        });
    } else {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "authが見つからなかった"
      );
    }
  }
);
/** taskのby: {Id}が変更された時,DisplayNameとphotoUrlを変更する
 *
 */
exports.synUpdateTaskId2UserInfo = functions.firestore
  .document("tasks/{taskId}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data() as taskCollectionType;
    const previousValue = change.before.data() as taskCollectionType;

    // ユーザ割り当てがなされて書き込む時、または、再割り当てされている時
    const isNeedSync =
      (newValue.by.uid && newValue.by.uid !== previousValue.by.uid) ||
      (newValue.by.uid === previousValue.by.uid &&
        newValue.by.displayName === "");

    if (isNeedSync) {
      const selectedUser = await adminDB
        .doc(`activeUsers/${newValue.by.uid}`)
        .get();
      if (selectedUser.data()) {
        const uData = (await selectedUser.data()) as activeUsersCollectionType;
        return change.after.ref.update({
          by: {
            uid: newValue.by.uid,
            displayName: uData.info.displayName,
            avatarUrl: uData.info.avatarUrl,
          },
        });
      }
    } else if (newValue.by.uid === "") {
      //ユーザが割り当てられなかった時
      return change.after.ref.update({
        by: {
          uid: newValue.by.uid,
          displayName: "",
          avatarUrl: "",
        },
      });
    }
    return null;
  });

/** ユーザが「email&password」でsignUpしたときに、そのユーザのdisplayNameなどを反映させ、その後、userParamを定義する
 * 1:AuthのCreateをリッスンする
 * 2:そのIdを元に、DisplayNameを... いや、Clientに情報があるから、これはClientに任せよう.
 * とりあえず、userParamの定義だけしよう
 */

exports.registerUserParamsListener = functions.auth
  .user()
  .onCreate(async (user) => {
    if (user) {
      await adminDB
        .collection("userParams")
        .doc(user.uid)
        .create({
          isActive: true,
          userTaskState: { currentTask: "", state: "free" },
        });
      functions.logger.log(
        "[CREATE User]",
        `${user.uid}`,
        `${user.displayName}`
      );
    }
  });

/** ユーザが「email&password」でdeleteしたときに、userParamを削除する
 * 1:Authのdeleteをリッスンする
 * 2:そのIdを元に、userParamを削除する
 */
exports.unregisterUserParamsListener = functions.auth
  .user()
  .onDelete(async (user) => {
    const writeResult = await admin
      .firestore()
      .collection("userParams")
      .doc(user.uid)
      .delete();

    functions.logger.log(
      "[DELETE User]",
      writeResult.writeTime,
      `${user.displayName}`
    );
  });

/** ユーザがLoginしたときに、Active User Collectionに追加して
 *      そのユーザのuserParamをisActiveにする
 *  1:LoginをListenする //今回はclientから呼び出してもらう
 * BATCH処理
 *  2:idを元に、activeUserに定義する
 *  3:userParamを取得して、isActiveをTrueにする
 * */

exports.registerAsActiveUser = functions.https.onCall(async (data, context) => {
  const batch = adminDB.batch();
  if (context.auth) {
    const activeUsersRef = adminDB
      .collection("activeUsers")
      .doc(context.auth.uid); //doc(db, "activeUsers", usr.dbUser.uid);
    const userParamRef = adminDB.collection("userParams").doc(context.auth.uid); //doc(db, "userParams", usr.dbUser.uid);

    // activeUserへのreference
    batch.set(activeUsersRef, {
      userTaskState: {
        state: "free",
        currentTask: "",
      },
      info: {
        avatarUrl: context.auth.token.picture ?? "",
        displayName: context.auth.token.name ?? "",
      },
      isAdmin: true,
    });

    // userParamへのUpdate
    batch.update(userParamRef, {
      isActive: true,
      userTaskState: { currentTask: "", state: "free" },
    });

    // batch処理して、返す
    return batch
      .commit()
      .then(() => {
        console.log("[REGISTER-ActiveUser]");
        return { isOk: true };
      })
      .catch(() => {
        // error処理
        throw new functions.https.HttpsError(
          "unavailable",
          "batch処理ができなかった"
        );
      });
  } else {
    // error処理
    throw new functions.https.HttpsError(
      "failed-precondition",
      "authが見つからなかった"
    );
  }
});

/** ユーザがLogoutしたときに、Active User Collectionを削除して
 *      そのユーザのuserParamをisActive=falseにする
 *  1:LoginをListenする //今回はclientから呼び出してもらう
 * BATCH処理
 *  2:idを元に、activeUserから削除する
 *  3:userParamを取得して、isActiveをfalseにする
 * */

exports.unRegisterAsActiveUser = functions.https.onCall(
  async (data, context) => {
    const batch = adminDB.batch();
    if (data) {
      const activeUsersRef = adminDB.collection("activeUsers").doc(data.uid); //doc(db, "activeUsers", usr.dbUser.uid);
      const userParamRef = adminDB.collection("userParams").doc(data.uid); //doc(db, "userParams", usr.dbUser.uid);

      // activeUserへのreference
      batch.delete(activeUsersRef);

      // userParamへのUpdate
      batch.update(userParamRef, {
        isActive: false,
      });

      // batch処理して、返す
      return batch
        .commit()
        .then(() => {
          console.log("[REGISTER-ActiveUser]");
          return { isOk: true };
        })
        .catch(() => {
          // error処理
          throw new functions.https.HttpsError(
            "unavailable",
            "batch処理ができなかった"
          );
        });
    } else {
      // error処理
      throw new functions.https.HttpsError(
        "failed-precondition",
        "authが見つからなかった"
      );
    }
  }
);
