import React from "react";
import { useSelector } from "react-redux";
import { selectSignupMessage, selectErrorMessage } from "./authSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    messageDiv: {
      minHeight: "2.25rem",
      width: "100%",
      paddingBottom: theme.spacing(0.5),
    },
  })
);
function AuthAlertDiv() {
  const classes = useStyles();
  const signupMessage = useSelector(selectSignupMessage);
  const errorMessage = useSelector(selectErrorMessage);

  return (
    <div className={classes.messageDiv}>
      {signupMessage && (
        <Typography variant="body2" color="textSecondary" align="center">
          {signupMessage}
        </Typography>
      )}
      {errorMessage && (
        <Typography variant="body2" color="textSecondary" align="center">
          {errorMessage}
        </Typography>
      )}
    </div>
  );
}

export default AuthAlertDiv;
