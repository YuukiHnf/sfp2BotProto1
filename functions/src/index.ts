import * as functions from "firebase-functions";
import admin = require("firebase-admin");
admin.initializeApp();

// cloudFunction用のDB
const adminDB = admin.firestore();

/** ユーザが「email&password」でsignUpしたときに、そのユーザのdisplayNameなどを反映させ、その後、userParamを定義する
 * 1:AuthのCreateをリッスンする
 * 2:そのIdを元に、DisplayNameを... いや、Clientに情報があるから、これはClientに任せよう
 */

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
        avatarUrl: context.auth.token.picture,
        displayName: context.auth.token.name,
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
