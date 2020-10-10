import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  selectAuthDialogIsOpen,
  closedAuthDialog,
  selectAuthDialogActiveTab,
  setAuthDialogTab,
  clearedAuthErrors,
  clearedSignupMessage,
} from "./authSlice";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contents: {
      display: "flex",
      flexDirection: "column",
    },
  })
);
function AuthDialog() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isOpen = useSelector(selectAuthDialogIsOpen);
  const activeTab = useSelector(selectAuthDialogActiveTab);
  const handleChange = (
    event?: React.ChangeEvent<{}>,
    newValue?: number
  ): void => {
    dispatch(setAuthDialogTab(newValue));
    dispatch(clearedAuthErrors());
    dispatch(clearedSignupMessage());
  };

  const handleClose = () => {
    dispatch(closedAuthDialog());
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          variant="fullWidth"
          aria-label="login-signup tab"
        >
          <Tab label="Log In" />
          <Tab label="Sign Up" />
        </Tabs>
        <DialogContent>
          <div className={classes.contents}>
            {activeTab === 0 ? <LoginForm /> : <SignupForm />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AuthDialog;
