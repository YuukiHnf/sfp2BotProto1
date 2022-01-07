import React, { useEffect } from "react";

type PropsType = {
  children: any;
  onFetch: () => void;
};

const BasicTableElement = (props: PropsType) => {
  const { children, onFetch } = props;

  useEffect(() => {}, []);

  return <td>{children}</td>;
};

export default BasicTableElement;
