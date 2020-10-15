import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { ICard, IDeck, ISharedCard } from "../../declarations";
import { moveCardsBetweenDecks } from "./myDecksSlice";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		row: {},
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

	const [position, setPosition] = React.useState<{
		mouseX: null | number;
		mouseY: null | number;
	}>(initialPosition);
	const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setPosition({
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
		});
	};
	const handleClose = () => {
		setPosition(initialPosition);
	};
	const originalCard = deck.deckList[cardname];
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
		dispatch(moveCardsBetweenDecks([originUpdate, destinationUpdate]));
		handleClose();
	};

	return (
		<>
			<TableRow onClick={handleMenuOpen} key={sharedCard.deckName}>
				{" "}
				<TableCell component="th" scope="row">
					{sharedCard.deckName}
				</TableCell>
				<TableCell align="right">{sharedCard.quantity}</TableCell>
				<TableCell align="right">{sharedCard.availability}</TableCell>
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
			</Menu>
		</>
	);
}

export default DeckDetailTableInnerRow;
