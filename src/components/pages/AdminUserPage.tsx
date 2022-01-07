import React, { useEffect, useState } from "react";

import MaterialTable from "material-table";
import {
  activeUsersCollectionType,
  userParamsCollectionType,
  UserStateType,
} from "../../types/userStateType";
// import { stateUserType } from "../../features/user/userSlicer";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";
import { useHistory } from "react-router-dom";

// activeUserからデータをもらう例
const inputActiveUserData: Array<activeUsersCollectionType> = [
  {
    uid: "1",
    info: {
      photoUrl: "",
      displayName: "takashi",
    },
    isAdmin: false,
  },
  {
    uid: "2",
    info: {
      photoUrl: "",
      displayName: "tomoko",
    },
    isAdmin: false,
  },
  {
    uid: "3",
    info: {
      photoUrl: "",
      displayName: "yoshio",
    },
    isAdmin: false,
  },
];

const inputUserParams: Array<userParamsCollectionType> = [
  {
    uid: "1",
    userState: {
      state: "busy",
      currentTask: "A",
    },
    isActive: true,
  },
  {
    uid: "2",
    userState: {
      state: "free",
      currentTask: "",
    },
    isActive: true,
  },
  {
    uid: "3",
    userState: {
      state: "busy",
      currentTask: "N",
    },
    isActive: true,
  },
];

// 適宜UserStateTypeが追加されてTableが追加したい時は追加
type TableUserType = {
  uid: string;
  displayName: string;
  currentTask: string;
  state: UserStateType;
};

// const tableColumns = [
//   { title: "ID", field: "uid" },
//   { tilte: "Name", field: "displayName" },
//   { title: "Task", field: "currentTask" },
//   { title: "State", field: "state" },
// ];
const tableColumns = ["ID", "Name", "State", "Task"];

const AdminUserPage: React.VFC = () => {
  const [showData, setShowData] = useState<Array<TableUserType>>([
    {
      uid: "a",
      displayName: "username",
      state: "free",
      currentTask: "Clean Room!",
    },
  ]);
  const user = useAppSelector(selectUser);
  const history = useHistory();

  useEffect(() => {
    // もしLoginしていないのなら、Login画面に移す
    if (user.uid === "" || !user.isAdmin) {
      history.push("/");
    }
    // activeUserのテーブルを取ってきたとする。
    // その後、状況をuidにしたがって取ってくる. （本当はこのくらいのデータは同一で保管しておきたい

    //firebaseのactiveUserとそのtaskを取ってくる clientSideJoin
    setShowData(
      inputActiveUserData.map((user) => ({
        uid: user.uid,
        displayName: user.info.displayName,
        state: inputUserParams.filter((param) => param.uid === user.uid)[0]
          .userState.state,
        currentTask: inputUserParams.filter(
          (param) => param.uid === user.uid
        )[0].userState.currentTask,
      }))
    );
  }, []);

  return (
    <>
      <h1>UserPage</h1>
      <table style={{ border: "1", width: "200", padding: "10" }}>
        <tbody>
          <tr>
            {tableColumns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>

          {showData.map((data) => (
            <tr key={data.uid}>
              <td>{data.uid}</td>
              <td>{data.displayName}</td>
              <td>{data.state}</td>
              <td>{data.currentTask}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <MaterialTable
        columns={tableColumns}
        data={showData}
        options={{ showTitle: false }}
      /> */}
    </>
  );
};

export default AdminUserPage;
