import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import {
  attemptSignup,
  selectAuthStatus,
  clearedAuthErrors,
  clearedSignupMessage,
  selectErrorMessage,
} from "./authSlice";
import { Formik, Form } from "formik";
import { Button, LinearProgress } from "@material-ui/core";
import { signupSchema } from "../../validators";
import AuthAlertDiv from "./AuthAlertDiv";
import CustomTextField from "../../components/CustomTextField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formItems: {
      display: "flex",
      flexDirection: "column",
      marginBottom: theme.spacing(3),
    },
  })
);

function SignupForm() {
  const classes = useStyles();
  const status = useSelector(selectAuthStatus);
  const dispatch = useDispatch();
  const errorMessage = useSelector(selectErrorMessage);

  const clearApiErrors = () => {
    errorMessage && dispatch(clearedAuthErrors());
  };
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
      }}
      validationSchema={signupSchema}
      onSubmit={(values: {
        username: string;
        password: string;
        email: string;
      }): void => {
        dispatch(clearedAuthErrors());
        dispatch(clearedSignupMessage());
        dispatch(attemptSignup(values));
      }}
    >
      {({ submitForm, isValid, values }) => (
        <Form>
          <div className={classes.formItems} onClick={() => clearApiErrors()}>
            <AuthAlertDiv />

            <CustomTextField
              label="Username"
              name="username"
              disabled={false}
            />
            <CustomTextField
              type="email"
              label="Email Address"
              name="email"
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
                  !values.email ||
                  !isValid ||
                  status !== "idle"
              )}
              onClick={submitForm}
              fullWidth
            >
              Sign Up
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default SignupForm;
