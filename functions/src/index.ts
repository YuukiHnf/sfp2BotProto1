import * as functions from "firebase-functions";
import admin = require("firebase-admin");
admin.initializeApp();

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
 *  1:LoginをListenする
 * BATCH処理
 *  2:idを元に、activeUserに定義する
 *  3:userParamを取得して、isActiveをTrueにする
 * */
