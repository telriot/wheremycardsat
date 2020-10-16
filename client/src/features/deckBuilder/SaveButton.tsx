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
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		buttonPending: { background: `${theme.palette.warning.light} !important` },
		buttonFailed: { background: `${theme.palette.error.light} !important` },
		buttonSuccess: { background: `${theme.palette.success.light} !important` },
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
	const isFailed = Boolean(saveStatus === "rejected");
	const isSuccess = Boolean(saveStatus === "fulfilled");
	const isDisabled = Boolean(
		isPending || isSuccess || !deckName || !deckFormat
	);

	return (
		<Button
			className={
				isPending
					? classes.buttonPending
					: isFailed
					? classes.buttonFailed
					: isSuccess
					? classes.buttonSuccess
					: ""
			}
			disabled={isDisabled}
			variant="contained"
			onClick={handleSave}
			fullWidth
		>
			{isPending
				? "Saving..."
				: isFailed
				? "Try again"
				: isSuccess
				? "Saved"
				: "Save"}
		</Button>
	);
}

export default SaveButton;
