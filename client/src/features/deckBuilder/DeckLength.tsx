import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { selectMainDeckLength } from "./deckBuilderSlice";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		input: { display: "none" },
	})
);
function DeckLength() {
	const mainDeckLength = useSelector(selectMainDeckLength);
	return (
		<div>
			<Typography>Main: {mainDeckLength} cards</Typography>
		</div>
	);
}

export default DeckLength;
