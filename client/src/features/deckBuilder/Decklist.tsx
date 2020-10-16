import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import DeckLength from "./DeckLength";
import DeckNameInput from "./DeckNameInput";
import DeckTable from "./DeckTable";
import FormatSelect from "./FormatSelect";
import SaveButton from "./SaveButton";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

function Decklist() {
	const classes = useStyles();

	return (
		<>
			<Box display="flex" justifyContent="space-between">
				<DeckNameInput />
				<FormatSelect />
			</Box>
			<Box my={1}>
				<DeckLength />
			</Box>
			<DeckTable />
			<SaveButton />
		</>
	);
}

export default Decklist;
