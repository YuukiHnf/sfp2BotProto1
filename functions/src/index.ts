import * as functions from "firebase-functions";

//adminでfirestoreやauthにアクセス権限を持つ
import admin = require("firebase-admin");
// cloudFunctionは秘密鍵が要らないので、これでいいはず
admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// tutorial https://firebase.google.com/docs/functions/get-started?hl=ja
// textパラメータによるrequestのリスナー
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // queryの取得
  const original = req.query.text;
  const writeResult = await admin
    .firestore()
    .collection("testMessage")
    .add({ original: original });
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

/** /message/:documentId/originalを作って、それ以外に /message/:documentId/uppercaseを作る
 * {documentId}は「パラメータ」を囲む。いわゆるワイルドカードでの一致
 *  無限ループに注意
 *      ×同じパスに書き込む
 *      ○同じ結果が得られるもの
 */
exports.makeUppercase = functions.firestore
  .document("testMessage/{documentId}")
  .onCreate((snap, context) => {
    // 今のデータをとってくる
    const original: string = snap.data().original;
    // {documentId}のパラメータに対してアクセスするには、context.paramsを使う
    functions.logger.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();

    /**
     * 必ずPromiseで返すこと、
     * uppercaseフィールドをFirestoreに書き込む処理はPromiseがかかる
     * snap.ref.setはリッスン対象のドキュメントを定義する
     */
    return snap.ref.set({ uppercase }, { merge: true });
  });
