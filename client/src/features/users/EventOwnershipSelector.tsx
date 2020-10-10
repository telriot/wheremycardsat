import React from "react";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { eventsSelected, selectPersonalProfileEvents } from "./usersSlice";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonGroup: { margin: theme.spacing(3, 0) },
    button: { color: "#fff" },
  })
);

function EventOwnershipSelector() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const activeSelection = useSelector(selectPersonalProfileEvents);
  const handleClick = (selection: string) => async () => {
    if (selection === activeSelection) return;
    dispatch(eventsSelected(selection));
  };

  const buttons = [
    { text: "My Events", arg: "myEvents" },
    { text: "Joined", arg: "joined" },
    { text: "Archived", arg: "archived" },
  ];
  return (
    <div>
      {" "}
      <ButtonGroup
        className={classes.buttonGroup}
        variant="contained"
        color="primary"
        aria-label="event ownership selector"
      >
        {buttons.map((button) => (
          <Button
            className={classes.button}
            color={activeSelection === button.arg ? "secondary" : "primary"}
            onClick={handleClick(button.arg)}
          >
            {button.text}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}

export default EventOwnershipSelector;
