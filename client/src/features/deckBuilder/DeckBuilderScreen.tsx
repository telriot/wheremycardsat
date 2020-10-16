import React from "react";
import {
	makeStyles,
	createStyles,
	Theme,
	useTheme,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import AddCardButton from "./AddCardButton";
import CardImage from "./CardImage";
import CardSearchInput from "./CardSearchInput";
import Decklist from "./Decklist";
import DeckImportTool from "./DeckImportTool";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			maxWidth: "48rem",
			[theme.breakpoints.down("xs")]: {
				padding: theme.spacing(1),
			},
		},
	})
);

function DeckBuilderScreen() {
	const classes = useStyles();
	const theme = useTheme();
	const isMD = useMediaQuery(theme.breakpoints.up("md"));
	return (
		<Container className={classes.container}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={5}>
					<CardSearchInput />
					<AddCardButton />
					<DeckImportTool />
					{isMD && <CardImage />}
				</Grid>
				<Grid item xs={12} md={7}>
					<Decklist />
				</Grid>
			</Grid>
		</Container>
	);
}

export default DeckBuilderScreen;
