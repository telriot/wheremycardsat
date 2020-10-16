import React from "react";
import { useSelector } from "react-redux";
import { selectSearchResult } from "./deckBuilderSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import CardBack from "../../assets/cardBack.jpg";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		imgDiv: { maxWidth: "100%" },
		image: { height: "100%", width: "100%" },
	})
);

function CardImage() {
	const card = useSelector(selectSearchResult);
	const classes = useStyles();
	const [cardFace, setCardFace] = React.useState(0);

	React.useEffect(() => {
		setCardFace(0);
	}, [card]);

	const hasOneImage = Boolean(card?.image_uris.normal !== undefined);
	const hasMoreFaces = Boolean(card?.image_uris[1] !== undefined);

	const handleFlipCardFace = () =>
		hasMoreFaces ? setCardFace((prevState) => (!prevState ? 1 : 0)) : null;

	return (
		<div className={classes.imgDiv} onClick={handleFlipCardFace}>
			<img
				className={classes.image}
				src={
					hasOneImage
						? card.image_uris.normal || CardBack
						: hasMoreFaces
						? card.image_uris[cardFace].normal || CardBack
						: CardBack
				}
				alt={card?.name ? card.name : "No Result"}
			/>
		</div>
	);
}

export default CardImage;
