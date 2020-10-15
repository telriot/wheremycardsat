import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDeckName, deckNameChanged } from "./deckBuilderSlice";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

function DeckNameInput() {
	const classes = useStyles;
	const dispatch = useDispatch();
	const deckName = useSelector(selectDeckName);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(deckNameChanged(event.target.value));
	};

	return (
		<div>
			<TextField
				error={false}
				value={deckName}
				onChange={handleChange}
				id="outlined-error"
				label="Deck Name"
				variant="outlined"
				helperText=""
			/>
		</div>
	);
}

export default DeckNameInput;
