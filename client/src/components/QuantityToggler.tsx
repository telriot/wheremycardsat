import React from "react";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		iconButton: {
			padding: "1px",
		},
	})
);
export type TQuantityTogglerTarget = "quantity" | "availability";
interface IQuantityTogglerParams {
	quantity: number;
	cardname: string;
	target: TQuantityTogglerTarget;
	handleChangeClick: (
		cardname: string,
		num: number,
		target: TQuantityTogglerTarget
	) => any;
}
function QuantityToggler({
	quantity,
	handleChangeClick,
	cardname,
	target,
}: IQuantityTogglerParams) {
	const classes = useStyles();

	return (
		<Box
			height={16}
			width="100%"
			minWidth={70}
			display="flex"
			alignItems="center"
			justifyContent="space-around"
		>
			<IconButton
				className={classes.iconButton}
				onClick={handleChangeClick(cardname, 1, target)}
			>
				<AddIcon fontSize="small" />
			</IconButton>
			{quantity}
			<IconButton
				className={classes.iconButton}
				onClick={handleChangeClick(cardname, -1, target)}
			>
				<RemoveIcon fontSize="small" />
			</IconButton>
		</Box>
	);
}

export default QuantityToggler;
