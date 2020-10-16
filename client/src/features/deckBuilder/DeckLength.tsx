import React from "react";
import { useSelector } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { selectMainDeckLength } from "./deckBuilderSlice";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		input: { display: "none" },
	})
);
function DeckLength({ variant }: { variant?: "main" | "side" | "default" }) {
	const mainDeckLength = useSelector(selectMainDeckLength);
	return (
		<div>
			<Typography>
				{variant === "main"
					? "Mainboard: "
					: variant === "side"
					? "Sideboard: "
					: "Deck: "}{" "}
				{mainDeckLength} cards
			</Typography>
		</div>
	);
}

export default DeckLength;
