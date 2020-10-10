import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      display: "flex",
      justifyContent: "space-between",
      background: theme.palette.primary.main,
    },
    message: { color: "#fff" },
  })
);

function AlertCard({ message }: { message: string }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Typography className={classes.message} variant="h6">
        Nothing to see here yet.
      </Typography>
    </Card>
  );
}

export default AlertCard;
