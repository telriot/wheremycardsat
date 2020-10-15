import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import DeckDetailTableInnerRow from "./DeckDetailTableInnerRow";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ICard, IDeck, ISharedCard } from "../../declarations";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		row: {},
		rowShared: {
			"& > *": {
				borderBottom: "unset",
			},
			background: theme.palette.warning.light,
		},
		rowMissing: { background: "red" },
		iconButton: { padding: "1px" },
		smallCell: { maxWidth: "4rem" },
	})
);

function DeckDetailTableInnerTable({
	deck,
	sharedDecks,
	card,
}: {
	deck: IDeck;
	sharedDecks: Array<ISharedCard>;
	card: ICard;
}) {
	const classes = useStyles();
	return (
		<Table size="small">
			<TableHead>
				<TableRow>
					<TableCell>Shared with</TableCell>
					<TableCell size="small" align="right">
						In Decklist
					</TableCell>
					<TableCell size="small" align="right">
						In Deck
					</TableCell>
				</TableRow>
			</TableHead>
			{sharedDecks.map((sharedCard) => (
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
