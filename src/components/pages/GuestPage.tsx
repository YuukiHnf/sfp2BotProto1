import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlicer";

const GuestPage = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <div>GUEST USER</div>
      <p>current Task is {user.currentTask}</p>
    </>
  );
};

export default GuestPage;
