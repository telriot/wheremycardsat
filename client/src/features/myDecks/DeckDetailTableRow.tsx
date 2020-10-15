import React from "react";
import { ISharedCard, ICard, IDeck, IRouteParams } from "../../declarations";
import { trimName } from "../../lib/helpers";
import { useDispatch, useSelector } from "react-redux";
import { selectMyDecks } from "./myDecksSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import QuantityToggler, {
	TQuantityTogglerTarget,
} from "../../components/QuantityToggler";
import { updateDeck } from "./myDecksSlice";
import { SharedDataObj } from "../../lib/classes";
import DeckDetailTableInnerTable from "./DeckDetailTableInnerTable";
import clsx from "clsx";
import ManaFont from "../../components/ManaFont";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		row: {
			"& button": {
				display: "none",
			},
			"&:hover, &:focus ": {
				background: theme.palette.action.hover,
				"& button": {
					display: "flex",
				},
			},
		},
		rowShared: {
			"& > *": {
				borderBottom: "unset",
			},
			background: theme.palette.success.light,
			"&:hover, &:focus ": {
				background: theme.palette.success.main,
			},
			cursor: "pointer",
		},
		rowMissing: {
			background: theme.palette.error.light,
			"&:hover, &:focus ": {
				background: theme.palette.error.main,
			},
		},
		innerTableMainCell: {
			padding: `${theme.spacing(0, 6)} !important`,
			background: theme.palette.action.hover,
		},
		iconButton: { padding: "1px" },
	})
);

function DeckDetailTableRow({ card, deck }: { card: ICard; deck: IDeck }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const decks = useSelector(selectMyDecks);
	const params = useParams<IRouteParams>();

	const [open, setOpen] = React.useState(false);
	const [sharedDecks, setSharedDecks] = React.useState<Array<ISharedCard>>([]);

	const isShared = Boolean(sharedDecks.length);
	const isMissing = Boolean(isShared && card.availability < card.quantity);
	const getSharedCardData = (
		decks: Array<IDeck>,
		presentDeckId: string,
		cardname: string
	) => {
		return decks
			.filter(
				(deck) =>
					deck._id !== presentDeckId && deck.deckList[trimName(cardname)]
			)
			.map((deck) => {
				const card = deck.deckList[trimName(cardname)];
				return new SharedDataObj(
					deck._id,
					deck.name,
					card.quantity,
					card.availability
				);
			});
	};

	const handleChangeClick = (
		cardname: string,
		num: number,
		target: TQuantityTogglerTarget
	) => () =>
		dispatch(
			updateDeck({
				deckID: deck._id,
				update: { cardname, [target]: card[target] + num },
			})
		);

	React.useEffect(() => {
		decks && setSharedDecks(getSharedCardData(decks, params.id, card.name));
	}, [decks, params.id, card.name]);
	const handleOpen = () => {
		isShared && setOpen(!open);
	};

	return (
		<>
			<TableRow
				className={
					isMissing
						? clsx([classes.row, classes.rowShared, classes.rowMissing])
						: isShared
						? clsx([classes.row, classes.rowShared])
						: classes.row
				}
				key={card.name}
			>
				<TableCell onClick={handleOpen} component="th" scope="row">
					{card.name}
				</TableCell>
				<TableCell onClick={handleOpen} align="right">
					<ManaFont manacost={card.mana_cost} />
				</TableCell>
				<TableCell align="center">
					<QuantityToggler
						quantity={card.quantity}
						cardname={card.name}
						handleChangeClick={handleChangeClick}
						target="quantity"
					/>
				</TableCell>
				<TableCell align="center">
					<QuantityToggler
						quantity={card.availability}
						cardname={card.name}
						handleChangeClick={handleChangeClick}
						target="availability"
					/>
				</TableCell>
			</TableRow>
			{isShared && (
				<TableRow>
					<TableCell className={classes.innerTableMainCell} colSpan={5}>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box margin={1}>
								<DeckDetailTableInnerTable
									deck={deck}
									sharedDecks={sharedDecks}
									card={card}
								/>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			)}
		</>
	);
}

export default DeckDetailTableRow;
