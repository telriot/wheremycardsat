import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDeckFormat, formatChanged } from "./deckBuilderSlice";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		formControl: {
			minWidth: 120,
		},
		selectEmpty: {
			marginTop: theme.spacing(2),
		},
	})
);

const formats = [
	{ name: "edh", display: "EDH" },
	{ name: "brawl", display: "Brawl" },
	{ name: "standard", display: "Standard" },
	{ name: "pioneer", display: "Pioneer" },
	{ name: "modern", display: "Modern" },
	{ name: "legacy", display: "Legacy" },
	{ name: "vintage", display: "Vintage" },
	{ name: "pauper", display: "Pauper" },
];

export default function NativeSelects() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const format = useSelector(selectDeckFormat);

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		dispatch(formatChanged(event.target.value as string));
	};

	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<InputLabel id="demo-simple-select-outlined-label">Format</InputLabel>
			<Select
				labelId="demo-simple-select-outlined-label"
				id="demo-simple-select-outlined"
				value={format}
				onChange={handleChange}
				label="Format"
			>
				{formats.map((format) => (
					<MenuItem key={`format-${format.name}`} value={format.name}>
						{format.display}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
