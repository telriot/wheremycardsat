import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSearchResult } from "../deckBuilder/deckBuilderSlice";
import { addCardToDeck, selectAddCardStatus } from "./myDecksSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import CardSearchInput from "../deckBuilder/CardSearchInput";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		box: {
			[theme.breakpoints.down("xs")]: {
				padding: theme.spacing(0, 1),
			},
		},
		buttonPending: {
			animation: `$mutatingBackgroundAnimation 2s infinite ease-in-out`,
		},
		"@keyframes mutatingBackgroundAnimation": {
			"0%": {
				background: "",
			},
			"50%": {
				background: theme.palette.warning.light,
			},
			"100%": {
				background: "",
			},
		},
	})
);

function AddCardBox({ deckID }: { deckID: string }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const card = useSelector(selectSearchResult);
	const status = useSelector(selectAddCardStatus);
	const handleAddClick = () => {
		dispatch(
			addCardToDeck({
				deckID,
				cardObj: { ...card, quantity: 1, availability: 1 },
			})
		);
	};

	return (
		<Box className={classes.box} mb={3}>
			<CardSearchInput />
			<Button
				className={status === "pending" ? classes.buttonPending : ""}
				disabled={!card || status === "pending"}
				onClick={handleAddClick}
				variant="contained"
				fullWidth
			>
				{status === "pending" ? "Adding..." : "Add new card"}
			</Button>
		</Box>
	);
}

export default AddCardBox;
