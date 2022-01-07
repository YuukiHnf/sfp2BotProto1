import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";
import MyHeader from "../organisms/Header";

const AdminPage = () => {
  const user = useAppSelector(selectUser);
  const history = useHistory();

  useEffect(() => {
    // もしLoginしていないのなら、Login画面に移す
    if (user.uid === "") {
      history.push("/");
    }
  }, []);

  return (
    <>
      <div>Admin</div>
    </>
  );
};

export default AdminPage;
