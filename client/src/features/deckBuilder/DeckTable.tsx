import React from "react";
import { TSortOrder } from "../../declarations/index";
import { sortCardsByParam } from "../../lib/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
	selectMainDeckList,
	cardQuantityIncreased,
	cardQuantityDecreased,
} from "./deckBuilderSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import QuantityToggler, {
	TQuantityTogglerTarget,
} from "../../components/QuantityToggler";
import ManaFont from "../../components/ManaFont";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import StyledTableCell from "../../components/StyledTableCell";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: { marginBottom: theme.spacing(1) },
		table: {
			minWidth: 310,
		},
		setterCell: {
			color: theme.palette.primary.main,
			cursor: "pointer",
			transition: "color .15s",
			minWidth: "6rem",
			"&:hover, &:focus": {
				color: theme.palette.primary.dark,
			},
		},
		iconButton: { padding: "1px" },
	})
);

export default function DeckTable() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const mainDeckList = useSelector(selectMainDeckList);
	const [sortOrder, setSortOrder] = React.useState<TSortOrder>("name");
	const handleSetSort = (criteria: TSortOrder) => () => {
		setSortOrder(criteria);
	};
	const handleChangeClick = (
		cardname: string,
		quantity: number,
		target: TQuantityTogglerTarget
	) => () => {
		quantity > 0
			? dispatch(cardQuantityIncreased({ cardname, quantity }))
			: dispatch(cardQuantityDecreased({ cardname, quantity }));
	};

	return (
		<TableContainer className={classes.container} component={Paper}>
			<Table className={classes.table} size="small" aria-label="a deck table">
				<TableHead>
					<TableRow>
						<StyledTableCell
							className={classes.setterCell}
							onClick={handleSetSort("name")}
						>
							<Box display="flex" alignItems="center">
								Card name {sortOrder === "name" && <ArrowDropDownIcon />}
							</Box>
						</StyledTableCell>
						<StyledTableCell
							className={classes.setterCell}
							onClick={handleSetSort("manacost")}
							align="right"
						>
							<Box display="flex" alignItems="center" justifyContent="flex-end">
								Mana Cost{sortOrder === "manacost" && <ArrowDropDownIcon />}{" "}
							</Box>
						</StyledTableCell>
						<StyledTableCell align="center">Quantity</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortCardsByParam(Object.values(mainDeckList), sortOrder)!.map(
						(cardObject: any) => {
							const hasFaces = Boolean(cardObject.card_faces !== undefined);
							return (
								<TableRow key={cardObject.name}>
									<StyledTableCell component="th" scope="row">
										{cardObject.name}
									</StyledTableCell>
									<StyledTableCell align="right">
										<ManaFont
											manacost={
												hasFaces
													? cardObject.card_faces[0].mana_cost
													: cardObject.mana_cost
											}
										/>
									</StyledTableCell>
									<StyledTableCell align="center">
										<QuantityToggler
											quantity={cardObject.quantity}
											cardname={cardObject.name}
											handleChangeClick={handleChangeClick}
											target="quantity"
										/>
									</StyledTableCell>
								</TableRow>
							);
						}
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
