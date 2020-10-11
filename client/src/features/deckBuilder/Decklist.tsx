import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import DeckTable from "./DeckTable";
import DeckNameInput from "./DeckNameInput";
import FormatSelect from "./FormatSelect";
import DeckImportTool from "./DeckImportTool";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		deckInfoDiv: {
			display: "flex",
			justifyContent: "space-between",
		},
	})
);
function Decklist() {
	const classes = useStyles();

	return (
		<div>
			<div className={classes.deckInfoDiv}>
				<DeckNameInput />
				<FormatSelect />
			</div>
			<DeckTable /> <DeckImportTool />
		</div>
	);
}

export default Decklist;
