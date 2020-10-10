import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Field } from "formik";
import { TextField } from "formik-material-ui";

const useStyles = makeStyles((theme) => ({
  disabled: {
    color: theme.palette.text.primary,
  },
  root: {
    paddingBottom: theme.spacing(4),
    width: "100%",
  },
  helperText: { position: "absolute", bottom: ".5rem" },
}));

interface ICustomTextFieldProps {
  disabled?: boolean;
  label: string;
  name: string;
  type?: string;
  variant?: string;
  multiline?: boolean;
  rows?: number;
}
function CustomTextField({
  disabled,
  label,
  name,
  type,
  variant,
  multiline,
  rows,
}: ICustomTextFieldProps) {
  const classes = useStyles();
  return (
    <Field
      InputProps={{
        classes: {
          disabled: classes.disabled,
        },
        "data-testid": `testid-${name}`,
      }}
      InputLabelProps={{
        classes: {
          disabled: classes.disabled,
        },
      }}
      FormHelperTextProps={{
        className: classes.helperText,
      }}
      classes={{ root: classes.root }}
      disabled={disabled}
      component={TextField}
      multiline={multiline}
      rows={rows}
      type={type || "text"}
      label={label}
      name={name}
      variant={variant || "filled"}
    />
  );
}

export default CustomTextField;
