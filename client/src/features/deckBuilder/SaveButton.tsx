import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { saveDeckList, selectMainDeckList } from "./deckBuilderSlice";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		input: { display: "none" },
	})
);
function SaveButton() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const mainDeckList = useSelector(selectMainDeckList);
	const handleSave = () => {
		dispatch(saveDeckList(mainDeckList));
	};
	return (
		<Button variant="contained" onClick={handleSave}>
			Save
		</Button>
	);
}

export default SaveButton;
