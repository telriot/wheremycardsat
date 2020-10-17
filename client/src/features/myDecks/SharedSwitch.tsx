import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import clsx from "clsx";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		label: {
			fontSize: ".875rem",
			color: theme.palette.text.secondary,
			transition: "color .2s",
		},
		isOpen: { color: theme.palette.text.primary },
	})
);
interface ISwitchProps {
	handleChange: () => void;
	open: boolean;
	label: string;
	color?: "default" | "primary" | "secondary";
}
function SharedSwitch({ handleChange, open, label, color }: ISwitchProps) {
	const classes = useStyles();

	return (
		<FormGroup row>
			<FormControlLabel
				className={open ? clsx([classes.label, classes.isOpen]) : classes.label}
				control={
					<Switch
						checked={open}
						onChange={handleChange}
						name="checkedB"
						color={color || "primary"}
					/>
				}
				label={label}
			/>
		</FormGroup>
	);
}

export default SharedSwitch;
