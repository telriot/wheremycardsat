import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cardAdded, selectSearchStatus } from "./deckBuilderSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: { marginBottom: theme.spacing(1) },
	})
);
function AddCardButton() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const searchStatus = useSelector(selectSearchStatus);
	const handleClick = () => {
		dispatch(cardAdded());
	};

	return (
		<Button
			className={classes.button}
			disabled={searchStatus !== "fulfilled"}
			onClick={handleClick}
			variant="contained"
			fullWidth
		>
			Add card
		</Button>
	);
}

export default AddCardButton;
