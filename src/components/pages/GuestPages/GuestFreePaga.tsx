import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlicer";

const GuestFreePaga = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <h2>{user.info.displayName}さんは今、</h2>
      <h1>休憩中</h1>
      <h2>です</h2>
    </>
  );
};

export default GuestFreePaga;
