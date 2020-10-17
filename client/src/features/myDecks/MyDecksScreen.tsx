import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthorizedUser } from "../auth/authSlice";
import { selectMyDecks, fetchMyDecks, selectDecksStatus } from "./myDecksSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";

import Typography from "@material-ui/core/Typography";

import DeckCard from "./DeckCard";
import AlertCard from "../../components/AlertCard";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			maxWidth: "48rem",
			minHeight: "50vh",
			[theme.breakpoints.down("xs")]: { maxWidth: "24rem" },
		},
		linearProgress: { width: "100%" },
	})
);

function MyDecksScreen() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const authUser = useSelector(selectAuthorizedUser);
	const myDecks = useSelector(selectMyDecks);
	const status = useSelector(selectDecksStatus);

	React.useEffect(() => {
		authUser && dispatch(fetchMyDecks());
	}, [dispatch, authUser]);

	const ContentLoaded = () => (
		<Grid container spacing={2}>
			{myDecks.length ? (
				myDecks.map((deck, i) => (
					<Grid item xs={12} sm={4} md={4} lg={4} key={`my-deck-${i}`}>
						{" "}
						<DeckCard deck={deck} />
					</Grid>
				))
			) : (
				<AlertCard />
			)}
		</Grid>
	);

	const ContentPending = () => (
		<LinearProgress className={classes.linearProgress} />
	);
	const ContentRejected = () => (
		<AlertCard message="Something went wrong with our servers" />
	);

	return (
		<Container className={classes.container}>
			<Box mb={3}>
				<Typography variant="h3">My Decks</Typography>
			</Box>
			{status === "fulfilled" ? (
				<ContentLoaded />
			) : status === "pending" ? (
				<ContentPending />
			) : status === "rejected" ? (
				<ContentRejected />
			) : null}
		</Container>
	);
}

export default MyDecksScreen;
