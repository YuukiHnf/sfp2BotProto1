import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";

import MyHeader from "../organisms/Header";

const AdminTaskPage = () => {
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
      <div>AdminTaskPage</div>
    </>
  );
};

export default AdminTaskPage;
