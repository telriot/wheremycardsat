import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { IRouteParams } from "../../declarations/index";
import DeckDetailTableInnerRow from "./DeckDetailTableInnerRow";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import { ISharedCard, ICard, IDeck } from "../../declarations";
import { selectMyDecks } from "./myDecksSlice";
import { trimName } from "../../lib/helpers";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import QuantityToggler, {
	TQuantityTogglerTarget,
} from "../../components/QuantityToggler";

import { updateDeck } from "./myDecksSlice";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		row: {},
		rowShared: {
			"& > *": {
				borderBottom: "unset",
			},
			background: "yellow",
		},
		rowMissing: { background: "red" },
		quantityCell: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-around",
			height: "16px",
		},
		iconButton: { padding: "1px" },
	})
);

function DeckDetailTableRow({ card, deck }: { card: ICard; deck: IDeck }) {
	const [open, setOpen] = React.useState(false);
	const [sharedDecks, setSharedDecks] = React.useState<Array<ISharedCard>>([]);
	const classes = useStyles();
	const dispatch = useDispatch();
	const decks = useSelector(selectMyDecks);
	const params = useParams<IRouteParams>();

	const isShared = Boolean(sharedDecks.length);

	const compareIfShared = (
		deck: IDeck,
		presentDeckId: string,
		cardname: string
	) => Boolean(deck._id !== presentDeckId && deck.deckList[trimName(cardname)]);

	const getSharedCardData = (
		decks: Array<IDeck>,
		presentDeckId: string,
		cardname: string
	) => {
		const sharedDataArr: Array<ISharedCard> = [];

		decks.forEach((deck, i) => {
			const sharedDataObj: ISharedCard = {
				deckID: "",
				deckName: "",
				quantity: 0,
				availability: 0,
			};
			if (compareIfShared(deck, presentDeckId, cardname)) {
				sharedDataObj.deckName = deck.name;
				sharedDataObj.deckID = deck._id;
				sharedDataObj.quantity = deck.deckList[trimName(cardname)].quantity;

				sharedDataObj.availability =
					deck.deckList[trimName(cardname)].availability;

				sharedDataArr.push(sharedDataObj);
			}
		});
		return sharedDataArr;
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
	const handleRemoveClick = (
		cardname: string,
		num: number,
		target: string
	) => () => console.log("remove");

	React.useEffect(() => {
		decks && setSharedDecks(getSharedCardData(decks, params.id, card.name));
	}, [decks, params.id, card.name]);
	return (
		<>
			<TableRow
				className={isShared ? classes.rowShared : classes.row}
				key={card.name}
			>
				<TableCell>
					{isShared && (
						<IconButton
							aria-label="expand row"
							size="small"
							onClick={() => setOpen(!open)}
						>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					)}
				</TableCell>
				<TableCell component="th" scope="row">
					{card.name}
				</TableCell>
				<TableCell align="right">{card.mana_cost}</TableCell>
				<TableCell align="center">
					<div className={classes.quantityCell}>
						{" "}
						<QuantityToggler
							quantity={card.quantity}
							cardname={card.name}
							handleChangeClick={handleChangeClick}
							target="quantity"
						/>
					</div>
				</TableCell>
				<TableCell align="center">
					<div className={classes.quantityCell}>
						{" "}
						<QuantityToggler
							quantity={card.availability}
							cardname={card.name}
							handleChangeClick={handleChangeClick}
							target="availability"
						/>
					</div>
				</TableCell>
			</TableRow>
			{isShared && (
				<TableRow>
					<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box margin={1}>
								<Typography variant="h6" gutterBottom component="div">
									Shared with
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Deck name</TableCell>
												<TableCell align="right">In Decklist</TableCell>
												<TableCell align="right">In Deck</TableCell>
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
								</Typography>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			)}
		</>
	);
}

export default DeckDetailTableRow;
