import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import {
  getUserToUpdate,
  selectPasswordResetError,
  selectPasswordResetStatus,
  selectUserToUpdate,
  updateCredentials,
  clearedPasswordResetError,
  clearedPasswordResetStatus,
} from "./authSlice";
import { Formik, Form } from "formik";
import { passwordSchema } from "../../validators";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import CustomTextField from "../../components/CustomTextField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: { maxWidth: "48rem" },
    text: { paddingBottom: theme.spacing(3) },
    titleDiv: { width: "100%", display: "flex", justifyContent: "center" },
    skeleton: { width: "80%", marginBottom: theme.spacing(3) },
    errorDiv: { height: "1.75rem", marginBottom: theme.spacing(0.5) },
    message: { color: theme.palette.primary.main },
    buttonDiv: {},
    button: { color: "#fff" },
    icon: { fontSize: "1.25rem" },
  })
);
type TParams = { token: string | undefined };

function PasswordUpdateForm({ match }: RouteComponentProps<TParams>) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const username = useSelector(selectUserToUpdate);
  const status = useSelector(selectPasswordResetStatus);
  const error = useSelector(selectPasswordResetError);

  React.useEffect(() => {
    match.params.token && dispatch(getUserToUpdate(match.params.token));
    dispatch(clearedPasswordResetError);
    dispatch(clearedPasswordResetStatus);
  }, [match, dispatch]);

  return (
    <Container className={classes.container}>
      <div className={classes.titleDiv}>
        {username ? (
          <Typography className={classes.text} variant="h4" align="center">
            {`Enter a new password, ${username}`}{" "}
          </Typography>
        ) : (
          <Skeleton
            variant="rect"
            height={40}
            width="80%"
            className={classes.skeleton}
          />
        )}
      </div>
      <div className={classes.errorDiv}>
        <Typography className={classes.message} variant="caption">
          {error
            ? error
            : status === "fulfilled"
            ? "Your password was succesfully updated"
            : ""}
        </Typography>
      </div>
      <Formik
        initialValues={{ password: "" }}
        validationSchema={passwordSchema}
        onSubmit={async (values) => {
          try {
            await dispatch(updateCredentials(values));
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {({ submitForm }) => (
          <Form>
            <CustomTextField
              label="New Password"
              name="password"
              type="password"
            />
            {status === "pending" && <LinearProgress />}

            <Button
              className={classes.button}
              onClick={submitForm}
              variant="contained"
              color="primary"
              disabled={status === "pending" || status === "fulfilled"}
              fullWidth
            >
              Confirm
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default PasswordUpdateForm;
