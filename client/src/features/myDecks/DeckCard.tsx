import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useDispatch } from "react-redux";
import { deleteDeck } from "./myDecksSlice";
import DeckInfo from "./DeckInfo";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			maxWidth: 345,
		},
		media: {
			height: 140,
			objectPosition: "top",
		},
	})
);

function DeckCard({ deck }: { deck: any }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const history = useHistory();

	const firstCardName = Object.keys(deck.deckList)[0];

	const handleView = () => {
		history.push(`/my-decks/${deck._id}`);
	};
	const handleDelete = () => {
		if (window.confirm(`Do you really want to delete ${deck.name}?`)) {
			dispatch(deleteDeck(deck._id));
		}
	};

	return (
		<Card className={classes.root}>
			<CardActionArea onClick={handleView}>
				<CardMedia
					className={classes.media}
					image={deck.deckList[firstCardName].image_uris.art_crop}
					title={deck.name}
				/>
				<CardContent>
					<DeckInfo deck={deck} small />
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button onClick={handleView} size="small" color="primary">
					View
				</Button>
				<Button onClick={handleDelete} size="small" color="secondary">
					Delete
				</Button>
			</CardActions>
		</Card>
	);
}

export default DeckCard;
