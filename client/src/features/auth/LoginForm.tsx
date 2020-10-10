import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  attemptLogin,
  selectAuthStatus,
  clearedAuthErrors,
  clearedSignupMessage,
  closedAuthDialog,
  selectErrorMessage,
} from "./authSlice";
import { Formik, Form } from "formik";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Button, LinearProgress } from "@material-ui/core";
import { loginSchema } from "../../validators";
import AuthAlertDiv from "./AuthAlertDiv";
import CustomTextField from "../../components/CustomTextField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formItems: {
      display: "flex",
      flexDirection: "column",
      marginBottom: theme.spacing(3),
    },
    messageDiv: {
      minHeight: "2.25rem",
      width: "100%",
      paddingBottom: theme.spacing(0.5),
    },
  })
);

function LoginForm() {
  const classes = useStyles();
  const history = useHistory();
  const status = useSelector(selectAuthStatus);
  const dispatch = useDispatch();
  const errorMessage = useSelector(selectErrorMessage);
  const clearApiErrors = () => {
    errorMessage && dispatch(clearedAuthErrors());
  };
  const handleForgottenPassword = () => {
    dispatch(closedAuthDialog());
    history.push("/resetCredentials");
  };
  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={loginSchema}
      onSubmit={async (values: { username: string; password: string }) => {
        dispatch(clearedAuthErrors());
        dispatch(clearedSignupMessage());
        await dispatch(attemptLogin(values));
        history.push("/");
      }}
    >
      {({ isValid, values, submitForm }) => (
        <Form>
          <div className={classes.formItems} onClick={() => clearApiErrors()}>
            <AuthAlertDiv />
            <CustomTextField
              label="Username"
              name="username"
              disabled={false}
            />
            <CustomTextField
              type="password"
              label="Password"
              name="password"
              disabled={false}
            />
          </div>
          {status !== "idle" && <LinearProgress />}

          <div>
            <Button
              variant="contained"
              color="primary"
              disabled={Boolean(
                !values.username ||
                  !values.password ||
                  !isValid ||
                  status !== "idle"
              )}
              onClick={() => submitForm()}
              fullWidth
            >
              Login
            </Button>
          </div>
          <div>
            <Button
              onClick={handleForgottenPassword}
              size="small"
              color="primary"
              fullWidth
            >
              Forgot your password?
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default LoginForm;
