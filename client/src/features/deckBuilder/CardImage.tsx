import React from "react";
import { useSelector } from "react-redux";
import { selectSearchResult } from "./deckBuilderSlice";
import CardBack from "../../assets/cardBack.jpg";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		imgDiv: { maxHeight: "371px", maxWidth: "268px" },
		image: { height: "100%", width: "100%" },
	})
);
function CardImage() {
	const classes = useStyles();
	const card = useSelector(selectSearchResult);
	const [cardFace, setCardFace] = React.useState(0);
	React.useEffect(() => {
		setCardFace(0);
	}, [card]);
	const hasImage = Boolean(card?.image_uris !== undefined);
	const hasMoreFaces = Boolean(card?.card_faces !== undefined);
	const handleFlipCardFace = () =>
		hasMoreFaces ? setCardFace((prevState) => (!prevState ? 1 : 0)) : null;

	return (
		<div className={classes.imgDiv} onClick={handleFlipCardFace}>
			{hasImage ? (
				<img
					className={classes.image}
					src={card.image_uris.normal}
					alt={card.name}
				/>
			) : hasMoreFaces ? (
				<img
					className={classes.image}
					src={card?.card_faces[cardFace].image_uris.normal}
					alt="No results"
				/>
			) : (
				<img className={classes.image} src={CardBack} alt="No results" />
			)}
		</div>
	);
}

export default CardImage;
