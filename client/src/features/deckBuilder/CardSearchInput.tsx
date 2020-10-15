import React from "react";
import { useDispatch } from "react-redux";
import { fetchIndividualCard } from "./deckBuilderSlice";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: { maxWidth: "48rem" },
		autocompleteDiv: { width: "300px" },
	})
);

function CardSearchInput() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [inputValue, setInputValue] = React.useState("");
	const [options, setOptions] = React.useState<string[]>([]);
	const [value, setValue] = React.useState<any>(null);
	const [debouncedInputValue] = useDebounce(inputValue, 300);

	const fetchAutocomplete = React.useCallback(
		async (debouncedInputValue: string) => {
			try {
				const response = await axios.get(
					`https://api.scryfall.com/cards/autocomplete?q=${debouncedInputValue}`
				);
				const data = response.data.data;
				setOptions(data);
			} catch (error) {
				console.error(error);
			}
		},

		[debouncedInputValue]
	);

	React.useEffect(() => {
		if (debouncedInputValue === "") {
			setOptions(value ? [value] : []);
			return undefined;
		}
		fetchAutocomplete(debouncedInputValue);
	}, [debouncedInputValue, fetchAutocomplete, value]);

	React.useEffect(() => {
		if (value) {
			if (value === debouncedInputValue) dispatch(fetchIndividualCard(value));
		}
	}, [debouncedInputValue, dispatch, value]);

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
