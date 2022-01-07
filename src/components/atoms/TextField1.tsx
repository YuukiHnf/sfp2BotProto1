import { TextField } from "@material-ui/core";
import React, { memo } from "react";

type PropsType = {
  value: string;
  name: string;
  onChange:
    | React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
    | undefined;
};

const TextField1 = (props: PropsType) => {
  const { value, name, onChange } = props;
  //console.log("textField1");

  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id={name}
      label={name.toLocaleUpperCase()}
      name={name}
      autoComplete={name}
      autoFocus
      value={value}
      onChange={onChange}
    />
  );
};

export default memo(TextField1);
