import { Button } from "@material-ui/core";
import React, { memo, ReactChild, ReactNode } from "react";

type PropsType = {
  children: ReactChild;
  disabled: boolean;
  startIcon?: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Button1 = (props: PropsType) => {
  const { children, disabled, startIcon, onClick } = props;
  //console.log("button1");
  return (
    <div>
      <Button
        disabled={disabled}
        variant="contained"
        startIcon={startIcon}
        onClick={onClick}
        color="primary"
      >
        {children}
      </Button>
    </div>
  );
};

export default memo(Button1);
