import React, { useEffect, useState } from "react";

import MaterialTable from "material-table";
import { UserStateType } from "../../types/userStateType";
// import { stateUserType } from "../../features/user/userSlicer";
import { globalUserStateType } from "../../types/userStateType";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";
import { useHistory } from "react-router-dom";

// const inputUserData: Array<globalUserStateType> = [
//   {
//     uid: "1",
//     photoUrl:
//       "https://firebasestorage.googleapis.com/v0/b/twitter-cloneapp-2c188.appspot.com/o/avatar%2F0.3bhndevu9y2_avatar1.png?alt=media&token=42547298-4ca8-417c-aa9f-509f916160e0",
//     displayName: "userName",
//     state: { state: "free" },
//     isAdmin: false,
//     currentTask: "None",
//   },
//   {
//     uid: "1",
//     photoUrl:
//       "https://firebasestorage.googleapis.com/v0/b/twitter-cloneapp-2c188.appspot.com/o/avatar%2F0.3bhndevu9y2_avatar1.png?alt=media&token=42547298-4ca8-417c-aa9f-509f916160e0",
//     displayName: "userName",
//     state: { state: "free" },
//     isAdmin: false,
//     currentTask: "None",
//   },
//   {
//     uid: "2",
//     photoUrl:
//       "https://firebasestorage.googleapis.com/v0/b/twitter-cloneapp-2c188.appspot.com/o/avatar%2F0.3bhndevu9y2_avatar1.png?alt=media&token=42547298-4ca8-417c-aa9f-509f916160e0",
//     displayName: "userName",
//     state: { state: "free" },
//     isAdmin: false,
//     currentTask: "None",
//   },
//   {
//     uid: "2",
//     photoUrl:
//       "https://firebasestorage.googleapis.com/v0/b/twitter-cloneapp-2c188.appspot.com/o/avatar%2F0.3bhndevu9y2_avatar1.png?alt=media&token=42547298-4ca8-417c-aa9f-509f916160e0",
//     displayName: "userName",
//     state: { state: "free" },
//     isAdmin: false,
//     currentTask: "None",
//   },
// ];

// 適宜UserStateTypeが追加されてTableが追加したい時は追加
type TableUserType = {
  //info: Pick<stateUserType, "uid" | "displayName" | `currentTask`>;
  uid: string;
  displayName: string;
  currentTask: string;
  state: "free" | "busy";
};

const tableColumns = [
  { title: "ID", field: "uid" },
  { tilte: "Name", field: "displayName" },
  { title: "Task", field: "currentTask" },
  { title: "State", field: "state" },
];

const AdminUserPage: React.VFC = () => {
  const [showData, setShowData] = useState<Array<TableUserType>>([
    {
      uid: "a",
      displayName: "username",
      currentTask: "cleanRoom",
      state: "free",
    },
  ]);

  // useEffect(() => {
  //   // 本当はFirestoreから取ってくる
  //   setShowData(
  //     inputUserData.map((usr) => ({
  //       uid: usr.uid,
  //       displayName: usr.displayName,
  //       currentTask: usr.currentTask,
  //       state: usr.state,
  //     }))
  //   );
  // }, []);
  const user = useAppSelector(selectUser);
  const history = useHistory();

  useEffect(() => {
    // もしLoginしていないのなら、Login画面に移す
    if (user.uid === "" || !user.isAdmin) {
      history.push("/");
    }
  }, []);

  return (
    <>
      <MaterialTable
        columns={tableColumns}
        data={showData}
        options={{ showTitle: false }}
      />
      <div>AdminUserPage</div>
    </>
  );
};

export default AdminUserPage;
