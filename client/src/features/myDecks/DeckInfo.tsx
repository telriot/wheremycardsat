import React from "react";
import { IDeck } from "../../declarations";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

function DeckInfo({ deck }: { deck: IDeck }) {
	const vowelsRegex = new RegExp(/[aeiou]/);
	const startsWithVowel = (string: string) =>
		vowelsRegex.test(string.charAt(0));
	const article = startsWithVowel(deck.format) ? "An" : "A";
	return (
		<Box padding={1}>
			<Typography variant="h4">{deck.name}</Typography>
			<Typography variant="subtitle1" color="textSecondary">
				{`${article} ${deck.format} deck`}
			</Typography>
		</Box>
	);
}

export default DeckInfo;
