import React from "react";
import { IDeck, ISharedCard } from "../../declarations";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isEditingSingleToggled, moveCardsBetweenDecks } from "./myDecksSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TableRow from "@material-ui/core/TableRow";
import StyledTableCell from "../../components/StyledTableCell";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		row: {
			cursor: "pointer",
			"&:hover, &:focus": {
				background: theme.palette.action.selected,
			},
			"&:last-of-type": {
				"& td, th": {
					border: 0,
				},
			},
		},
		smallCell: { width: "5rem" },
	})
);

interface IDeckDetailTableInnerRowProps {
	sharedCard: ISharedCard;
	deck: IDeck;
	cardname: string;
}

const initialPosition = {
	mouseX: null,
	mouseY: null,
};

function DeckDetailTableInnerRow({
	sharedCard,
	deck,
	cardname,
}: IDeckDetailTableInnerRowProps) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const history = useHistory();

	const [position, setPosition] = React.useState<{
		mouseX: null | number;
		mouseY: null | number;
	}>(initialPosition);

	const originalCard = deck.deckList[cardname];

	const handleClose = () => {
		setPosition(initialPosition);
	};

	const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setPosition({
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
		});
	};

	const handleMove = (num: number) => () => {
		if (originalCard.availability - num < 0) return null;

		const originUpdate = {
			deckID: deck._id,
			cardname,
			availability: originalCard.availability - num,
		};
		const destinationUpdate = {
			deckID: sharedCard.deckID,
			cardname,
			availability: sharedCard.availability + num,
		};
		dispatch(isEditingSingleToggled(cardname));
		dispatch(moveCardsBetweenDecks([originUpdate, destinationUpdate]));
		handleClose();
	};

	const handleTake = (num: number) => () => {
		if (sharedCard.availability - num < 0) return null;
		const originUpdate = {
			deckID: deck._id,
			cardname,
			availability: originalCard.availability + num,
		};
		const destinationUpdate = {
			deckID: sharedCard.deckID,
			cardname,
			availability: sharedCard.availability - num,
		};
		console.log(cardname);
		dispatch(isEditingSingleToggled(cardname));
		dispatch(moveCardsBetweenDecks([originUpdate, destinationUpdate]));
		handleClose();
	};
	const handleRedirect = () => {
		history.push(`/my-decks/${sharedCard.deckID}`);
		handleClose();
	};

	return (
		<>
			<TableRow
				className={classes.row}
				onClick={handleMenuOpen}
				key={sharedCard.deckName}
			>
				<StyledTableCell component="th" scope="row">
					{sharedCard.deckName}
				</StyledTableCell>
				<StyledTableCell className={classes.smallCell} align="right">
					{sharedCard.quantity}
				</StyledTableCell>
				<StyledTableCell className={classes.smallCell} align="right">
					{sharedCard.availability}
				</StyledTableCell>
			</TableRow>
			<Menu
				keepMounted
				open={position.mouseY !== null}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
					position.mouseY !== null && position.mouseX !== null
						? { top: position.mouseY, left: position.mouseX }
						: undefined
				}
			>
				{Boolean(originalCard.availability) && (
					<MenuItem onClick={handleMove(1)}>
						Move one to {sharedCard.deckName}
					</MenuItem>
				)}
				{originalCard.availability > 1 && (
					<MenuItem onClick={handleMove(originalCard.availability)}>
						Move max. to {sharedCard.deckName}
					</MenuItem>
				)}
				{Boolean(sharedCard.availability) && (
					<MenuItem onClick={handleTake(1)}>
						Take one from {sharedCard.deckName}
					</MenuItem>
				)}
				{sharedCard.availability > 1 && (
					<MenuItem onClick={handleTake(sharedCard.availability)}>
						Take max from {sharedCard.deckName}
					</MenuItem>
				)}
				<MenuItem onClick={handleRedirect}>
					Visit {sharedCard.deckName}
				</MenuItem>
			</Menu>
		</>
	);
}

export default DeckDetailTableInnerRow;
