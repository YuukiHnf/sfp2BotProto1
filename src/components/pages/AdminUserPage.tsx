import React, { useEffect, useState } from "react";
import {
  activeUsersCollectionType,
  UserStateType,
} from "../../types/userStateType";
// import { stateUserType } from "../../features/user/userSlicer";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";
import { useHistory } from "react-router-dom";
import { onSnapshot } from "firebase/firestore";
import { getUserCollectionRef } from "../../firebase/firebase";

// 適宜UserStateTypeが追加されてTableが追加したい時は追加
type TableUserType = {
  uid: string;
  displayName: string;
  currentTask: string;
  state: UserStateType;
};

const tableColumns = ["ID", "Name", "State", "Task"];

const AdminUserPage: React.VFC = () => {
  const [activeUsers, setActiveUsers] = useState<
    Array<activeUsersCollectionType>
  >([]);
  const user = useAppSelector(selectUser);
  const history = useHistory();

  useEffect(() => {
    // もしLoginしていないのなら、Login画面に移す
    if (user.uid === "" || !user.isAdmin) {
      history.push("/");
    }

    // snapshotをstateに保存
    const unSub = onSnapshot(getUserCollectionRef, (usersSnap) => {
      setActiveUsers(
        usersSnap.docs.map(
          (snap) =>
            ({
              ...snap.data(),
              uid: snap.id,
            } as activeUsersCollectionType)
        )
      );
    });

    return () => {
      unSub();
    };
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

          {activeUsers.map((user) => (
            <tr key={user.uid}>
              <td>{user.uid}</td>
              <td>{user.info.displayName}</td>
              <td>{user.userState.state}</td>
              <td>{user.userState.currentTask}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminUserPage;
