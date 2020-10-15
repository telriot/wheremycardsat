import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyDecks, selectMyDecks } from "./myDecksSlice";
import DeckDetailTableRow from "./DeckDetailTableRow";
import { selectAuthorizedUser } from "../auth/authSlice";
import { IDeck, IRouteParams } from "../../declarations/index";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		table: {
			minWidth: 350,
		},
		quantityCell: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-around",
			height: "16px",
		},
		iconButton: { padding: "1px" },
	})
);

function DeckDetailTable() {
	const params = useParams<IRouteParams>();
	const classes = useStyles();
	const dispatch = useDispatch();
	const authUser = useSelector(selectAuthorizedUser);
	const decks = useSelector(selectMyDecks);
	const [deck, setDeck] = React.useState<IDeck | undefined>(undefined);
	React.useEffect(() => {
		if (!decks?.length && authUser) {
			dispatch(fetchMyDecks());
		}
	}, [decks, authUser]);
	React.useEffect(() => {
		decks?.length && setDeck(decks.find((deck) => deck._id === params.id));
	}, [decks]);

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} size="small" aria-label="a deck table">
				<TableHead>
					<TableRow>
						<TableCell>{""}</TableCell>
						<TableCell>Card name</TableCell>
						<TableCell align="right">Mana Cost</TableCell>
						<TableCell align="center"># In Decklist</TableCell>
						<TableCell align="center"># In Deck</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{deck &&
						Object.entries(deck.deckList).map(([cardname, cardObject]: any) => {
							return <DeckDetailTableRow card={cardObject} deck={deck} />;
						})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default DeckDetailTable;
