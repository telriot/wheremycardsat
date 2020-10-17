import React from "react";
import { ICard, ISharedCard } from "../declarations/index";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { selectBeingEdited } from "../features/myDecks/myDecksSlice";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		row: {
			transition: "background .5s",
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
		rowIsSomewhereElse: {
			background: theme.palette.warning.light,
			"&:hover, &:focus ": {
				background: theme.palette.warning.main,
			},
		},

		rowMissing: {
			background: theme.palette.error.light,
			"&:hover, &:focus ": {
				background: theme.palette.error.main,
			},
		},

		rowBeingEdited: {
			backgroundRepeat: "no-repeat",
			animation: `$mutatingBackgroundAnimation 2s infinite ease-in-out`,
		},

		"@keyframes mutatingBackgroundAnimation": {
			"0%": {
				background: "",
			},
			"50%": {
				background: theme.palette.action.disabledBackground,
			},
			"100%": {
				background: "",
			},
		},
	})
);
interface IColorReactiveTableRowProps {
	children: React.ReactNode;
	sharedDecks?: Array<ISharedCard>;
	card: ICard;
}
function ColorReactiveTableRow({
	children,
	sharedDecks,
	card,
}: IColorReactiveTableRowProps) {
	const classes = useStyles();
	const beingEdited = useSelector(selectBeingEdited);

	const isSharedAndFull = Boolean(
		sharedDecks?.length && card.availability >= card.quantity
	);
	const isSomewhereElse = Boolean(
		sharedDecks?.length && card.availability < card.quantity
	);
	const isMissing = Boolean(
		sharedDecks?.length === 0 && card.availability < card.quantity
	);
	const isBeingEdited = Boolean(beingEdited === card.name);

	return (
		<TableRow
			className={
				isSharedAndFull
					? clsx([
							classes.row,
							classes.rowShared,
							isBeingEdited && classes.rowBeingEdited,
					  ])
					: isSomewhereElse
					? clsx([
							classes.row,
							classes.rowShared,
							classes.rowIsSomewhereElse,
							isBeingEdited && classes.rowBeingEdited,
					  ])
					: isMissing
					? clsx([
							classes.row,
							classes.rowMissing,
							isBeingEdited && classes.rowBeingEdited,
					  ])
					: clsx([classes.row, isBeingEdited && classes.rowBeingEdited])
			}
		>
			{children}
		</TableRow>
	);
}

export default ColorReactiveTableRow;
