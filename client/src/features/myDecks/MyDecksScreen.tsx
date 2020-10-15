import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthorizedUser } from "../auth/authSlice";
import { selectMyDecks, fetchMyDecks } from "./myDecksSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import DeckCard from "./DeckCard";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: { maxWidth: "48rem" },
	})
);

function MyDecksScreen() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const authUser = useSelector(selectAuthorizedUser);
	const myDecks = useSelector(selectMyDecks);

	React.useEffect(() => {
		authUser && dispatch(fetchMyDecks());
	}, [dispatch, authUser]);

	return (
		<Container className={classes.container}>
			<Grid container spacing={2}>
				{myDecks?.map((deck, i) => (
					<Grid item xs={12} sm={6} md={4} lg={4} key={`my-deck-${i}`}>
						{" "}
						<DeckCard deck={deck} />
					</Grid>
				))}
			</Grid>
		</Container>
	);
}

export default MyDecksScreen;
