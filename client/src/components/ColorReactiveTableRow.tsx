import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";

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
	isSomewhereElse?: boolean;
	isMissing?: boolean;
	isShared?: boolean;
	isBeingEdited?: boolean;
}
function ColorReactiveTableRow({
	children,
	isMissing,
	isShared,
	isBeingEdited,
	isSomewhereElse,
}: IColorReactiveTableRowProps) {
	const classes = useStyles();
	return (
		<TableRow
			className={
				isSomewhereElse
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
					: isShared
					? clsx([
							classes.row,
							classes.rowShared,
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
