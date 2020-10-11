import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDebounce } from "use-debounce";
import { useDispatch, useSelector } from "react-redux";
import { fetchIndividualCard } from "./deckBuilderSlice";
import axios from "axios";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: { maxWidth: "48rem" },
		autocompleteDiv: { width: "300px" },
	})
);
function CardSearchInput() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [value, setValue] = React.useState<any>(null);
	const [inputValue, setInputValue] = React.useState("");
	const [options, setOptions] = React.useState<string[]>([]);
	const [debouncedInputValue] = useDebounce(inputValue, 300);
	const fetchAutocomplete = async (debouncedInputValue: string) => {
		try {
			const response = await axios.get(
				`https://api.scryfall.com/cards/autocomplete?q=${debouncedInputValue}`
			);
			const data = response.data.data;
			setOptions(data);
		} catch (error) {
			console.error(error);
		}
	};

	React.useEffect(() => {
		if (debouncedInputValue === "") {
			setOptions(value ? [value] : []);
			return undefined;
		}
		fetchAutocomplete(debouncedInputValue);
	}, [value, debouncedInputValue]);

	React.useEffect(() => {
		if (value) {
			if (value === debouncedInputValue) dispatch(fetchIndividualCard(value));
		}
	}, [value, debouncedInputValue]);
	return (
		<div className={classes.autocompleteDiv}>
			<Autocomplete
				id="scryfall-api-autocomplete"
				getOptionSelected={(option, value) => option === value}
				getOptionLabel={(option) => option}
				options={[...options, value || ""]}
				autoComplete
				includeInputInList
				filterSelectedOptions
				value={value}
				onChange={(event: any, newValue: any) => {
					setValue(newValue);
					setOptions(newValue ? [newValue, ...options] : options);
				}}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue);
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Add a card"
						variant="outlined"
						fullWidth
					/>
				)}
				renderOption={(option) => <span>{option}</span>}
			/>
		</div>
	);
}

export default CardSearchInput;
