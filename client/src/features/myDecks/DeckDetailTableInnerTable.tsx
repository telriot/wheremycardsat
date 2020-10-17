import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import DeckDetailTableInnerRow from "./DeckDetailTableInnerRow";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ICard, IDeck, ISharedCard } from "../../declarations";
import StyledTableCell from "../../components/StyledTableCell";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

function DeckDetailTableInnerTable({
	deck,
	sharedDecks,
	card,
}: {
	deck: IDeck;
	sharedDecks?: Array<ISharedCard>;
	card: ICard;
}) {
	const classes = useStyles();
	return (
		<Table size="small">
			<TableHead>
				<TableRow>
					<StyledTableCell>Shared with</StyledTableCell>
					<StyledTableCell size="small" align="right">
						In Decklist
					</StyledTableCell>
					<StyledTableCell size="small" align="right">
						In Deck
					</StyledTableCell>
				</TableRow>
			</TableHead>
			{sharedDecks?.map((sharedCard) => (
				<DeckDetailTableInnerRow
					key={`${sharedCard.deckName}-${card.name}`}
					cardname={card.name}
					sharedCard={sharedCard}
					deck={deck}
				/>
			))}
		</Table>
	);
}

export default DeckDetailTableInnerTable;
