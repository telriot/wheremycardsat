import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import CardSearchInput from "./CardSearchInput";
import Decklist from "./Decklist";
import CardImage from "./CardImage";
import AddCardButton from "./AddCardButton";
import { Grid } from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: { maxWidth: "48rem" },
	})
);
function DeckBuilderScreen() {
	const classes = useStyles();

	return (
		<Container className={classes.container}>
			<Grid container spacing={3}>
				<Grid item xs={5}>
					<CardSearchInput />

					<AddCardButton />
					<CardImage />
				</Grid>
				<Grid item xs={7}>
					<Decklist />
				</Grid>
			</Grid>
		</Container>
	);
}

export default DeckBuilderScreen;
