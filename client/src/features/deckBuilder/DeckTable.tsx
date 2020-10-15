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
import QuantityToggler, {
	TQuantityTogglerTarget,
} from "../../components/QuantityToggler";
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

export default function DeckTable() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const mainDeckList = useSelector(selectMainDeckList);
	const handleChangeClick = (
		cardname: string,
		quantity: number = 1,
		target: TQuantityTogglerTarget
	) => () => {
		quantity
			? dispatch(cardQuantityIncreased({ cardname, quantity }))
			: dispatch(cardQuantityDecreased({ cardname, quantity }));
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
					{Object.entries(mainDeckList).map(([cardname, cardObject]: any) => {
						const hasFaces = Boolean(cardObject.card_faces !== undefined);
						return (
							<TableRow key={cardname}>
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
										<QuantityToggler
											quantity={cardObject.quantity}
											cardname={cardname}
											handleChangeClick={handleChangeClick}
											target="quantity"
										/>
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
