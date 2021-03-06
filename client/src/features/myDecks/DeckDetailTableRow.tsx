import React from "react";
import { ISharedCard, ICard, IDeck, IRouteParams } from "../../declarations";
import { SharedDataObj } from "../../lib/classes";
import { trimName } from "../../lib/helpers";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	isEditingSingleToggled,
	removeCardFromDeck,
	selectMyDecks,
	selectOnlyShared,
	updateDeck,
} from "./myDecksSlice";
import {
	createStyles,
	makeStyles,
	Theme,
	useTheme,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import TableRow from "@material-ui/core/TableRow";
import ColorReactiveTableRow from "../../components/ColorReactiveTableRow";
import DeckDetailTableInnerTable from "./DeckDetailTableInnerTable";
import ManaFont from "../../components/ManaFont";
import QuantityToggler, {
	TQuantityTogglerTarget,
} from "../../components/QuantityToggler";
import StyledTableCell from "../../components/StyledTableCell";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		manaCostCell: {
			[theme.breakpoints.down("xs")]: {
				fontSize: "11px",
			},
		},
		innerTableMainCell: {
			padding: `${theme.spacing(0, 6)} !important`,
			background: theme.palette.action.hover,
			[theme.breakpoints.down("xs")]: {
				padding: `${theme.spacing(0, 3)} !important`,
			},
		},
	})
);

function DeckDetailTableRow({ card, deck }: { card: ICard; deck: IDeck }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const decks = useSelector(selectMyDecks);
	const onlyShared = useSelector(selectOnlyShared);

	const params = useParams<IRouteParams>();
	const theme = useTheme();
	const isXXS = useMediaQuery(theme.breakpoints.down(400));
	const [open, setOpen] = React.useState(false);
	const [sharedDecks, setSharedDecks] = React.useState<
		Array<ISharedCard> | undefined
	>(undefined);

	const isShared = Boolean(sharedDecks?.length);

	const getSharedCardData = React.useCallback(
		(decks: Array<IDeck>, presentDeckId: string, cardname: string) => {
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
		},
		[]
	);

	const handleChangeClick = (
		cardname: string,
		num: number,
		target: TQuantityTogglerTarget
	) => () => {
		if (target === "quantity" && card[target] + num < 0) {
			if (
				window.confirm(`Do you want to remove ${cardname} from your decklist?`)
			) {
				dispatch(isEditingSingleToggled(cardname));
				dispatch(removeCardFromDeck({ deckID: deck._id, cardname: cardname }));
			}
			return;
		}
		dispatch(isEditingSingleToggled(cardname));
		dispatch(
			updateDeck({
				deckID: deck._id,
				update: { cardname, [target]: card[target] + num },
			})
		);
	};

	React.useEffect(() => {
		decks && setSharedDecks(getSharedCardData(decks, params.id, card.name));
	}, [decks, params.id, card.name, getSharedCardData]);

	const handleOpen = () => {
		isShared && setOpen(!open);
	};

	if (onlyShared && !isShared) return null;

	return (
		<>
			<ColorReactiveTableRow sharedDecks={sharedDecks} card={card}>
				<StyledTableCell onClick={handleOpen} component="th" scope="row">
					{card.name}
				</StyledTableCell>
				{isXXS ? null : (
					<StyledTableCell
						className={classes.manaCostCell}
						onClick={handleOpen}
						align="right"
					>
						<ManaFont manacost={card.mana_cost} />
					</StyledTableCell>
				)}
				<StyledTableCell align="center">
					<QuantityToggler
						quantity={card.quantity}
						cardname={card.name}
						handleChangeClick={handleChangeClick}
						target="quantity"
						doNotDisable
					/>
				</StyledTableCell>
				<StyledTableCell align="center">
					<QuantityToggler
						quantity={card.availability}
						cardname={card.name}
						handleChangeClick={handleChangeClick}
						target="availability"
					/>
				</StyledTableCell>
			</ColorReactiveTableRow>{" "}
			{isShared && (
				<TableRow>
					<StyledTableCell className={classes.innerTableMainCell} colSpan={5}>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box margin={1}>
								<DeckDetailTableInnerTable
									deck={deck}
									sharedDecks={sharedDecks}
									card={card}
								/>
							</Box>
						</Collapse>
					</StyledTableCell>
				</TableRow>
			)}
		</>
	);
}

export default DeckDetailTableRow;
