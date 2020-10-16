import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { onlySharedToggled, selectOnlyShared } from "./myDecksSlice";
import clsx from "clsx";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		label: {
			fontSize: ".875rem",
			color: theme.palette.text.secondary,
			transition: "color .2s",
		},
		isOnlyShared: { color: theme.palette.primary.main },
	})
);

function OnlySharedSwitch() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const onlyShared = useSelector(selectOnlyShared);
	const handleChange = () => dispatch(onlySharedToggled(!onlyShared));
	return (
		<FormGroup row>
			<FormControlLabel
				className={
					onlyShared
						? clsx([classes.label, classes.isOnlyShared])
						: classes.label
				}
				control={
					<Switch
						checked={onlyShared}
						onChange={handleChange}
						name="checkedB"
						color="primary"
					/>
				}
				label="Only shared"
			/>
		</FormGroup>
	);
}

export default OnlySharedSwitch;
