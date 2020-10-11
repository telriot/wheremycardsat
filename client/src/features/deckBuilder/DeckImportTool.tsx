import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import { parse } from "path";
import { fetchCardCollection } from "./deckBuilderSlice";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		input: { display: "none" },
	})
);
function DeckImportTool() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = React.useState(false);
	let fileReader: any;
	const handleLoadStart = () => {
		setIsLoading(true);
	};
	const handleFileRead = async () => {
		const content = fileReader.result;

		const parseContent = (content: string) => {
			return content.split("\n").map((line: string) => {
				const [quantity, ...cardName] = line.split(/\s/);
				return {
					name: cardName.join(" ").trim(),
					quantity: parseInt(quantity),
				};
			});
		};

		const buildRequestObj = (
			content: Array<{ name: string; quantity: number }>
		) => {
			let identifiers: Array<{ name: string }> = [];
			content.forEach(
				(card) => card.name.length && identifiers.push({ name: card.name })
			);
			return { identifiers: identifiers };
		};

		const buildQuantityList = (
			content: Array<{ name: string; quantity: number }>
		) => {
			let quantityList: any = {};
			content.forEach(
				(card) =>
					card.name && (quantityList[card.name] = { quantity: card.quantity })
			);
			return quantityList;
		};

		const parsedContent = parseContent(content);
		const quantityList = buildQuantityList(parsedContent);
		const requestObj = buildRequestObj(parsedContent);
		await dispatch(
			fetchCardCollection({ collection: requestObj, quantities: quantityList })
		);
		setIsLoading(false);
	};
	const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.currentTarget.files;
		if (!files?.length) return;
		fileReader = new FileReader();
		fileReader.onloadstart = handleLoadStart;
		fileReader.onloadend = handleFileRead;
		fileReader.readAsText(files[0]);
	};
	return (
		<div>
			<label>
				<Button variant="contained" component="label">
					<input
						accept=".txt"
						className={classes.input}
						multiple
						type="file"
						onChange={handleFileSelected}
					/>
					{isLoading ? "Loading..." : "Import"}
				</Button>
			</label>
		</div>
	);
}

export default DeckImportTool;
