import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useDispatch, useSelector } from "react-redux";
import {
	selectMainDeckList,
	cardQuantityIncreased,
	cardQuantityDecreased,
} from "./deckBuilderSlice";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
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

function createData(
	name: string,
	calories: number,
	fat: number,
	carbs: number,
	protein: number
) {
	return { name, calories, fat, carbs, protein };
}

export default function DeckTable() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const mainDeckList = useSelector(selectMainDeckList);
	const handleAddClick = (cardName: string, quantity: number = 1) => () => {
		dispatch(cardQuantityIncreased({ cardName, quantity }));
	};
	const handleRemoveClick = (cardName: string, quantity: number = 1) => () => {
		dispatch(cardQuantityDecreased({ cardName, quantity }));
	};

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} size="small" aria-label="a deck table">
				<TableHead>
					<TableRow>
						<TableCell>Card name</TableCell>
						<TableCell align="right">Mana Cost</TableCell>
						<TableCell align="center">#</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.entries(mainDeckList).map(([cardName, cardObject]: any) => {
						const hasFaces = Boolean(cardObject.card_faces !== undefined);
						console.log(cardObject);
						return (
							<TableRow key={cardName}>
								<TableCell component="th" scope="row">
									{cardObject.name}
								</TableCell>
								<TableCell align="right">
									{hasFaces
										? cardObject.card_faces[0].mana_cost
										: cardObject.mana_cost}
								</TableCell>
								<TableCell align="center">
									<div className={classes.quantityCell}>
										<IconButton
											className={classes.iconButton}
											onClick={handleAddClick(cardName, 1)}
										>
											<AddIcon fontSize="small" />
										</IconButton>
										{cardObject.quantity}
										<IconButton
											className={classes.iconButton}
											onClick={handleRemoveClick(cardName, 1)}
										>
											<RemoveIcon fontSize="small" />
										</IconButton>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
