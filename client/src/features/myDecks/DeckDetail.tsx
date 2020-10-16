import React from "react";
import { IDeck, IRouteParams } from "../../declarations/index";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthorizedUser } from "../auth/authSlice";
import { fetchMyDecks, selectMyDecks } from "./myDecksSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import DeckDetailTable from "./DeckDetailTable";
import DeckInfo from "./DeckInfo";
import OnlySharedSwitch from "./OnlySharedSwitch";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			maxWidth: "48rem",
			[theme.breakpoints.down("xs")]: {
				padding: 0,
			},
		},
		table: {
			minWidth: 350,
		},
		quantityCell: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-around",
			height: "16px",
		},
		iconButton: { padding: "1px" },
	})
);

function DeckDetail() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const params = useParams<IRouteParams>();
	const [deck, setDeck] = React.useState<IDeck | undefined>(undefined);
	const authUser = useSelector(selectAuthorizedUser);
	const decks = useSelector(selectMyDecks);

	React.useEffect(() => {
		if (!decks?.length && authUser) {
			dispatch(fetchMyDecks());
		}
	}, [decks, authUser, dispatch]);

	React.useEffect(() => {
		decks?.length && setDeck(decks.find((deck) => deck._id === params.id));
	}, [decks, params]);
	return (
		<Container className={classes.container}>
			{deck ? (
				<>
					{" "}
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="flex-start"
					>
						<DeckInfo deck={deck} />
						<OnlySharedSwitch />
					</Box>
					<DeckDetailTable deck={deck} />
				</>
			) : (
				<div>Loading...</div>
			)}
		</Container>
	);
}

export default DeckDetail;
