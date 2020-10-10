import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPasswordResetError,
  selectPasswordResetStatus,
  requestPasswordReset,
  clearedPasswordResetError,
  clearedPasswordResetStatus,
} from "./authSlice";
import { Formik, Form } from "formik";
import { emailSchema } from "../../validators";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import CustomTextField from "../../components/CustomTextField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: { maxWidth: "48rem" },
    text: { paddingBottom: theme.spacing(3) },
    errorDiv: { height: "1.75rem", marginBottom: theme.spacing(0.5) },
    message: { color: theme.palette.primary.main },
    buttonDiv: {},
    button: { color: "#fff" },
    icon: { fontSize: "1.25rem" },
  })
);

function ResetCredentials() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const status = useSelector(selectPasswordResetStatus);
  const error = useSelector(selectPasswordResetError);

  React.useEffect(() => {
    dispatch(clearedPasswordResetError);
    dispatch(clearedPasswordResetStatus);
  }, [dispatch]);

  return (
    <Container className={classes.container}>
      <Typography className={classes.text} variant="h4" align="center">
        Enter your email address
      </Typography>
      <div className={classes.errorDiv}>
        <Typography className={classes.message} variant="caption">
          {error
            ? error
            : status === "fulfilled"
            ? "Success! You can now check your email."
            : ""}
        </Typography>
      </div>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={emailSchema}
        onSubmit={async (values) => {
          try {
            console.log("email sent");
            await dispatch(requestPasswordReset(values));
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {({ submitForm }) => (
          <Form>
            <CustomTextField label="Email" name="email" type="email" />
            {status === "pending" && <LinearProgress />}

            <Button
              className={classes.button}
              onClick={submitForm}
              variant="contained"
              color="primary"
              disabled={status === "pending" || status === "fulfilled"}
              fullWidth
            >
              Send a recovery email
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default ResetCredentials;
