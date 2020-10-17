import React from "react";
import { IDeck, IRouteParams } from "../../declarations/index";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthorizedUser } from "../auth/authSlice";
import { fetchMyDecks, selectMyDecks, selectDecksStatus } from "./myDecksSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import AlertCard from "../../components/AlertCard";
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
		linearProgress: { width: "100%" },
	})
);

function DeckDetail() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const params = useParams<IRouteParams>();
	const [deck, setDeck] = React.useState<IDeck | undefined>(undefined);
	const authUser = useSelector(selectAuthorizedUser);
	const decks = useSelector(selectMyDecks);
	const status = useSelector(selectDecksStatus);

	React.useEffect(() => {
		if (!decks?.length && authUser) {
			dispatch(fetchMyDecks());
		}
	}, [decks, authUser, dispatch]);

	React.useEffect(() => {
		decks?.length && setDeck(decks.find((deck) => deck._id === params.id));
	}, [decks, params]);

	const ContentLoaded = ({ deck }: { deck: IDeck }) => (
		<>
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
	);

	const ContentPending = () => (
		<LinearProgress className={classes.linearProgress} />
	);
	const ContentRejected = () => (
		<AlertCard message="Something went wrong with our servers" />
	);

	return (
		<Container className={classes.container}>
			{status === "fulfilled" && deck ? (
				<ContentLoaded deck={deck} />
			) : status === "pending" ? (
				<ContentPending />
			) : status === "rejected" ? (
				<ContentRejected />
			) : status === "fulfilled" && decks.length === 0 ? (
				<AlertCard />
			) : (
				<div></div>
			)}
		</Container>
	);
}

export default DeckDetail;
