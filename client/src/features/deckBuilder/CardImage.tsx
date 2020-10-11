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
	const hasOneImage = Boolean(card?.image_uris.normal !== undefined);
	const hasMoreFaces = Boolean(card?.image_uris[1] !== undefined);
	const handleFlipCardFace = () =>
		hasMoreFaces ? setCardFace((prevState) => (!prevState ? 1 : 0)) : null;
	console.log(card?.image_uris);
	return (
		<div className={classes.imgDiv} onClick={handleFlipCardFace}>
			{hasOneImage ? (
				<img
					className={classes.image}
					src={card.image_uris.normal}
					alt={card.name}
				/>
			) : hasMoreFaces ? (
				<img
					className={classes.image}
					src={card.image_uris[cardFace].normal}
					alt="No results"
				/>
			) : (
				<img className={classes.image} src={CardBack} alt="No results" />
			)}
		</div>
	);
}

export default CardImage;
