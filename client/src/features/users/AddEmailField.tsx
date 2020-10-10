import React from "react";
import { IUser } from "../../declarations/index";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePersonalProfile,
  selectPersonalProfileUpdateStatus,
} from "./usersSlice";
import { Formik, Form } from "formik";
import { emailSchema } from "../../validators";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import CustomTextField from "../../components/CustomTextField";
import FadeInModal from "../../components/FadeInModal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: { paddingBottom: theme.spacing(3) },
    buttonDiv: {},
    button: { color: "#fff" },
    icon: { fontSize: "1.25rem" },
  })
);

function AddEmailField({ profile }: { profile: IUser | null }) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const status = useSelector(selectPersonalProfileUpdateStatus);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {profile?.email ? (
        <IconButton size="small" edge="start" onClick={handleOpen}>
          <EditIcon className={classes.icon} />
        </IconButton>
      ) : (
        <Button onClick={handleOpen} variant="contained" color="primary">
          Add email address
        </Button>
      )}
      <FadeInModal open={open} handleClose={handleClose}>
        <>
          <Typography className={classes.text} variant="body1" align="center">
            Enter your email address
          </Typography>
          <Formik
            initialValues={{ email: profile?.email }}
            validationSchema={emailSchema}
            onSubmit={async (values) => {
              try {
                await dispatch(
                  updatePersonalProfile({
                    id: profile?._id,
                    dataObj: { ...values },
                  })
                );
                handleClose();
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {({ submitForm }) => (
              <Form>
                <CustomTextField label="Email" name="email" type="email" />
                {status === "pending" && <LinearProgress />}
                <Grid className={classes.buttonDiv} container spacing={2}>
                  <Grid item xs={6}>
                    {" "}
                    <Button
                      className={classes.button}
                      onClick={handleClose}
                      variant="contained"
                      color="secondary"
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    {" "}
                    <Button
                      className={classes.button}
                      onClick={submitForm}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Confirm
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </>
      </FadeInModal>
    </div>
  );
}

export default AddEmailField;
