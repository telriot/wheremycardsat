import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	saveDeckList,
	selectDeckFormat,
	selectDeckName,
	selectMainDeckList,
	selectSaveStatus,
} from "./deckBuilderSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		input: { display: "none" },
	})
);
function SaveButton() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const deckName = useSelector(selectDeckName);
	const deckFormat = useSelector(selectDeckFormat);
	const mainDeckList = useSelector(selectMainDeckList);
	const saveStatus = useSelector(selectSaveStatus);

	const handleSave = () => {
		dispatch(
			saveDeckList({
				deckList: mainDeckList,
				name: deckName,
				format: deckFormat,
			})
		);
	};

	const isPending = Boolean(saveStatus === "pending");
	const isDisabled = Boolean(isPending || !deckName || !deckFormat);

	return (
		<Button disabled={isDisabled} variant="contained" onClick={handleSave}>
			{isPending ? "Saving..." : "Save"}
		</Button>
	);
}

export default SaveButton;
