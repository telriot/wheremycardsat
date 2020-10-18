import React from "react";
import { IDeck, IRouteParams } from "../../declarations/index";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthorizedUser } from "../auth/authSlice";
import {
	fetchMyDecks,
	onlySharedToggled,
	selectMyDecks,
	selectDecksStatus,
	selectOnlyShared,
} from "./myDecksSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import AlertCard from "../../components/AlertCard";
import DeckDetailTable from "./DeckDetailTable";
import DeckInfo from "./DeckInfo";
import SharedSwitch from "./SharedSwitch";
import AddCardBox from "./AddCardBox";

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
	const [addCardOpen, setAddCardOpen] = React.useState(false);
	const [deck, setDeck] = React.useState<IDeck | undefined>(undefined);
	const authUser = useSelector(selectAuthorizedUser);
	const decks = useSelector(selectMyDecks);
	const onlyShared = useSelector(selectOnlyShared);
	const status = useSelector(selectDecksStatus);

	React.useEffect(() => {
		if (!decks?.length && authUser) {
			dispatch(fetchMyDecks());
		}
	}, [decks, authUser, dispatch]);

	React.useEffect(() => {
		decks?.length && setDeck(decks.find((deck) => deck._id === params.id));
	}, [decks, params]);

	const handleAddCardOpen = () => setAddCardOpen((prevState) => !prevState);
	const handleOnlyShared = () => dispatch(onlySharedToggled(!onlyShared));

	const ContentPending = () => (
		<LinearProgress className={classes.linearProgress} />
	);
	const ContentRejected = () => (
		<AlertCard message="Something went wrong with our servers" />
	);

	return (
		<Container className={classes.container}>
			{deck && status === "fulfilled" ? (
				<>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="flex-start"
						mb={1}
					>
						<DeckInfo deck={deck} />
						<Box>
							<SharedSwitch
								handleChange={handleOnlyShared}
								open={onlyShared}
								label="Only shared"
								color="primary"
							/>
							<SharedSwitch
								handleChange={handleAddCardOpen}
								open={addCardOpen}
								label="Add new cards"
								color="secondary"
							/>
						</Box>
					</Box>
					<Collapse in={addCardOpen} timeout="auto" unmountOnExit>
						<AddCardBox deckID={deck._id} />
					</Collapse>

					<DeckDetailTable deck={deck} />
				</>
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
