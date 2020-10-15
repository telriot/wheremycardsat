import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { selectMyDecks, fetchMyDecks } from "./myDecksSlice";
import { useParams } from "react-router-dom";
import Container from "@material-ui/core/Container";
import DeckDetailTable from "./DeckDetailTable";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: { maxWidth: "48rem" },
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
	const myDecks = useSelector(selectMyDecks);

	return (
		<Container className={classes.container}>
			<DeckDetailTable />
		</Container>
	);
}

export default DeckDetail;
