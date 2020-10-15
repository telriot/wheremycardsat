import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cardAdded, selectSearchStatus } from "./deckBuilderSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: { maxWidth: "48rem" },
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
			disabled={searchStatus !== "fulfilled"}
			onClick={handleClick}
			variant="contained"
		>
			Add card
		</Button>
	);
}

export default AddCardButton;
